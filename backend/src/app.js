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
import statsRoutes from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow images to be viewed
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

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
app.use(`${apiPrefix}/stats`, statsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to EduCMS API' });
});

export default app;