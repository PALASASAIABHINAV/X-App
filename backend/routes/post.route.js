import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentPost, createPost, deletePost, getallPosts, getfollowingPosts, getlikedPosts, getUserPosts, likeunlikePost } from '../controllers/post.controller.js';

const router=express.Router()

router.get("/getall",protectRoute,getallPosts);
router.get("/following",protectRoute,getfollowingPosts);
router.get("/likes/:id",protectRoute,getlikedPosts);
router.get("/user/:username",protectRoute,getUserPosts);
router.post('/create',protectRoute,createPost);
router.post('/like/:id',protectRoute,likeunlikePost);
router.post('/comment/:id',protectRoute,commentPost);
router.delete('/:id',protectRoute,deletePost);



export default router;