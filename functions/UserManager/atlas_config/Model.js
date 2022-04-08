const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    referrals: {
        type: Number,
        required: false,
        default: 0
    },
    total_deposit: {
        type: Number,
        required: false,
        default: 0
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    profit: {
        type: Number,
        required: false,
        default: 0
    },
    bonus: {
        type: Number,
        required: false,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;

// CREATE TABLE users ( 
//     id serial NOT NULL PRIMARY KEY, +
//     email VARCHAR(30) UNIQUE NOT NULL , +
//     fullname VARCHAR(60) NOT NULL , +
//     country VARCHAR(30) NOT NULL , +
//     phone VARCHAR(20) NOT NULL , +
//     referrals serial NOT NULL , 
//     total_deposit serial NOT NULL , 
//     balance serial NOT NULL , 
//     profit serial NOT NULL , 
//     bonus serial NOT NULL , 
//     date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
// ) ;