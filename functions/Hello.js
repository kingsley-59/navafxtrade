


exports.handler = async function(event, context) {
    let response = {};

    function handlePostRequest(event) {
        let { name, email } = JSON.parse(event.body);
        let response = {};
        console.log(name, email);
    
        let _res = {
            reqest: 'post',
            message: 'Post request successful',
            email: email
        }
    
        response = {
            statusCode: 200,
            body: JSON.stringify(_res, null, 2)
        }
        console.log(response.statusCode);
    
        return response;
    }


    const body = {
        request: 'GET',
        mesage: "Hello World!!"
    }

    switch (event.httpMethod) {
        case 'GET':
            response = {
                statusCode: 200,
                body: JSON.stringify(body, null, 2)
            }
            break;
        case 'POST':
            return handlePostRequest(event)
            break;
        default:
            response = {
                statusCode: 200,
                body: JSON.stringify({message: 'Could not get http request details'}, null, 2)
            }
            break;
    }

    return response;
    
}