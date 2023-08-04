const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('./models/User');
require('dotenv').config();
const app = express();

// Generate a salt for bcrypt password hash. Check the await User.create function to see implementation
const bcryptSalt = bcrypt.genSaltSync(10) 

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
};

app.use(express.json())
app.use(cors(corsOptions))

// Connect to Mongo DB 
mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL)

app.get('/test', (req, res) => {
    res.json('Test OK!');
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc);
});

app.listen(4000, function() {
    console.log('CORS listen')
});

// 