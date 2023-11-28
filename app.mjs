import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs'; 
import path from 'path';
import { engine } from 'express-handlebars';
import './config.mjs';
import User from './models/user.js'; 

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

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection setup
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Passport local strategy configuration for authentication
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Changed to use async/await
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// Express and Passport session setup
app.use(session({ secret: 'some secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Parsing form data
app.use(express.urlencoded({ extended: true }));

// Routes
// Home route
app.get('/', (req, res) => res.render('home', { title: 'Welcome to Sweeter Than Fiction!' }));

// Route to display the Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to display the Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Registration route
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ name: req.body.name, username: req.body.username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.redirect('/register');
  }
});

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/userhome',
  failureRedirect: '/login',
  failureFlash: false
}));

// User home route
app.get('/userhome', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('userhome', { name: req.user.name });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
