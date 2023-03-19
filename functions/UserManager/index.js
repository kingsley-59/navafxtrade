const mongoose = require('mongoose');
const db = require('./src/database');
// const ConnectDatabase = require('./atlas_config/DbConnect');
// const { insert, readAll, update, remove } = require('./atlas_config/User');
const { createUser, getAllUsers, getOneUser, updateUser, removeUser } = require('./src/User')
const formattedResponse = require('./src/utils/formattefResponse');

exports.handler = async function(event, context) {
    // ConnectDatabase();
    const email = JSON.parse(event.body ?? "{}")?.email ;
    
    switch (event.httpMethod) {
        case 'GET':
            let userEmail = event.queryStringParameters?.userEmail
            if (userEmail) {
                return await getOneUser(userEmail)
            } else {
                return await getAllUsers()
            }
            break;
        case 'POST':
            return await createUser(event);
            break;
        case 'PUT':
            if (!email ) return formattedResponse(400, {status: 'error', message: "Invalid request! Email required."})
            return await updateUser(event);
            break;
        case 'DELETE':
            if (!email ) return formattedResponse(400, {status: 'error', message: "Invalid request! Email required."})
            return await removeUser(email);
            break;
        default:
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Could not get http request details'}, null, 2)
            }
            break;
    }
    
}
