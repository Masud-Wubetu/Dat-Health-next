import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfilePictureUpload from './profile-picture-upload';

export const dynamic = 'force-dynamic';

export default async function Profile() {
    const session = await getSession();
    if (!session || !session.user?.id) {
        redirect('/auth/login?callbackUrl=/profile');
    }

    const userId = session.user.id;

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            roles: true
        }
    });

    if (!userData) {
        redirect('/auth/login');
    }

    const roles = userData.roles.map((r: any) => r.name);
    let patientData = null;

    if (roles.includes('PATIENT')) {
        patientData = await prisma.patient.findUnique({
            where: { userId: userId }
        });
    }

    const formatDate = (dateString: Date | string | null | undefined) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatBloodGroup = (bloodGroup: string | null | undefined) => {
        if (!bloodGroup) return 'Not provided';
        return bloodGroup.replace('_', ' ');
    };

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header-main">
                    <ProfilePictureUpload 
                        initialPictureUrl={userData.profilePictureUrl} 
                        userName={userData.name} 
                    />
                    <div className="profile-title-section">
                        <h1 className="profile-title">My Profile</h1>
                        <p className="profile-subtitle">{userData.name}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <Link href="/update-profile" className="btn btn-primary">
                        Update Profile
                    </Link>
                    <Link href="/update-password" className="btn btn-secondary">
                        Update Password
                    </Link>
                    <Link href="/book-appointment" className="btn btn-primary">
                        Book Appointment
                    </Link>
                    <Link href="/my-appointments" className="btn btn-secondary">
                        My Appointments
                    </Link>
                    <Link href="/consultation-history" className="btn btn-outline">
                        Consultation History
                    </Link>
                </div>

                <div className="profile-content">
                    {/* User Information Section */}
                    <div className="profile-section">
                        <h2 className="section-title">Account Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label className="info-label">Name</label>
                                <div className="info-value">{userData.name || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Email</label>
                                <div className="info-value">{userData.email || 'Not provided'}</div>
                            </div>

                            <div className="info-item">
                                <label className="info-label">Roles</label>
                                <div className="info-value">
                                    {roles.join(', ') || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Information Section */}
                    {patientData ? (
                        <div className="profile-section">
                            <h2 className="section-title">Medical Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label className="info-label">First Name</label>
                                    <div className="info-value">{patientData.firstName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Last Name</label>
                                    <div className="info-value">{patientData.lastName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Phone</label>
                                    <div className="info-value">{patientData.phone || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Date of Birth</label>
                                    <div className="info-value">{formatDate(patientData.dateOfBirth)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Blood Group</label>
                                    <div className="info-value">{formatBloodGroup(patientData.bloodGroup)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Genotype</label>
                                    <div className="info-value">{patientData.genotype || 'Not provided'}</div>
                                </div>
                                <div className="info-item full-width">
                                    <label className="info-label">Known Allergies</label>
                                    <div className="info-value">
                                        {patientData.knownAllergies || 'No known allergies'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-section">
                            <div className="alert alert-info">
                                <p>No patient profile found. Please update your profile to add medical information.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}