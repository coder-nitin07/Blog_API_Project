const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const verifyToken = async (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'No Token Provided' });
    }

    // console.log(first)
    const token = authHeader.split(' ')[1];

    try {
        // Check the token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted === 'blacklisted'){
            return res.status(401).json({ message: 'Token has been blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = verifyToken;