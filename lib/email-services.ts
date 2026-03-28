import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Template directory
const TEMPLATE_DIR = path.join(process.cwd(), 'lib', 'email-templates')

interface EmailOptions {
  to: string
  subject: string
  template: string
  variables: Record<string, any>
}
