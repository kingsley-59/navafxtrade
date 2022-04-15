

function formattedResponse(statusCode, body) {
    let _res = {
        statusCode: statusCode,
        body: JSON.stringify(body, null, 2)
    }
    return _res;
}

module.exports = formattedResponse;