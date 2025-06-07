import User from "../models/auth.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    const userId = req.user._id.toString();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Post text or image is required",
      });
    }

    let imgUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "posts",
      });
      imgUrl = uploadResponse.secure_url;
    }

    const newPost = await Post.create({
      user: userId,
      text,
      img: imgUrl,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    if (post.img) {
      // Delete image from Cloudinary
      const publicId = post.img.split("/").pop().split(".")[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(publicId);
    }
    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = {
      user: userId,
      text,
    };
    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to comment on post",
      error: error.message,
    });
  }
};

export const likeunlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      //notification
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      // End of notification

      res.status(200).json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like/unlike post",
      error: error.message,
    });
  }
};

export const getallPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found",
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const getlikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (!likedPosts || likedPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No liked posts found for this user",
      });
    }
    res.status(200).json({
      success: true,
      likedPosts,
    });
  } catch (error) {
    console.error("Error fetching likes of post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch likes of post",
      error: error.message,
    });
  }
};

export const getfollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const followingIds = user.following;
    const feedPosts = await Post.find({
      user: { $in: followingIds },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
      res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error while Getting Posts from following:", error);
    res.status(500).json({
      success: false,
      message: "Failed to getting the following posts",
      error: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
     try {
      const {username} = req.params;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
       
      
      res.status(200).json(posts);
      
     } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user posts",
        error: error.message,
      });
     }
}