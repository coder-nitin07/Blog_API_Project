const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 200
    }
}, { timestamps: true });

commentSchema.pre('save', function(next){
    if(!this.comment.trim()){
        return next(new Error('Comment should not be empty'));
    }

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;