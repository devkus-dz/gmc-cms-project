import app from './src/app.js';
import { testConnection } from './src/config/database.js';
import { logger } from './src/utils/logger.js';
import emailService from './src/services/emailService.js';

const PORT = process.env.PORT || 5000;

/**
 * @desc    Initialize and start the Express server
 * 1. Connects to Database (Supabase)
 * 2. Verifies Email Service (SMTP)
 * 3. Starts listening on defined PORT
 * @returns {Promise<void>}
 */
const startServer = async () => {
    try {
        logger.info('⏳ Initializing server...');

        // 1. Verify Database Connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            logger.error('Database connection failed. Shutting down...');
            process.exit(1);
        }
        logger.info('✅ Database connected successfully');

        // 2. Verify Email Service Connection
        const emailConnected = await emailService.verifyConnection();
        if (emailConnected) {
            logger.info('✅ Email Service connected');
        } else {
            logger.warn('⚠️ Email Service failed to connect. Emails will not be sent.');
        }

        // 3. Start Server
        app.listen(PORT, () => {
            logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            logger.info(`📡 URL: http://localhost:${PORT}`);
        });

    } catch (error) {
        logger.error(`Critical Server Error: ${error.message}`);
        process.exit(1);
    }
};

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

startServer();