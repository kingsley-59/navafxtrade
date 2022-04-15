
const db = require("./database");
const formattedResponse = require('./utils/formattefResponse');

async function createTransaction(event) {
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
        const { rows } = await db.query(query, values);
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
            message: 'Error saving user to database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
    
}

async function getAllTransactions() {
    let _data;
    const query = `SELECT * FROM withdrawal_info`;
    const values = []
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all users from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function getOneTransaction(email) {
    let _data;
    const query = `SELECT * FROM withdrawal_info WHERE email=$1`;
    const values = [email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'User successfully added to database',
            body: {rows: rows[0]}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all users from database'
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function updateTransaction(event) {
    let _data;
    let { name, email, phone, country, address } = JSON.parse(event.body); 
    
    const query = `UPDATE withdrawal_info 
    SET
        fullname = $1, 
        country = $2, 
        phone = $3
    WHERE email = $4
    `;
    const values = [name, country, phone, email]
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

async function removeTransaction(email) {
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

module.exports = {
    createTransaction,
    getAllTransactions,
    getOneTransaction,
    updateTransaction,
    removeTransaction
}