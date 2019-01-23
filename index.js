var development = true
var currentserver = null
var server = {
    server: "http://193.242.117.100:5000/",
    serverws: "193.242.117.100:5000/",
}

var serverLocal = {
    server: "http://localhost:5000/",
    serverws: "localhost:5000/",
}
if (development === true) {
    currentserver = serverLocal
} else {
    currentserver = server
}

var actualServer = currentserver.server


$(document).ready(function () {
    var id = getQueryVariable('id')
    customFetch("email/verify/" + id, "POST", {}).then(result => {
        console.log(result)
        if(result.message.n==1){
            $("#status").text("Verified")
        } else {
            $("#status").text("A problem occured")
        }
    })
});

function customFetch(url, type, body) {
    if (type === "GET") {
        return fetch(actualServer + url, {
                method: type,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(status)
            .then(json)
            .then(function (data) {
                console.log('Request succeeded with JSON response to url', url, data);
                return data
            }).catch(function (error) {
                console.log('Request failed', error);
                return error
            });
    } else {
        return fetch(actualServer + url, {
                method: type,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            .then(status)
            .then(json)
            .then(function (data) {
                console.log('Request succeeded with JSON response', url, data);
                return data
            })
            .catch(function (error) {
                console.log('Request failed', error);
                return error
            });
    }
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json()
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}