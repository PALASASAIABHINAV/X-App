import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const usePostStore = create((set) => ({
  posts: [],
  isLoading: false,
  error: null,
  suggestedUsers: [],
  profile: null,

  getPostEndpoint: async (feedType) => {
    switch (feedType) {
      case "forYou":
        return "http://localhost:4005/api/posts/getall";
      case "following":
        return "http://localhost:4005/api/posts/following";
      default:
        return "http://localhost:4005/api/posts/getall";
    }
  },

  fetchPosts: async (feedType) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = await usePostStore.getState().getPostEndpoint(feedType);
      const response = await axios.get(endpoint, { withCredentials: true });
      set({ posts: response.data, isLoading: false });
    } catch (error) {
      let message = "Failed to fetch posts";
      if (error.response?.data?.message) message = error.response.data.message;
      else if (error.message) message = error.message;
      set({ error: message, isLoading: false });
    }
  },

  deletePost: async (postId, feedType) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`http://localhost:4005/api/posts/${postId}`, { withCredentials: true });
      usePostStore.getState().fetchPosts(feedType);
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  },

  createPost: async ({ text, image }) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post("http://localhost:4005/api/posts/create", { text, image }, {
        withCredentials: true,
      });
      usePostStore.getState().fetchPosts("forYou");
      set({ isLoading: false });
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  },

  suggestUsers: async () => {
    try {
      const response = await axios.get("http://localhost:4005/api/users/suggested", {
        withCredentials: true,
      });
      if (response.data) {
        set({ suggestedUsers: response.data }); // ✅ Save to store
      }
    } catch (error) {
      console.error("Failed to suggest users:", error);
    }
  },

  followUser: async (userId) => {
    try {
      set({isLoading: true});
      const response = await axios.post(`http://localhost:4005/api/users/follow/${userId}`,{}, {
        withCredentials: true,
      });
      if(response.data){
        set({isLoading: false});
        usePostStore.getState().suggestUsers();
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  },

  likePost: async (postId, feedType) => {
    try {
      
      set({isLoading: true, error: null});
      const response = await axios.post(`http://localhost:4005/api/posts/like/${postId}`,{}, {
        withCredentials: true,
      });
      if(response.data){
        set({isLoading: false});
        usePostStore.getState().fetchPosts(feedType);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  },

  commentPost: async (postId, comment, feedType) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`http://localhost:4005/api/posts/comment/${postId}`, { text:comment }, {
        withCredentials: true,
      }); 
      if(response.data){
        set({isLoading: false});
        usePostStore.getState().fetchPosts(feedType);
      }
    } catch (error) {
      console.error("Failed to comment post:", error);
    } 
  },


  
  
    
  userProfile: async (username) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`http://localhost:4005/api/users/profile/${username}`, {
        withCredentials: true,
      });

      if (response.data) {
        set({ profile: response.data, isLoading: false });
      } else {
        set({ isLoading: false, profile: null });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      set({ error: "Something went wrong", isLoading: false });
    }
  },


  fetchUserPosts: async (username) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axios.get(`http://localhost:4005/api/posts/user/${username}`, {
        withCredentials: true,
      });

      set({ posts: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch posts",
        isLoading: false,
      });
    }
  },

  updateProfile: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(
        "http://localhost:4005/api/users/update",
        formData,
        { withCredentials: true }
      );
      
      if (response.data) {
        set({ isLoading: false });
        toast.success("Profile updated successfully");
        // Refresh the profile data after successful update
        await usePostStore.getState().userProfile(formData.username);
        return response.data;
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to update profile", 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },

  updateProfileImages: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(
        "http://localhost:4005/api/users/update",
        formData,
        { withCredentials: true }
      );
      
      if (response.data) {
        set({ isLoading: false });
        toast.success("Profile images updated successfully");
        return response.data;
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to update images", 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || "Failed to update images");
      throw error;
    }
  },

}));
