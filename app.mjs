import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import path from 'path';
import { engine } from 'express-handlebars';
import flash from 'connect-flash'; // Flash messages middleware
import './config.mjs'; // Load environment variables
import User from './models/user.js'; // Import the User model

const app = express();
const __dirname = path.resolve();

// Setting up Handlebars as the view engine
app.engine('hbs', engine({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sweeterthanfiction', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure Passport for user authentication
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Express session setup
app.use(session({ secret: 'some secret', resave: false, saveUninitialized: false }));

// Initialize Passport and session management
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware setup
app.use(flash());

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Routes
// Home route
app.get('/', (req, res) => res.render('home', { title: 'Welcome to Sweeter Than Fiction!' }));

// Registration page route
app.get('/register', (req, res) => {
  const messages = req.flash('error');
  res.render('register', { messages });
});

// Login page route
app.get('/login', (req, res) => {
  const messages = req.flash('error');
  res.render('login', { messages });
});

// Process registration form submission
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Registration failed: ' + err.message);
    res.redirect('/register');
  }
});

// Process login form submission
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  res.redirect('/userhome');
});

// User's home page route
app.get('/userhome', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('userhome', { title: 'Your Swiftie Home', name: req.user.name });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
