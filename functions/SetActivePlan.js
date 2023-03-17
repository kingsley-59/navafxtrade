
const db = require("./Transactions/src/database");
const formattedResponse = require('./Transactions/src/utils/formattedResponse');

exports.handler = async function(event, context) {
    if(event.httpMethod !== 'POST') {
        return formattedResponse(400, "Invalid http method");
    }
    
    return await setActivePackage(event)
    
}


async function setActivePackage(event) {
    let _data;
    let {email, active_package} = JSON.parse(event.body) ?? {};

    const query = `UPDATE users 
    SET
        active_package = $1
    WHERE email = $2
    `;
    const values = [active_package, email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'Active package updated successfully.',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'POST',
            status: 'error',
            message: 'Error updating active package'
        }
        return formattedResponse(500, _data);
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
        if (rows !== undefined) {
            return await updateInfo(event);
        }
        let queryData = await db.query(query, values);
        _data = {
            reqest: 'POST',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows, email}
        }
        
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'POST',
            status: 'error',
            message: error.message
        }
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
        return formattedResponse(500, _data);
    }
}
