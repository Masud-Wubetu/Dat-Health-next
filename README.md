# DAT Health 🩺

DAT Health is a modern, fast, and secure telemedicine platform built to connect patients and healthcare professionals. Designed with a clean interface and robust backend services, the application allows patients to book virtual consultations, while giving doctors a streamlined interface to manage appointments, keep patient consultation notes, and provide digital care.

---

## 📺 Project Walkthrough

[![DAT Health Walkthrough Video](https://img.shields.io/badge/Loom_Walkthrough-Click_to_Watch-625df5?style=for-the-badge&logo=loom)](https://www.loom.com/share/YOUR_VIDEO_ID)

> 💡 *Replace the placeholder link above with your actual Loom video URL to share a quick live demonstration of the platform.*

---

## ✨ Features

### 🧑‍⚕️ For Doctors
- **Appointment Dashboard**: View upcoming, scheduled, and past consultations.
- **Consultation Records**: Create and store clinical details (Subjective notes, Objective findings, Assessment, and Plans - SOAP format).
- **Profile Customization**: Update specialization details, license numbers, and personal info.

### 👤 For Patients
- **Find & Book**: Select a medical specialist, select an available date/time slot, and schedule appointments.
- **Appointment History**: Track past visits and access consultation records.
- **Personalized Profile**: Store vital details such as known allergies, blood group, and genotype.

### 🛡️ Core Infrastructure & Security
- **Role-Based Authentication**: Secure login and registration for separate Patient and Doctor roles.
- **Security-First Password Resets**: Email-based verification codes with expiration limits.
- **Transactional Notifications**: Integration with Nodemailer for automated transactional emails.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, & Route Handlers)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL (Hosted on Neon DB)
- **ORM**: [Prisma Client](https://www.prisma.io/)
- **Authentication**: JWT-based session security with custom middlewares
- **Email Service**: SMTP integration via [Nodemailer](https://nodemailer.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm**, **yarn**, or **pnpm**

### 2. Environment Variables Setup
Create a `.env` file in the root directory and configure the environment variables as shown below:

```bash
# Database URL (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Environment & Security
NODE_ENV="development"
JWT_SECRET="your-super-secure-jwt-secret-key"

# SMTP Email Configuration (e.g. Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_FROM="DAT Health <your-email@gmail.com>"
SMTP_PASS="your-app-specific-password"

# Application URLs
APP_URL="http://localhost:3000"
LOGIN_LINK="http://localhost:3000/auth/login"
RESET_LINK="http://localhost:3000/auth/reset-password?code="
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Migrations
Synchronize your local schema with the Neon database instance and generate the Prisma Client:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router (pages and API endpoints)
│   ├── api/              # Backend Route Handlers (users, auth, appointments, etc.)
│   ├── auth/             # Login, registration, password recovery pages
│   ├── doctor/           # Doctor dashboard and profile workflows
│   ├── my-appointments/  # Patient appointment scheduling & records
│   ├── profile/          # Patient personal health record & settings
│   └── globals.css       # Core typography, Tailwind setup, & global styles
├── lib/                  # Helper utilities (db, email templates, API client)
├── nav-footer/           # Reusable site layouts (Navbar, Footer)
├── prisma/               # Database schema definitions and migrations
└── public/               # Static icons, pictures, and landing page illustrations
```
