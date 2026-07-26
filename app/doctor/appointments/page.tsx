import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import DoctorAppointmentsList from './doctor-appointments-list';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DoctorAppointments() {
    const session = await getSession();
    if (!session || !session.user?.doctor?.id) {
        redirect('/auth/login?callbackUrl=/doctor/appointments');
    }

    const doctorId = session.user.doctor.id;

    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId: doctorId
        },
        include: {
            patient: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            startTime: 'desc'
        }
    });

    return (
        <div className="container">
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">My Appointments</h1>
                    <Link href="/doctor/profile" className="btn btn-secondary">
                        Back to Profile
                    </Link>
                </div>

                <DoctorAppointmentsList initialAppointments={appointments} />
            </div>
        </div>
    );
}