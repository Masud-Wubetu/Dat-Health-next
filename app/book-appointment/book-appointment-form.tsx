'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';

export default function BookAppointmentForm({ doctors }: { doctors: any[] }) {
    const [formData, setFormData] = useState<any>({
        doctorId: '',
        purposeOfConsultation: '',
        initialSymptoms: '',
        startTime: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.doctorId) {
            setError('Please select a doctor');
            return;
        }

        if (!formData.startTime) {
            setError('Please select appointment date and time');
            return;
        }

        const appointmentData = {
            ...formData,
            doctorId: parseInt(formData.doctorId),
            startTime: new Date(formData.startTime).toISOString()
        };

        setIsSubmitting(true);
        try {
            const response = await apiService.bookAppointment(appointmentData);

            if (response.data.statusCode === 200) {
                setSuccess('Appointment booked successfully!');
                setFormData({ doctorId: '', purposeOfConsultation: '', initialSymptoms: '', startTime: '' });
                setTimeout(() => { router.push('/my-appointments'); }, 5000);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while booking appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/profile');
    };

    const formatDoctorName = (doctor: any) => {
        if (doctor.firstName && doctor.lastName) {
            return `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization?.replace(/_/g, ' ')}`;
        }
        return `Dr. ${doctor.user?.name} - ${doctor.specialization?.replace(/_/g, ' ') || 'General Practice'}`;
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Book Appointment</h2>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Select Doctor</label>
                    <select
                        name="doctorId"
                        className="form-select"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {formatDoctorName(doctor)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Purpose of Consultation</label>
                    <input
                        type="text"
                        name="purposeOfConsultation"
                        className="form-input"
                        value={formData.purposeOfConsultation}
                        onChange={handleChange}
                        placeholder="Briefly describe why you need consultation"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Initial Symptoms</label>
                    <textarea
                        name="initialSymptoms"
                        className="form-input"
                        value={formData.initialSymptoms}
                        onChange={handleChange}
                        placeholder="Describe your symptoms in detail"
                        rows={4}
                        required
                    />
                    <small className="form-help">Be specific about your symptoms, duration, and severity</small>
                </div>

                <div className="form-group">
                    <label className="form-label">Preferred Date & Time</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        className="form-input"
                        value={formData.startTime}
                        onChange={handleChange}
                        min={getMinDateTime()}
                        required
                    />
                    <small className="form-help">Select your preferred appointment date and time</small>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <span className="btn-spinner" />}
                        {isSubmitting ? 'Booking...' : 'Book Appointment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
