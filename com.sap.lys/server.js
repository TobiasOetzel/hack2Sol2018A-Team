const approuter = require('@sap/approuter')
const IotAEClient = require('./lib/IotAEClient')

var ar = approuter();

ar.beforeRequestHandler.use("/api/bulb/change", function changeBulbHandler(req, res, next) {
    changeBulb(req,res);
});

async function changeBulb(req, res) {
    var currentThingId = req.url.split("/")[1];
    if (!currentThingId) {
        httpBadMethod(res);
    }

    const iotae = new IotAEClient();
    const iotservices = new IotServiceRestClient();

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
        //		var brokenSensorId = iotae.getMappingForThing(currentThingId)
        //   get sensor of new thing
        //		var newSensorId = iotae.getMappingForThing(newThing._id)
        //   delete mapping of both things 
        //		iotae.deleteMappingForThing(currentThingId)
        //		iotae.deleteMappingForThing(newThing._id)
        //   map sensor of new thing to current thing 
        //		iotae.createMappingForThing(currentThingId, newSensorId)
        //   delete sensor of broken thing 
        //		iotservices.deleteSensor(brokenSensorId)
        //   delete new thing 
        //		iotae.deleteThing(newThing._id)

        return things; 
    }).then(function(mapping) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mapping));
    }).catch(function(reason) {
        res.writeHead(500);
        res.end(reason.error);
    });
}

function httpBadRequest(res) {
    res.statusCode = 400;
    res.end("Bad request");
}

ar.start();