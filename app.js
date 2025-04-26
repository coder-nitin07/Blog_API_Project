const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const authRouter = require('./routes/authRoutes');
const router = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');

// Database Connection
db();

// JSON data parse
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api', router);
app.use('/comment', commentRouter);

app.get('/', (req, res)=>{
    res.send("This is my Pure Blog API Backend Project.");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${ PORT }`);
});