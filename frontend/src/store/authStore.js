import {create} from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  allUsers: [],

  signup: async (email, username, fullname, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:4005/api/auth/signup', {
        email,
        username,
        fullname,
        password,
      },
        {
            withCredentials: true, // Include credentials for CORS
        }
        //navigate to the home page after successful signup
        
    );
      if (response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        // Optionally, you can redirect the user to the home page or another page
        window.location.href = '/'; // Redirect to home page 
      }
      
    } catch (error) {
      let message = 'Signup failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
    }
  },

  
  login:async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:4005/api/auth/login', {
        username,
        password,
      },
        {
            withCredentials: true, // Include credentials for CORS
        }
    );
      if (response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        // Optionally, you can redirect the user to the home page or another page
        window.location.href = '/'; // Redirect to home page
      }
      
    } catch (error) {
      let message = 'Login failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('http://localhost:4005/api/auth/logout', {}, {
        withCredentials: true, // Include credentials for CORS
      });
      set({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      let message = 'Logout failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
    }
  },

  getUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:4005/api/auth/me', {
        withCredentials: true, // Include credentials for CORS
      });
      if (response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        
      }
    } catch (error) {
        if (error.response?.status === 401) {
      // Don't show error message to user, just clear auth state
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

      let message = 'Failed to fetch user data';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
    }
  },

  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:4005/api/users/getallusers', {
        withCredentials: true,
      });
      if (response.data) {
        set({ allUsers: response.data, isLoading: false });
        return response.data;
      }
    } catch (error) {
      let message = 'Failed to fetch users';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
