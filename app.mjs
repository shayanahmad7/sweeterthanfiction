import express from 'express';
import mongoose from 'mongoose';
import './config.mjs'; // Ensure this is at the top to load environment variables first

const app = express();

// MongoDB connection setup using the DB_URI from .env file loaded by config.mjs
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Simple root route
app.get('/', (req, res) => {
  res.send('Welcome to Sweeter Than Fiction!');
});

// Start the server using the PORT from .env file, default to 3000 if not specified
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
