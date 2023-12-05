// models/user.js

import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },  // User bio, can be edited by the user
  onMyMind: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', default: [] }]
  
});

const User = mongoose.model('User', userSchema);
export default User;
