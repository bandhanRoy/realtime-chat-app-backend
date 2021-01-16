function successStatus(message, values) {
    var response = {
        status: 200,
        message: message ? message : "Success.",
        data: values
    };
    return response;
}

function invalidRequestStatus(code, message) {
    var response = {
        status: code ? code : 400,
        message: message ? message : "Invalid Request.",
        data: null
    };
    return response;
}

function accessDeniedStatus() {
    var response = {
        status: 401,
        message: "Access Denied.",
        data: null
    };
    return response;
}

function serverError() {
    var response = {
        status: 500,
        message: "Internal server error.",
        data: null
    };
    return response;
}

module.exports = {
    successStatus: successStatus,
    invalidRequestStatus: invalidRequestStatus,
    accessDeniedStatus: accessDeniedStatus,
    serverError: serverError
};