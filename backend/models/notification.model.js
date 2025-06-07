import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  type: {
    type: String,
    required: true, 
    enum: ['follow', 'like'], // Define the types of notifications
  },
  read: {
    type: Boolean,
    default: false, // Default to unread
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;