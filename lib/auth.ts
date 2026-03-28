import { jwtVerify, SignJWT } from 'jose'
import { NextRequest } from 'next/server'

// Get secret key from environment variables (used to sign and verify tokens)
const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)


// CREATE (Encrypt) JWT Token
export async function encrypt(payload: any) {
    // Create a signed JWT with the given payload
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) // Algorithm used to sign the token
        .setIssuedAt()                        // Add issued time (iat)
        .setExpirationTime('24h')             // Token expires in 24 hours
        .sign(key)                            // Sign the token with our secret key
} 

// VERIFY (Decrypt) JWT Token
export async function decrypt(input: string): Promise<any> {
    // Verify and decode the JWT token
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload // Return the original payload (user info, etc.)
}