import { prisma } from '@/lib/db';
import BookAppointmentForm from './book-appointment-form';

export const dynamic = 'force-dynamic'; // Ensures this page isn't statically cached since doctors can change

export default async function BookAppointment() {
    // Fetch doctors directly on the server
    const doctors = await prisma.doctor.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePictureUrl: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });

    return (
        <div className="container">
            <BookAppointmentForm doctors={doctors} />
        </div>
    );
}
