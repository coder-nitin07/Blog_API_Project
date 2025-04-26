const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

// Register the User
const register = async (req, res)=>{
    try {
        const { username, email, password, role } = req.body;

        if(!username || !email || !password){
            res.status(400).send('Please filled all the fields');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if(!(req.body.username.length >= 3 && req.body.username.length <= 20 )){
            return res.status(400).send('Name should be atleast 3 characters and not more than 20 characters');
        }

        if(!validator.isEmail(req.body.email)){
            return res.status(400).send('Email should be in a valid format');
        }

        if(!validator.isStrongPassword(req.body.password)){
            return res.status(400).send('Password should be strong');
        }

        const newUser = new User({ username, email, password: hashedPassword, role });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully', newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

// Login User
const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
        const secretKey = process.env.JWT_SECRET;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'This email does not exist in DB' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid Password' });
        }

        const payload = { _id: user.id, username: user.username, role: user.role };

        const jwtToken = jwt.sign(payload, secretKey, { expiresIn: '1h' } );
        res.send({ jwtToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }  
};

// Logout User
const logout = async (req, res)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            res.status(401).json({ message: 'Authroization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({ message: 'Token not found' });
        }

        await redisClient.set(token, 'blacklisted', { EX: 3600 });

        return res.status(200).json({ message: 'User logged out successfulluy' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong during logout' });
    }
};

module.exports = { register, login, logout };