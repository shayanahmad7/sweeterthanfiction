import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection setup
const mongoDB = 'mongodb://127.0.0.1:27017/sweeterthanfiction';

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Simple root route
app.get('/', (req, res) => {
  res.send('Welcome to Sweeter Than Fiction!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
