
const db = require("./database");
const formattedResponse = require('./utils/formattefResponse');

async function createUser(event) {
    let {fullName, email, phone, country} = JSON.parse(event.body);
    let _data = {};

    const query = `
        INSERT into users 
        (email, fullname, country, phone, referrals, total_deposit, balance, profit, bonus, date_added) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, now())`;
    const values = [email, fullName, country, phone, null, null, null, null, null];
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

async function getAllUsers() {
    let _data;
    const query = `SELECT * FROM users`;
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

async function getOneUser(email) {
    let _data;
    const query = `SELECT * FROM users WHERE email=$1`;
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

async function updateUser(event) {
    let _data;
    let { name, email, phone, country, address } = JSON.parse(event.body); 
    
    const query = `UPDATE users 
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

async function removeUser(email) {
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
    createUser,
    getAllUsers,
    getOneUser,
    updateUser,
    removeUser
}