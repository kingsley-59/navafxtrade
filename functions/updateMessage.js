const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return formattedResponse(401, {message: 'Incorrect httpMethod'});
    }

    const eventBody = JSON.parse(event?.body);
    const messageId = eventBody?.message_id
    if (!messageId) {
        return formattedResponse(400, {status: 'error', message: "Invalid request! Id required."})
    } 
    
    return await updateUser(event)
}

async function updateUser(event) {
    let _data;
    let { message_id, replied } = JSON.parse(event.body); 
    
    const query = `UPDATE messages 
    SET
        replied = $1
    WHERE id = $2
    `;
    const values = [replied, message_id]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'Message status updated',
            body: {rows, fields}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'PUT',
            status: 'error',
            message: 'Error updating message status',
            error: error.message
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}