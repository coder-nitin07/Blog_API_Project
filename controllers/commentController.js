const Comment = require("../models/commentSchema");
const Post = require("../models/postSchema");

// Post the Comment by the User
const postComment = async (req, res)=>{
    try {
        const id = req.params.id;
        const { comment } = req.body;

        const getPost = await Post.findById(id);

        if(!getPost){
            return res.status(404).json({ message: 'Post not found' });
        }

        if(!comment.trim()){
            return res.status(400).json({ message: 'Please write something in comment' });
        }

        const newComment = new Comment({ comment, post: id, user: req.user._id });

        await newComment.save();
        res.status(201).json({ message: 'Comment saved successfully', newComment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete the comment 
const deleteComment = async (req, res)=>{
    try {
        const id = req.params.id;

        const comment = await Comment.findById(id).populate('post');

        if(!comment){
            return res.status(404).json({ message: 'Comment not found' });
        }

        const isAdmin = req.user.role === 'Admin';
        const isPostOwner = comment.post && comment.post.author.toString() === req.user._id.toString();

        if(!isAdmin && !isPostOwner){
            return res.status(403).json({ message: 'You are not authorized to delete this Comment' });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All comments of a Post
const getAllComments = async (req, res)=>{
    try {
        const id = req.params.id;

        const getComments = await Comment.find({ post:id })
                            .populate('user', 'name email')
                            .sort({ createdAt: -1 });

        if(getComments.length === 0){
            return res.status(404).json({ message: 'No comment found for this post' })
        }

        res.status(200).json({ getComments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { postComment, deleteComment, getAllComments };