import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json()); // Parses incoming JSON payloads in the request body (populates req.body)
app.use(cookieParser()); // Parses incoming Cookie headers (populates req.cookies)

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

export default app;
