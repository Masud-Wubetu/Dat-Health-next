// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

// Export as named proxy function
export async function proxy(request: NextRequest) {
    const session = await getSessionFromRequest(request)
    const { pathname } = request.nextUrl

    console.log('Proxy processing:', pathname, 'Session:', !!session)

    // Public routes that don't require authentication
    const publicRoutes = [
        // Authentication
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/register-doctor',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/auth/logout',

        // Public Doctor Listing (including individual doctor details)
        '/api/doctors',
        '/api/doctors/filter',
        '/api/doctors/specializations',
        '/api/doctors/', // Individual doctor details e.g get doctor by id

        // Public Enum Data
        '/api/patients/bloodgroup',
        '/api/patients/genotype',

        // Static files
        '/_next',
        '/favicon.ico',
        '/public'
    ]

    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Allow public routes
    if (isPublicRoute) {
        return NextResponse.next()
    }

    
}