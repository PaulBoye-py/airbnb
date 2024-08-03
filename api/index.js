const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Generate a salt for bcrypt password hash.
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;  // Use environment variable for JWT secret

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/test', (req, res) => {
    res.json('Test OK!');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.status(201).json(userDoc);
    } catch (e) {
        res.status(422).json({ error: 'Error creating a new user', details: e.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
                name: userDoc.name,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json({ error: 'Invalid email or password' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Login failed', details: e.message });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                return res.status(500).json({ error: 'Token verification failed', details: err.message });
            }
            res.json(userData);
        });
    } else {
        res.json(null);
    }
});

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
        res.status(500).json({ error: 'Failed to download image', details: error.message });
    }
});

const photosMiddleware = multer({dest: 'uploads'})
// // Upload image as file
// app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
//     const uploadedFiles = []
//     for (let i = 0; i < req.files.length; i++) {
//         const {path, originalName } = req.files[i]
//         const parts = originalName.split('.')
//         const ext = parts[parts.length - 1]
//         const newPath = path + '.' + ext
//         fs.renameSync(path, newPath)
//         uploadedFiles.push(newPath.replace('uploads/', ''))
//     }
//     res.json(uploadedFiles)
// })

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    try {
        const uploadedFiles = [];
        req.files.forEach(file => {
            const { path, originalname } = file; // Note: it's originalname, not originalName
            if (!originalname) {
                throw new Error('File does not have an original name');
            }
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
            uploadedFiles.push(newPath.replace('uploads/', ''));
        });
        res.json(uploadedFiles);
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ error: 'Failed to upload files', details: error.message });
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
