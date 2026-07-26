import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import AppointmentsList from './appointments-list';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MyAppointments() {
    const session = await getSession();
    if (!session || !session.user?.patient?.id) {
        redirect('/auth/login?callbackUrl=/my-appointments');
    }

    const patientId = session.user.patient.id;

    const appointments = await prisma.appointment.findMany({
        where: {
            patientId: patientId
        },
        include: {
            doctor: {
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
                    <Link href="/book-appointment" className="btn btn-primary">
                        Book New Appointment
                    </Link>
                </div>

                <AppointmentsList initialAppointments={appointments} />
            </div>
        </div>
    );
}