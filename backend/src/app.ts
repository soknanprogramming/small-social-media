import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors()); // Enables Cross-Origin Resource Sharing (allows requests from frontend domains/ports)
app.use(express.json()); // Parses incoming JSON payloads in the request body (populates req.body)
app.use(cookieParser()); // Parses incoming Cookie headers (populates req.cookies)

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/users', userRoutes);

export default app;
