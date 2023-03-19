const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    console.log("Transactions handler running...");
    if (event.httpMethod !== 'GET') {
        return formattedResponse(401, {message: 'Incorrect httpMethod'});
    }

    const userEmail = event.queryStringParameters?.userEmail
    if (userEmail) {
        return await getOneTransaction(userEmail);
    } else {
        console.log('getAllTransactions running...')
        return await getAllTransactions();
    }

}

async function getAllTransactions() {
    let _data;
    const query = `SELECT * FROM transactions ORDER BY date_added ASC`;
    const values = []

    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows}
        }
        //console.log(fields);
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            request: 'GET',
            status: 'error',
            message: 'Error getting transactions',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function getOneTransaction(email){
    let _data;
    const query = `SELECT * FROM transactions WHERE email=$1`;
    const values = [email];

    try {
        const { rows } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows}
        }
    } catch (error) {
        _data = {
            request: 'GET',
            status: 'error',
            message: 'Error getting transactions',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

