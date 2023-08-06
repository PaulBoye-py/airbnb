const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const User = require('./models/User');
require('dotenv').config();
const app = express();

// Generate a salt for bcrypt password hash. Check the await User.create function to see implementation
const bcryptSalt = bcrypt.genSaltSync(10) 

const jwtSecret = 'asdfghjkl';

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Connect to Mongo DB 
mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL)

app.get('/test', (req, res) => {
    res.json('Test OK!');
});

// Send User Details via API
app.post('/register', async (req, res) => {
    // Grab name, email and password from the request's body coming from Register page of the client side
    const {name, email, password} = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
    
});

app.post('/login', async (req, res) => {
    // Grab email and password from the request's body coming from the Login page of the client side
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
        // Check if password is correct
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {

            // Synchronously sign the given payload into a JSON Web Token
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
                name: userDoc.name,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc)
            });
        } else {
            res.status(422).json('Password NOT Ok')
        }
    } else {
        res.json('User NOT Found')
    }
})

app.listen(4000, function() {
    console.log('CORS listen')
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {},  (err, userData) => {
            if (err) throw err;
            res.json(userData)
        })
    } else {
        res.json(null)
    }
    res.json({token});
});