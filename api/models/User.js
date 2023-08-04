const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a Mongoose User Schema - A low-level representation of the structure of a database
const UserSchema = new Schema ({
    name: String,
    email: {type:String, unique:true},
    password: String,
});

// Create a Mongoose User Model - A high-level representation of a database
const UserModel = mongoose.model('User', UserSchema);

// Export the newly created User model
module.exports = UserModel;