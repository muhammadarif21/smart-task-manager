import express from 'express';
import cors from 'cors';
import tasksRoutes from './routes/tasks.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api', tasksRoutes);

// Root
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});