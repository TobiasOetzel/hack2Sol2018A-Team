var approuter = require('@sap/approuter');

var ar = approuter();

ar.beforeRequestHandler.use("/api/bulb/change", function changeBulbHandler(req, res, next) {
    if (req.method !== "POST") {
        httpMethodNotAllowed(res);
    } else {
        changeBulb(req,res);
    }
});

function httpMethodNotAllowed(res) {
    res.statusCode = 405;
    res.end("Method not allowed");
}

function httpBadMethod(res) {
    res.statusCode = 400;
    res.end("Bad request");
}

function changeBulb(req, res) {
    var thing = req.url.split("/")[1];
    if (!thing) {
        httpBadMethod(res);
    }

    req.url.split("/")
    res.statusCode = 200;
    res.end();
}

ar.start();