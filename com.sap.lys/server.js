const approuter = require('@sap/approuter');
const IoTAEClient = require('./lib/IoTAEClient')

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

    var iotae = new IoTAEClient();
    var things = iotae.getThings();

    things.then(function(value) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(value));
    }, function(reason) {
        res.writeHead(500);
        res.end(reason.error);
    });
}

ar.start();