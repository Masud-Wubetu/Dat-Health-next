import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfilePictureUpload from '@/app/profile/profile-picture-upload';

export const dynamic = 'force-dynamic';

export default async function DoctorProfile() {
    const session = await getSession();
    if (!session || !session.user?.id) {
        redirect('/auth/login?callbackUrl=/doctor/profile');
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
    let doctorData = null;

    if (roles.includes('DOCTOR')) {
        doctorData = await prisma.doctor.findUnique({
            where: { userId: userId }
        });
    } else {
        redirect('/unauthorized');
    }

    const formatSpecialization = (spec: string | null | undefined) => {
        if (!spec) return 'Not specified';
        return spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
                        <h1 className="profile-title">Doctor Profile</h1>
                        <p className="profile-subtitle">Dr. {userData.name}</p>
                        {doctorData && (
                            <p className="profile-specialization">
                                {formatSpecialization(doctorData.specialization)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="profile-actions">
                    <Link href="/doctor/update-profile" className="btn btn-primary">
                        Update Profile
                    </Link>
                    <Link href="/update-password" className="btn btn-secondary">
                        Update Password
                    </Link>
                    <Link href="/doctor/appointments" className="btn btn-primary">
                        My Appointments
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
                                <label className="info-label">User ID</label>
                                <div className="info-value">{userData.id || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Roles</label>
                                <div className="info-value">
                                    {roles.join(', ') || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Information Section */}
                    {doctorData ? (
                        <div className="profile-section">
                            <h2 className="section-title">Professional Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label className="info-label">First Name</label>
                                    <div className="info-value">{doctorData.firstName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Last Name</label>
                                    <div className="info-value">{doctorData.lastName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Specialization</label>
                                    <div className="info-value">{formatSpecialization(doctorData.specialization)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Doctor ID</label>
                                    <div className="info-value">{doctorData.id || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">License Number</label>
                                    <div className="info-value">{doctorData.licenseNumber || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-section">
                            <div className="alert alert-info">
                                <p>No doctor profile found. Please update your profile to add professional information.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}