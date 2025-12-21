// Bootstrap
import 'dotenv/config';

// Core
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// App modules
import connectDB from './config/config.js';
import homePage from './router/homePage.js';
import xpRouter from './router/xpRouter.js'
import userRouter from './router/userRouter.js';
import courseRouter from './router/courseRouter.js'
import feedbackRouter from './router/feedbackRouter.js';
import courseVideoRouter from './router/courseVideoRouter.js'

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

// Allow frontend Domain
app.use(cors({
  origin: 'https://web-design-project-three.vercel.app',
  credentials: true,
}));

// Routes (uncomment when ready)
app.use('/', homePage);
app.use('/api/xps', xpRouter); 
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/courseVideos', courseVideoRouter);

// Startup
(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
})();
