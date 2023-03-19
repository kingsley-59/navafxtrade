const { createUser, getAllUsers, getOneUser, updateUser, removeUser } = require('./src/User')
const formattedResponse = require('./src/utils/formattefResponse');

exports.handler = async function (event, context) {
    // ConnectDatabase();
    let eventBody, email;


    switch (event.httpMethod) {
        case 'GET':
            let userEmail = event.queryStringParameters?.userEmail
            if (userEmail) {
                return await getOneUser(userEmail)
            } else {
                return await getAllUsers()
            }
        case 'POST':
            return await createUser(event);
        case 'PUT':
            eventBody = JSON.parse(event?.body ?? "{}");
            email = eventBody?.email;
            if (!email) return formattedResponse(400, { status: 'error', message: "Invalid request! Email required." })
            return await updateUser(event);
        case 'DELETE':
            eventBody = JSON.parse(event?.body ?? "{}");
            email = eventBody?.email;
            if (!email) return formattedResponse(400, { status: 'error', message: "Invalid request! Email required." })
            return await removeUser(email);
        default:
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Could not get http request details' }, null, 2)
            }
    }

}
