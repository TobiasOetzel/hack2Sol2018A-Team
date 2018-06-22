const request = require('request-promise-native')
const credentials = require('../credentials')

class IotAEClient {
  getMappingForThing (thingId) {
  	var path = 'https://tm-data-mapping.cfapps.eu10.hana.ondemand.com/mappings/sensorthing?thingId=' + thingId
  	return this._iotAERequest(path)
  }
  
  deleteMappingForThing (thingId) {
  	var payload = { "thingId": thingId }
  	return this._iotAERequest('https://tm-data-mapping.cfapps.eu10.hana.ondemand.com/mappings/sensorthing', payload , 'DELETE')
  }
  
  createMappingForThing (thingId, sensorId) {
  	var payload = [ { "thingId": thingId , "sensorId": sensorId } ]
  	return this._iotAERequest('https://tm-data-mapping.cfapps.eu10.hana.ondemand.com/mappings/sensorthing', payload, 'POST')
  }
  
  deleteThing (thingId) {
  	var path = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things(\'' +  thingId + '\')';
  	return this._iotAERequest(path, null, 'DELETE')
  }
  
  getThings () {
    return this._iotAERequest('https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things')
  }
  
  createThing () {}
  
  _getToken () {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return request('https://hack2sol-team0.authentication.eu10.hana.ondemand.com/oauth/token', {
      form: {
        'grant_type': 'client_credentials',
        'response_type': 'token',
        'client_id': credentials.iotAeUser,
        'client_secret': credentials.iotAePassword
      },
      method: 'POST',
      headers: headers
    })
  }
  async _iotAERequest (path, payload, method) {
    let token
    try {
      let tokenResponse = await this._getToken()
      token = 'Bearer ' + JSON.parse(tokenResponse).access_token
    } catch (e) {
      throw e
    }
    let options = {
      method: method || 'GET',
      json: true,
      headers: {
        'Authorization': token
      }
    }
    if (payload) {
      options.body = payload
    }
    return request(`${path}`, options)
  }
}

module.exports = IotAEClient