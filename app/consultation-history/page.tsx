import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ConsultationHistory({
    searchParams
}: {
    searchParams: Promise<{ appointmentId?: string }>
}) {
    const session = await getSession();
    if (!session || !session.user?.patient?.id) {
        redirect('/auth/login?callbackUrl=/consultation-history');
    }

    const patientId = session.user.patient.id;
    const { appointmentId } = await searchParams;

    let consultations: any[] = [];

    if (appointmentId) {
        const appointmentIdNum = parseInt(appointmentId);
        const consultation = await prisma.consultation.findUnique({
            where: {
                appointmentId: appointmentIdNum
            },
            include: {
                appointment: {
                    include: {
                        doctor: {
                            include: {
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (consultation && consultation.appointment.patientId === patientId) {
            consultations = [consultation];
        }
    } else {
        consultations = await prisma.consultation.findMany({
            where: {
                appointment: {
                    patientId: patientId
                }
            },
            include: {
                appointment: {
                    include: {
                        doctor: {
                            include: {
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                consultationDate: 'desc'
            }
        });
    }

    const formatDateTime = (dateTimeString: Date | string) => {
        return new Date(dateTimeString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDoctorName = (doctor: any) => {
        if (doctor.firstName && doctor.lastName) {
            return `Dr. ${doctor.firstName} ${doctor.lastName}`;
        }
        return `Dr. ${doctor.user?.name}`;
    };

    return (
        <div className="container">
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">
                        {appointmentId ? 'Consultation Notes' : 'Consultation History'}
                    </h1>
                    <Link href="/my-appointments" className="btn btn-secondary">
                        Back to Appointments
                    </Link>
                </div>

                {consultations.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Consultation History</h3>
                        <p>You don't have any consultation records yet.</p>
                        <Link href="/book-appointment" className="btn btn-primary">
                            Book an Appointment
                        </Link>
                    </div>
                ) : (
                    <div className="consultations-list">
                        {consultations.map((consultation) => (
                            <div key={consultation.id} className="consultation-card">
                                <div className="consultation-header">
                                    <div className="consultation-doctor-info">
                                        <h3>{formatDoctorName(consultation.appointment.doctor)}</h3>
                                        <p className="specialization">
                                            {consultation.appointment.doctor.specialization?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <span className="consultation-date">
                                        {formatDateTime(consultation.consultationDate)}
                                    </span>
                                </div>

                                <div className="consultation-details">
                                    <div className="consultation-section">
                                        <h4>Subjective Notes</h4>
                                        <div className="consultation-content">
                                            {consultation.subjectiveNotes || 'No subjective notes recorded.'}
                                        </div>
                                    </div>

                                    <div className="consultation-section">
                                        <h4>Objective Findings</h4>
                                        <div className="consultation-content">
                                            {consultation.objectiveFindings || 'No objective findings recorded.'}
                                        </div>
                                    </div>

                                    <div className="consultation-section">
                                        <h4>Assessment</h4>
                                        <div className="consultation-content">
                                            {consultation.assessment || 'No assessment recorded.'}
                                        </div>
                                    </div>

                                    <div className="consultation-section">
                                        <h4>Treatment Plan</h4>
                                        <div className="consultation-content">
                                            {consultation.plan || 'No treatment plan recorded.'}
                                        </div>
                                    </div>
                                </div>

                                {consultation.appointmentId && (
                                    <div className="consultation-footer">
                                        <Link
                                            href={`/my-appointments`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Appointment Details
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}