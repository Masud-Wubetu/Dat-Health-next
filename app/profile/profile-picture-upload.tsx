'use client'

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';

export default function ProfilePictureUpload({ initialPictureUrl, userName }: { initialPictureUrl: string | null, userName: string }) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const router = useRouter();

    const handleProfilePictureChange = async (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const response = await apiService.uploadProfilePicture(file);
            if (response.data.statusCode === 200) {
                setUploadSuccess('Profile picture updated successfully!');
                event.target.value = '';
                router.refresh();
            }
        } catch (error: any) {
            setUploadError(error.response?.data?.message || 'An error occurred while uploading the picture');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-picture-section">
            <div className="profile-picture-container">
                {initialPictureUrl ? (
                    <div className="profile-picture-wrapper">
                        <Image
                            src={initialPictureUrl}
                            alt="Profile"
                            width={150}
                            height={150}
                            className="profile-picture"
                            priority
                        />
                    </div>
                ) : null}
                <div className={`profile-picture-placeholder ${initialPictureUrl ? 'hidden' : ''}`}>
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="profile-picture-overlay">
                    <label htmlFor="profile-picture-upload" className="upload-label">
                        {uploading ? 'Uploading...' : 'Change Photo'}
                    </label>
                    <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
            {uploadError && (
                <div className="alert alert-error mt-1">
                    {uploadError}
                </div>
            )}
            {uploadSuccess && (
                <div className="alert alert-success mt-1">
                    {uploadSuccess}
                </div>
            )}
        </div>
    );
}
