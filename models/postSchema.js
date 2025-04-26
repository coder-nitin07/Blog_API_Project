const mongoose = require('mongoose');
const User = require('./userSchema');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [ String ],
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverImage:{
        type: String
    },
    status: {
        type: String,
        enum: [ 'published', 'draft' ],
        default: 'draft'
    }
}, { timestamps: true });

const Post = mongoose.model('Post', taskSchema);

module.exports = Post;