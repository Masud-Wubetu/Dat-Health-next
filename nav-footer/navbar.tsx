import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from './logout-button';
import NavLink from './nav-link';

export default async function Navbar() {
    const session = await getSession();
    
    const isAuthenticated = !!session;
    const userRoles = session?.user?.roles || [];
    const isPatient = userRoles.includes('PATIENT');
    const isDoctor = userRoles.includes('DOCTOR');

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link href="/" className="logo">
                        DAT Health
                    </Link>

                    <div className="nav-links">
                        <NavLink href="/" className="nav-link">
                            Home
                        </NavLink>

                        {!isAuthenticated ? (
                            <>
                                <NavLink href="/auth/login" className="nav-link">
                                    Login
                                </NavLink>
                                <NavLink href="/auth/register" className="nav-link">
                                    Register as Patient
                                </NavLink>
                                <NavLink href="/auth/doctor-register" className="nav-link">
                                    Register as Doctor
                                </NavLink>
                            </>
                        ) : (
                            <>
                                {/* Patient specific links */}
                                {isPatient && (
                                    <>
                                        <NavLink href="/profile" className="nav-link">
                                            Profile
                                        </NavLink>
                                        <NavLink href="/book-appointment" className="nav-link">
                                            Book Appointment
                                        </NavLink>
                                        <NavLink href="/my-appointments" className="nav-link">
                                            My Appointments
                                        </NavLink>
                                    </>
                                )}

                                {/* Doctor specific links */}
                                {isDoctor && (
                                    <>
                                        <NavLink href="/doctor/profile" className="nav-link">
                                            Doctor Profile
                                        </NavLink>
                                        <NavLink href="/doctor/appointments" className="nav-link">
                                            My Appointments
                                        </NavLink>
                                    </>
                                )}

                                <LogoutButton />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
