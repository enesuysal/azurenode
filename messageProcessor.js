/*
* IoT Hub Raspberry Pi NodeJS - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
*/
'use strict';

//const Bme280Sensor = require('./bme280Sensor.js');
const SimulatedSensor = require('./simulatedSensor.js');

function MessageProcessor(option) {
  option = Object.assign({
    deviceId: '[Unknown device] node',
    temperatureAlert: 30
  }, option);
  option.simulatedData = new SimulatedSensor() 
  this.sensor = option.simulatedData;
  this.deviceId = option.deviceId;
  this.temperatureAlert = option.temperatureAlert
  this.sensor.init(() => {
    this.inited = true;
  });
}

MessageProcessor.prototype.getMessage = function (messageId, cb) {
  if (!this.inited) { return; }
  this.sensor.read((err, data) => {
    if (err) {
      console.log('[Sensor] Read data failed: ' + err.message);
      return;
    }

    cb(JSON.stringify({
      messageId: messageId,
      deviceId: this.deviceId,
      temperature: data.temperature,
      humidity: data.humidity
    }), data.temperature > this.temperatureAlert);
  });
}

module.exports = MessageProcessor;
