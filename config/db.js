const mongoose = require('mongoose');

const db = async ()=>{
    try {
        await mongoose.connect(process.env.DB_String);
        console.log("mongoDB Connected successfully");
    } catch (err) {
        console.log("mongoDB Connection failed", err);
    }
};

module.exports = db;