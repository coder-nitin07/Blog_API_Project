const Post = require("../models/postSchema");

// Create the Blog Post
const createPost = async (req, res)=>{
    try {
        const { title, content, tags, coverImage, status } = req.body;
        if(!title || !content || !tags){
            return res.status(400).json({ message: 'Please filled all the required fields.' })
        }
        
        const slug = title.toLowerCase().replaceAll(' ', "-");
        
        const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

        console.log("req.user is ", req.user);
        const postData = new Post({ title, content, tags: tagArray, coverImage, status, slug, author: req.user._id });
        
        await postData.save();
        res.status(201).json({ message: 'Blog Post created successfully', postData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All Posts
const getAllPosts = async (req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const query = { status: 'published' };
        const posts = await Post.find( query )
                        .skip(skip)
                        .limit(limit)
                        .sort({ createdAt: -1 });

        if(posts.length === 0){
            return res.status(403).json({ message: 'No published posts found' });
        }

        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({ page, limit, totalPosts, totalPages, posts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get Single Post by Slug
const getPostBySlug = async (req, res)=>{
    try {
        const slug = req.params.slug;

        const getPost = await Post.findOne({ slug, status: 'published' });

        if(!getPost){
            return res.status(404).json({ message: 'No Post Found' });
        }

        res.status(200).json({ getPost });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update the Post
const updateThePost = async (req, res)=>{
    try {
        const id = req.params.id;

        const { title, content, tags, status } = req.body;

        const updatePost = await Post.findById( id );
        if(!updatePost){
            return res.status(404).json({ message: 'Post not found' });
        }

        // Only Post Owner or Admin can update the Post
        if(req.user.role !== 'Admin' && req.user._id !== updatePost.author.toString() ){
            return res.status(403).json({ message: 'You are not authenticate to update this Post' });
        }

        if(title){
            const updatedSlug = title.toLowerCase().replaceAll(' ', "-");

            // Check the new slug is already exist in the DB or not
            const existingPostSlug = await Post.findOne({ slug: updatedSlug });
            if(existingPostSlug && existingPostSlug._id.toString() !== updatePost._id.toString()){
                return res.status(400).json({ message: 'Slug already exists. Please choose a differnt title name.' })
            }

            updatePost.title = title;
            updatePost.slug = updatedSlug;
        }
        
        if(tags){
            const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
            updatePost.tags = tagArray;
        } 
       
        if(content)  updatePost.content = content;
        if(status)   updatePost.status = status;
        

        const updatedData = await updatePost.save();

        res.status(200).json({ message: 'Post Updated Successfully', updatedData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete the Post
const deletePost = async(req, res)=>{
    try {
        const id = req.params.id;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({ messsage: 'Post not found' });
        }

        const isAdmin = req.user.role === 'Admin';
        const isAuthor = post.author.toString() === req.user._id.toString();

        if(!isAdmin && !isAuthor){
            return res.status(403).json({ message: 'You are not authorized to delete this Post' });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ messsage: 'Post Deleted Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createPost, getAllPosts, getPostBySlug, updateThePost, deletePost };