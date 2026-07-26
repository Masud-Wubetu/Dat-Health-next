'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';

export default function LogoutButton() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await apiService.logout();
            setShowLogoutModal(false);
            router.push('/');
            router.refresh(); // Refresh to update server components with new auth state
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <button onClick={handleLogoutClick} className="logout-btn">
                Logout
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirm Logout</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout?</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={handleCancelLogout}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="btn btn-primary"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
