
const IotAEClient = require('./lib/IotAEClient')
const IotServiceRestClient = require('./lib/IotServiceRestClient')
const credentials = require('../credentials')
const iotae = new IotAEClient();

module.exports = {
	deleteTemporaryThing: async function (currentThingId) {
		let things = await iotae.getThings();
		// identify new thing
		//   filter things from device 4? -- nope
		//   find the one without location & hue type = new thing

		let newThing;
		things.value.forEach(function (thing) {
			if (!newThing && thing._thingType[0].includes("bulb") && !thing.hasOwnProperty("_location")) {
				newThing = thing;
			}
		});
		console.log(newThing);

		const sensorMapping = await iotae.getSensorMapping(currentThingId);
		let currentSensorId = sensorMapping[0].SENSOR_ID

		let newThingId = newThing._id;
		const sensorMappingOfNewThing = await iotae.getSensorMapping(newThingId);

		let deletingSensors = []
		deletingSensors.push(iotae.deleteSensorMapping(currentSensorId))
		let sensorIDOfTheNewThing = sensorMappingOfNewThing.SENSOR_ID;
		deletingSensors.push(iotae.deleteSensorMapping(sensorIDOfTheNewThing))

		await Promise.all(deletingSensors)

		let iotServiceRestClient = new IotServiceRestClient(credentials.iotRestUser, credentials.iotRestPassword)
		await iotServiceRestClient.deleteSensor(currentSensorId)

		await iotae.createSensorMappingWithSensorId(sensorIDOfTheNewThing, currentThingId)
		await iotae.deleteThing(newThingId)
	}
}