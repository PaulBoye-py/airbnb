const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const User = require('./models/User');
const imageDownloader = require('image-downloader') 
const path = require('path');
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
        res.status(201).json(userDoc);
    } catch (e) {
        res.status(422).json('Error creating a new user',e);
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
        res.status(404).json('User NOT Found')
    }
})

// Clear cookie and Logout
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
});

// Profile page
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                // Handle error appropriately
                return res.status(500).json({ error: 'Token verification failed' });
            }
            return res.json(userData); // Only send response if token is verified
        });
    } else {
        return res.json(null); // Only send response if no token is present
    }
});

console.log({__dirname})
// Upload image link


app.post('/upload-by-link', async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ error: 'The link is required' });
        }

        const newName = 'photo-upload-' + Date.now() + '.jpg';
        const options = {
            url: link,
            dest: path.join(__dirname, 'uploads', newName)
        };

        await imageDownloader.image(options);
        res.json({ filename: newName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to download image' });
    }
});
app.listen(4000, function() {
    console.log('CORS listen')
});

// app.get('/profile', (req,res) => {
//     const {token} = req.cookies;
//     if (token) {
//         jwt.verify(token, jwtSecret, {},  (err, userData) => {
//             if (err) throw err;
//             res.json(userData)
//         })
//     } else {
//         res.json(null)
//     }
//     res.json({token});
// });

