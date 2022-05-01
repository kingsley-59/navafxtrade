const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    
    return formattedResponse(200, {message: 'Still under construction...'});

}