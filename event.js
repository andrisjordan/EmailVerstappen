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
    customFetch("vendor", "GET", null).then(vendors => {
        vendors = vendors.vendors
        var alloptions = ""
        var alloptionsOrganizer = ""
        for (var index = 0; index < vendors.length; index++) {
            var vendorString = "<option value='" + vendors[index]._id + "' id='" + vendors[index]._id + "'>" + vendors[index].companyName + "</option>"
            var vendorCheckbox = "<input value='" + vendors[index]._id + "' type='checkbox' id='vendor" + index + "'>" + vendors[index].companyName + "</input>"
            alloptions = alloptions + vendorString
            alloptionsOrganizer = alloptionsOrganizer + vendorCheckbox
        }
        console.log(alloptions)
        $("#selection").html("<select id='selection'>" + alloptions + "</select>")
        $("#allVendors").append(alloptionsOrganizer)
        $("#done").click(function () {
            var selectedVendors = []
            for (var index2 = 0; index2 < vendors.length; index2++) {
                var value = $("#vendor" + index2).val()
                var checked = $("#vendor" + index2).is(":checked")
                if(checked){
                    selectedVendors.push(value)
                }
            }
            var body = {
                name: $("#eventName").val(),
                description: $("#eventDesc").val(),
                start: $("#eventStart").val(),
                end: $("#eventEnd").val(),
                needsTicket: $("#ticketBoolean").val(),
                paymentMethod: $("#selectionPayment").val(),
                organizer: $("#selection").val(),
                vendors: selectedVendors
            }
            customFetch("event","POST",body).then(data => {
                console.log(data)
            })
        })
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