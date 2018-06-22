onst approuter = require('@sap/approuter')
const IotAEClient = require('./lib/IotAEClient')

var ar = approuter();

ar.beforeRequestHandler.use("/api/bulb/change", function changeBulbHandler(req, res, next) {
    changeBulb(req,res);
});

async function changeBulb(req, res) {
    var currentThing = req.url.split("/")[1];
    if (!currentThing) {
        httpBadRequest(res);
    }

    const iotae = new IotAEClient();

    try {
        let things = await iotae.getThings();
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