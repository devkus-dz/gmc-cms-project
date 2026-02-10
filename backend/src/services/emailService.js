import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

class EmailService {
    constructor() {
        // Configure the Transporter
        const transportConfig = process.env.SMTP_SERVICE ? {
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        } : {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // True for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        };

        this.transporter = nodemailer.createTransport(transportConfig);
    }

    /**
     * Verify the connection on startup
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            logger.info('✅ Email Service Connected');
            return true;
        } catch (error) {
            logger.error(`❌ Email Connection Failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Send Welcome Email
     */
    async sendWelcomeEmail(email, username) {
        const message = {
            from: `"EduCMS Team" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: 'Welcome to EduCMS!',
            html: `
        <h1>Hi ${username},</h1>
        <p>Welcome to EduCMS. We are excited to have you on board!</p>
        <p>You can now log in and start creating content.</p>
        <br>
        <p>Best regards,<br>The Team</p>
      `
        };

        try {
            const info = await this.transporter.sendMail(message);

            logger.info(`📧 Email sent: ${info.messageId}`);

            // If using Ethereal, log the preview URL
            if (nodemailer.getTestMessageUrl(info)) {
                logger.info(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }

        } catch (error) {
            logger.error(`❌ Email Error: ${error.message}`);
        }
    }
}

export default new EmailService();