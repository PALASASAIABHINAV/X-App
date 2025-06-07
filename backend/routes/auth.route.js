import express from 'express';
import { register,login,logout,getMe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();
// Import middleware for authentication

router.post('/signup', register);
router.post('/login', login);   
router.post('/logout', logout);
router.get('/me',protectRoute,getMe)

// Export the router
export default router;