const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { postComment, deleteComment, getAllComments } = require('../controllers/commentController');
const authorizedRoles = require('../middleware/roleMiddleware');
const commentRouter = express.Router();

commentRouter.post('/postcomment/:id', verifyToken, postComment);
commentRouter.delete('/deletecomment/:id', verifyToken, authorizedRoles, deleteComment);
commentRouter.get('/getcomment/:id', getAllComments);

module.exports = commentRouter;