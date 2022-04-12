const db = require('./UserManager/src/database')

/*
    Schema for Transactions Table
    CREATE TABLE transactions ( 
       id serial NOT NULL PRIMARY KEY, 
       email VARCHAR(30) UNIQUE NOT NULL ,
       txn_id INT UNIQUE NOT NULL,	
       amount INT NOT NULL,	
       type VARCHAR NOT NULL , 
       payment_mode VARCHAR NOT NULL , 
       confirmation_status BOOLEAN NOT NULL DEFAULT FALSE,
       date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
    ) ;
    */


exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify(db.pool, null, 2)
    }
}

async function createDeposit({amount, paymentMode}){
    
}
