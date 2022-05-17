
const db = require("./Transactions/src/database");
const formattedResponse = require('./Transactions/src/utils/formattedResponse');

exports.handler = async function(event) {
    if(event.httpMethod !== 'POST') {
        return formattedResponse(400, "Invalid http method");
    }
    
    return await setKycDetails(event)
    
}

async function setKycDetails(event) {
    let _data;
    let {email, subject, message} = JSON.parse(event.body) ?? {};

    const query = `
    INSERT into messages 
        (email, subject, message, sender, receiver, date_added) 
        VALUES($1, $2, $3, $4, $5, now())
    `;
    const values = [email, subject, message, 'user', 'admin']
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'Message sent successfully',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'POST',
            status: 'error',
            message: 'Error sending message',
            error: error.message
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}
