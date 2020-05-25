console.log("ajax.js loaded.");

let sendPostAjax = function (payload, page) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.open('POST', '/' + page, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function() {
            if (req.status == 200) {
                console.log("Req status: " + req.status);
                resolve(req.responseText);
            }
            else {
                alert(req.responseText);
                // reject(null);
            }
        });
        req.send(JSON.stringify(payload));
    })
}
