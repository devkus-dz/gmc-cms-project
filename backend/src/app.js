import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Route imports (respecting your filenames)
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';
import commentRoutes from './routes/comments.js';
import mediaRoutes from './routes/media.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import activityRoutes from './routes/activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow images to be viewed
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Specifically allow your Next.js frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API Routes
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/posts`, postRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/tags`, tagRoutes);
app.use(`${apiPrefix}/comments`, commentRoutes);
app.use(`${apiPrefix}/media`, mediaRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
app.use(`${apiPrefix}//activity`, activityRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to EduCMS API' });
});

export default app;