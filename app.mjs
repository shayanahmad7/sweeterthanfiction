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
import Song from './models/song.js';


const app = express();
const __dirname = path.resolve();

// Setting up Handlebars as the view engine
app.engine('hbs', engine({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views'),
  // Add runtime options and helpers directly here
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
  },
  helpers: {
    isInWishlist: function (songId, wishlist) {
      // Ensure that both songId and wishlist are defined
      if (!songId || !wishlist) return false;
      return wishlist.includes(songId.toString());
    },
    formatDate: function (date) {
      return date.toLocaleDateString("en-US");
    },
    formatLyrics: function (lyrics) {
      return lyrics.replace(/\n/g, '<br>');
    }
  }

}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


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

app.get('/userhome', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  // Filter out null values and then map over the onMyMind array
  const onMyMindIds = (req.user.onMyMind || []).filter(songId => songId).map(songId => songId.toString());
  
  res.render('userhome', {
    name: req.user.name,
    onMyMindIds
  });
});



// Route for the search functionality
app.get('/search', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const query = req.query.query;

  // Handle empty search query
  if (!query) {
    return res.render('userhome', { searchResults: [], searchEmpty: true, name: req.user.name });
  }

  try {
    // Update search logic: search for whole words
    const searchResults = await Song.find({
      track_name: { $regex: `\\b${query}\\b`, $options: 'i' }
    });
    if (searchResults.length === 0) {
      res.render('userhome', { message: `No search results to display :( `, name: req.user.name });
    } else {
      res.render('userhome', { searchResults, name: req.user.name });
    }

    
  } catch (error) {
    res.render('userhome', { error: 'No results found', name: req.user.name });
  }
});

// Route for the wishlist page
app.get('/on-my-mind', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  

  try {
    const user = await User.findById(req.user.id).populate('onMyMind');
  
    res.render('wishlist', { onMyMind: user.onMyMind });
  } catch (error) {
    
    res.status(500).send('Error accessing wishlist');
  }
});

// Add to wishlist route
app.post('/add-to-wishlist', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const songId = req.body.songId;
  const userId = req.user.id; // Assuming you have user authentication in place

  try {
    // Add the songId to the user's onMyMind array if it's not already there
    await User.updateOne(
      { _id: userId },
      { $addToSet: { onMyMind: songId } } // $addToSet avoids duplicates
    );
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist" });
  }
});

// Remove from wishlist route
app.post('/remove-from-wishlist', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const songId = req.body.songId;
  const userId = req.user.id; // Assuming you have user authentication in place

  try {
    // Remove the songId from the user's onMyMind array
    await User.updateOne(
      { _id: userId },
      { $pull: { onMyMind: songId } } // $pull removes the item from the array
    );
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
});
// User profile route
app.get('/profile', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  try {
    // Fetch the user's details
    const user = await User.findById(req.user.id);

    // Render the profile page with the user's data
    res.render('profile', { user: user });
  } catch (error) {
    console.error("Error accessing user profile:", error);
    res.status(500).send('Error accessing profile');
  }
});

// Route to handle profile update
app.post('/update-profile', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  try {
      const userId = req.user.id;
      const { name, username, bio } = req.body;
      await User.findByIdAndUpdate(userId, { name, username, bio });
      res.redirect('/profile');
  } catch (error) {
      res.status(500).send('Error updating profile');
  }
});

app.get('/discography', async (req, res) => {

  if (!req.user) return res.redirect('/login');

  try {
    const songs = await Song.find({}).sort({ track_release: 1, track_number: 1 });

    // Filter out null values and then map over the onMyMind array
    const onMyMindIds = (req.user.onMyMind || []).filter(songId => songId).map(songId => songId.toString());

    res.render('discography', { songs: songs, onMyMindIds: onMyMindIds });
  } catch (error) {
    console.error("Error in /discography route:", error);
    res.status(500).send('Error accessing discography');
  }
});

// Route to display song info
app.get('/song-info/:songId', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const song = await Song.findById(req.params.songId).populate('comments');
    if (!song) {
      return res.status(404).send('Song not found');
    }
    res.render('info', { song: song, user: req.user });
  } catch (error) {
    console.error("Error accessing song info:", error);
    res.status(500).send('Error accessing song info');
  }
});

//Route to add user comment
app.post('/add-comment/:songId', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  try {
    const songId = req.params.songId;
    const newComment = {
      username: req.user.username, // Using logged-in user's username
      text: req.body.text,
      timestamp: new Date()
    };

    await Song.findByIdAndUpdate(songId, { $push: { comments: newComment } });

    res.redirect(`/song-info/${songId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send('Error adding comment');
  }
});

//Logout Route
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect('/login');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
//boiiiiii