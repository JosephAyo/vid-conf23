const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        default: '',
        trim: true
    },
    password:{
        type: String,
        trim: true
    },
    onlineStatus:{
        type: Boolean,
        default: false
    }
});

module.exports =mongoose.model('User',UserSchema);