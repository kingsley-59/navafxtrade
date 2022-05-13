
const db = require("./database");
const formattedResponse = require('./utils/formattedResponse');

async function createTransaction(event) {
    let {email, txnId, amount, type, paymentMode, proof} = JSON.parse(event.body) ?? {};
    let _data = {};

    const query = `
        INSERT into transactions 
        (email, txn_id, amount, type, payment_mode, confirmation_status, date_added, proof_of_payment) 
        VALUES($1, $2, $3, $4, $5, $6, now(), $7)`;
    const values = [
            email,
            txnId, 
            amount, 
            type, 
            paymentMode,
            false,
            proof
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
    const query = `SELECT * FROM transactions`;
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
    const query = `SELECT * FROM transactions WHERE email=$1`;
    const values = [email]
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

async function updateTransaction(event) {
    let _data;
    let { confirmation_status, txn_id } = JSON.parse(event.body); 
    
    const query = `UPDATE transactions 
    SET
        confirmation_status = $1
    WHERE txn_id = $2
    `;
    const values = [confirmation_status, txn_id]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'PUT',
            status: 'success',
            message: `Transaction with ID: ${txn_id}, updated successfully`,
            body: {rows, fields}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'PUT',
            status: 'error',
            message: 'Error updating transaction'
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