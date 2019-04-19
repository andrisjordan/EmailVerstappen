var development = false
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
    $("#done").click(function () {
        if ($("#newpasswordOne").val() == $("#newpasswordTwo").val()){
            $("#done").attr('disabled','disabled');
            var body = {
                password: $("#newpasswordOne").val()
            }
            customFetch("email/password/"+id,"POST",body).then(data => {
                console.log(data)
                if(data.message == "Password reset"){
                    $(".passwords").html(
                        "<h1>Password reset!</h1>"
                    )
                } else {
                    $(".passwords").html(
                        "<h1>A problem occured!</h1>"
                    )
                }
            })
        } else {
            alert("passwords do not match")
        }
    });
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