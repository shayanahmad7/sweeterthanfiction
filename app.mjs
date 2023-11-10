// app.mjs
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import './config.mjs'; // Load environment variables
import User from './models/User.js'; // Import the User model

const __dirname = path.resolve();
const app = express();

// View engine setup
app.engine('hbs', expressHandlebars({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Home route serving registration form
app.get('/', (req, res) => {
  res.render('home');
});

// Handle the registration form submission
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.redirect('/register');
    console.error('Registration error:', error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
