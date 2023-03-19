const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    console.log("Transactions handler running...");
    if (event.httpMethod !== 'GET') {
        return formattedResponse(401, {message: 'Incorrect httpMethod'});
    }

    const userEmail = event.queryStringParameters?.userEmail
    if (userEmail) {
        return await getOneMessage(userEmail);
    } else {
        return await getAllMessages();
    }

}

async function getAllMessages() {
    let _data;
    const query = `SELECT * FROM messages ORDER BY date_added DESC`;
    const values = []

    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'Messages retrieved successfully',
            body: {rows}
        }
        //console.log(fields);
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            request: 'GET',
            status: 'error',
            message: 'Error getting messages',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function getOneMessage(email){
    let _data;
    const query = `SELECT * FROM messages WHERE email=$1`;
    const values = [email];

    try {
        const { rows } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'Message retrieved successfully',
            body: {rows}
        }
    } catch (error) {
        _data = {
            request: 'GET',
            status: 'error',
            message: 'Error getting message',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

