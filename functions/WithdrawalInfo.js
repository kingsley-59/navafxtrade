
const db = require("./Transactions/src/database");
const formattedResponse = require('./Transactions/src/utils/formattedResponse');

exports.handler = async function(event, context) {
    
    
    switch (event.httpMethod) {
        case 'GET':
            let userEmail = event.queryStringParameters?.userEmail
            if (userEmail) {
                return await getOneInfo(userEmail)
            } else {
                return await getAllInfo()
            }
            break;
        case 'POST':
            return await createInfo(event);
            break;
        case 'PUT':
            const eventBody = event?.body ?? '{"email": ""}';
            const _eventBody = JSON.parse(eventBody);
            const email = _eventBody?.email ?? null;
            if (!email ) return formattedResponse(400, {status: error, message: "Invalid request! Email required."})
            return await updateInfo(event);
            break;
        case 'DELETE':
            if (!email ) return formattedResponse(400, {status: error, message: "Invalid request! Email required."})
            return await removeInfo(email);
            break;
        default:
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Could not get http request details'}, null, 2)
            }
            break;
    }
    
}


async function createInfo(event) {
    let {email, acctName, acctNo, bankName, btcAddress, ethAddress} = JSON.parse(event.body) ?? {};
    let _data = {};

    const query = `
        INSERT into withdrawal_info 
        (email, account_name, account_no, bank, btc_address, eth_address, identity_confirmed, date_added) 
        VALUES($1, $2, $3, $4, $5, $6, $7, now())`;
    const values = [email, 
            acctName ?? null, 
            acctNo ?? null, 
            bankName ?? null, 
            btcAddress ?? null, 
            ethAddress ?? null,
            false
        ];
    try {
        // check if records exists for email
        let { rows, fields} = await db.query(`SELECT * FROM withdrawal_info WHERE email=$1`, [email])
        // console.log("rows",rows);
        if (rows?.length) {
            // console.log("trying to update row...")
            return await updateInfo(event);
        }
        // console.log('trying to insert row...');
        let {_rows} = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'User successfully added to database',
            body: {_rows, email}
        }
        
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'POST',
            status: 'error',
            message: error.message
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
    
}

async function getAllInfo() {
    let _data;
    const query = `SELECT * FROM withdrawal_info`;
    const values = []
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'Response successful',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all info from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function getOneInfo(email) {
    let _data;
    const query = `SELECT * FROM withdrawal_info WHERE email=$1`;
    const values = [email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'Response successful',
            body: {rows: rows[0]}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all info from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function updateInfo(event) {
    let _data;
    let { email, acctName, acctNo, bankName, btcAddress, ethAddress } = JSON.parse(event.body); 
    
    const query = `UPDATE withdrawal_info 
    SET
        account_name = $1, 
        account_no = $2,
        bank = $3,
        btc_address = $4,
        eth_address = $5
    WHERE email = $6
    `;
    const values = [acctName, acctNo, bankName, btcAddress, ethAddress, email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'PUT',
            status: 'success',
            message: 'Response successful',
            body: {rows, fields}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'PUT',
            status: 'error',
            message: 'Error getting all info from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function removeInfo(email) {
    let _data;
    const query = ``;
    const values = []
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'PUT',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows, fields}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'PUT',
            status: 'error',
            message: 'Error getting all users from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}
