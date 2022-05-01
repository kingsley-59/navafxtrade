const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    
    const eventBody = event?.body ?? '{"txn_id": ""}';
    const _eventBody = JSON.parse(eventBody);
    const txn_id = _eventBody?.txn_id ?? null;
    if (!txn_id ) return formattedResponse(400, {status: "error", message: "Invalid request! Transaction ID required."})
    return await updateTransaction(event);

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
