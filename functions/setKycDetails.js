
const db = require("./Transactions/src/database");
const formattedResponse = require('./Transactions/src/utils/formattedResponse');

exports.handler = async function(event, context) {
    if(event.httpMethod !== 'POST') {
        return formattedResponse(400, "Invalid http method");
    }
    
    return await setKycDetails(event)
    
}


async function setKycDetails(event) {
    let _data;
    let {email, validId, passport} = JSON.parse(event.body) ?? {};

    const query = `UPDATE users 
    SET
        valid_id = $1,
        passport = $2
    WHERE email = $3
    `;
    const values = [validId, passport, email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'Kyc details updated successfully',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'POST',
            status: 'error',
            message: 'Error updating kyc details',
            error: error.message
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}
