const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, 'Username cannot be blank']
    },
    password : {
        type : String,
        required : [true, 'Password cannot be empty']
    }
})

module.exports = mongoose.model('User', userSchema);