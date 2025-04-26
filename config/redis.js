const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17875.c52.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 17875
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async ()=>{
    try {
        await client.connect();
        console.log("Redis Connected");
    } catch (err) {
        console.log('Redis connection failed', err);
    }
};

connectRedis();

module.exports = client;