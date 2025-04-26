const express = require('express');
const { createPost, getAllPosts, getPostBySlug, updateThePost, deletePost } = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');
const authorizedRoles = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/createPost', verifyToken, authorizedRoles, createPost);
router.get('/getAllPost', getAllPosts);
router.get('/getPostBySlug/:slug', getPostBySlug);
router.put('/updateThePost/:id', verifyToken, authorizedRoles, updateThePost);
router.delete('/deleteThePost/:id', verifyToken, authorizedRoles, deletePost);

module.exports = router;