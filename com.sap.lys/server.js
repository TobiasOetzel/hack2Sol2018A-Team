const approuter = require('@sap/approuter')
const entityDeleter = require('./lib/entityDeleter')
let ar = approuter();

ar.beforeRequestHandler.use("/api/bulb/change", function changeBulbHandler(req, res, next) {
    changeBulb(req,res);
});

async function changeBulb(req, res) {
    var currentThingId = req.url.split("/")[1];
    if (!currentThingId) {
        httpBadRequest(res);
    }


    try {
		await entityDeleter.deleteTemporaryThing(currentThingId);

		res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify(mapping));
    } catch (e) {
        res.writeHead(500);
        res.end(reason.error);
    }
}

function httpBadRequest(res) {
    res.statusCode = 400;
    res.end("Bad request");
}

ar.start();