import User from "../models/auth.model.js";
import {v2 as cloudinary} from 'cloudinary';
import Notification from "../models/notification.model.js";
import bcrypt from 'bcrypt';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username
    const user = await User.findOne({ username }).select('-password'); // Exclude password and version field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const getSuggestedUsers = async (req, res) => {
  try {
     const userId=req.user._id;
     const userFollowedByMe=await User.findById(userId).select('following');
     const users=await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // Exclude the current user
          following: { $nin: userFollowedByMe.following } // Exclude users already followed by the current user
        }
      },
      {
        $sample: { size: 10 } // Randomly select 10 users
      }
      ]);
      const filteredUsers=users.filter((user)=>!userFollowedByMe.following.includes(user._id));
      const suggestedUsers = filteredUsers.slice(0, 4);
      suggestedUsers.forEach(user=>user.password=undefined); // Exclude password from the response
      res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToModify = await User.findById(id);
    if (!userToModify) {
      return res.status(404).json({ message: 'User not found' });
    }
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    if(id===req.user._id.toString()){
      // Prevent following/unfollowing oneself
        return res.status(400).json({error:"You can't follow/unfollow yourself"})
    }

    // Check if the user is already followed
    const isFollowing = currentUser.following.includes(id);
    if(isFollowing){
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
        return res.status(200).json({ message: "User unfollowed successfully" });
        //TODO: send notification to the user being unfollowed
        
    }else{
        await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});

        //send notification to the user being followed
        // You can implement notification logic here if needed
        const newNotification = new Notification({
          from: req.user._id,
          to: userToModify._id,
          type: 'follow',
        });
        await newNotification.save();
        //TODO: send notification to the user being followed
        // Return success response

        return res.status(200).json({message:"User followed successfully"});
    }


  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}   

export const updateUserProfile = async (req, res) => {
  const { fullname, email, bio, link, profileImg, coverImg, currentPassword, newPassword, verifyPassword } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If verifying current password
    if (verifyPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      return res.status(200).json({ success: true, message: 'Password verified' });
    }

    // Handle profile image update
    if(profileImg){
      if(user.profileImg){
        await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      if(uploadedResponse.error){
        return res.status(500).json({message:"Error uploading profile image."});
      }
      user.profileImg = uploadedResponse.secure_url;
    }

    // Handle cover image update
    if(coverImg){
      if(user.coverImg){
        await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      if (uploadedResponse.error) {
        return res.status(500).json({ message: "Error uploading cover image." });
      }
      user.coverImg = uploadedResponse.secure_url;
    }

    // Update other fields
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    // Handle password update
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user = await user.save();
    user.password = undefined;
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }


}

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all users except the authenticated user
    const users = await User.find({ _id: { $ne: userId } })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


