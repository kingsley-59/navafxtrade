const mongoose = require('mongoose');
const User = require('./Model');

function formattedResponse(statusCode, body) {
    let _res = {
        statusCode: statusCode,
        body: JSON.stringify(body, null, 2)
    }
    return _res;
}

async function insert(event) {
    let {fullName, email, country} = JSON.parse(event.body);
    let newUser, responseData;
    newUser = new User({name: fullName, email, country})

    try {
        await newUser.save();
        responseData = {
            status: 'success',
            message: 'User successfully added to database',
            body: newUser
        }
        
        return formattedResponse(200, responseData);
    } catch (error) {
        responseData = {
            status: 'error',
            message: 'Error saving user to database',
            body: error.message
        }
        return formattedResponse(500, _data);
    }
    return ;
}

async function readAll(event) {
    let users, responseData;

    try {
        users = await User.find({});
        responseData = {
            status: 'success',
            body: users
        }
        return formattedResponse(200, responseData);
    } catch (error) {
        responseData = {
            status: 'error',
            body: error.message
        }
        return formattedResponse(500, responseData);
    }
}

async function readOne(event) {
    // let users, responseData;

    // try {
    //     users = await User.find({});
    //     responseData = {
    //         status: 'success',
    //         body: users
    //     }
    //     return formattedResponse(200, responseData);
    // } catch (error) {
    //     responseData = {
    //         status: 'error',
    //         body: error.message
    //     }
    //     return formattedResponse(500, responseData);
    // }
    return ;
}

async function update(event) {
    return ;
}

async function remove({...data}) {
    return ;
}

module.exports = {
    insert,
    readAll,
    readOne,
    update,
    remove
}