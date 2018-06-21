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
    var currentThing = req.url.split("/")[1];
    if (!currentThing) {
        httpBadMethod(res);
    }

    const iotae = new IoTAEClient();

    iotae.getThings().then(function(things) {
        // identify new thing
        //   filter things from device 4? -- nope
        //   find the one without location & hue type = new thing

        let newThing;
        things.value.forEach(function(thing) {
            if (!newThing && thing._thingType[0].includes("bulb") && !thing.hasOwnProperty("_location")) {
                newThing = thing;
            }
        });
        console.log(newThing);

        //   get sensor of broken thing
        //   get sensor of new thing
        //   delete mapping of both things
        //   map sensor of new thing to current thing
        //   delete sensor of broken thing
        //   delete new thing

        return things; // TODO getSensorMapping(thing._id)
    }).then(function(mapping) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mapping));
    }).catch(function(reason) {
        res.writeHead(500);
        res.end(reason.error);
    });
}

ar.start();