import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is uniquee
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    default: [], // Default to an empty array
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    default: [], // Default to an empty array
  }],
  profileImg:{
    type: String,
    default: "",
  },
  coverImg: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  link:{
    type: String,
    default: "",
  },
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to Post model
    default: [], // Default to an empty array
  }],
  
},{
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);
export default User;
