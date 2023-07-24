const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
};

app.use(express.json())
app.use(cors(corsOptions))

mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL)

app.get('/test', (req, res) => {
    res.json('Test OK!');
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    res.json({name, email, password});
});

app.listen(4000, function() {
    console.log('CORS listen')
});

// 