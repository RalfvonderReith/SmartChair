//some imports of libraries
const Influx = require('influx')
const express = require('express')
const path = require('path');

const app = express()

//some constants
const PORT = 8000;
const PRESSURE_INTERVAL = 500;
const TEMPERATURE_INTERVAL = 500;
//database constants
const dbUsername = 'root'
const dbPassword = 'root'
const database = 'clarc_s'

//rootfolder of our project
const __projectRoot = __dirname + '/../';
app.use(express.static(__projectRoot));
//send index.html, when a client connects
app.get('/', function (req, res) {
    res.sendFile(path.join(__projectRoot + '/index.html'));
});

/**
 * Create a new Influx client. it uses the settings defined above.
 */
const dbClient = new Influx.InfluxDB({
  host: 'localhost',
  database: database,
  username: dbUsername,
  password: dbPassword
})

/**
 * start serving our app to clients
 */
var server = app.listen(PORT, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})

/**
 * import socket-io
 */
var io = require('socket.io').listen(server);

/**
 * when a client connects we currently just push all data, no matter to which chair they belong or what kind of data it is
 */
io.sockets.on('connection', function(socket) {
    console.log('[socket.io] Ein neuer Client (Browser) hat sich verbunden.\n');

    var pressureIntervalID = setInterval(function() {
      sendPressure(socket);
    }, PRESSURE_INTERVAL);

    var temperatureIntervalID = setInterval(function() {
      sendTemperature(socket);
    }, TEMPERATURE_INTERVAL);
});

/** 
 * querries the for the newest pressure data (ignoring to which chair it belongs) database 
 * and sends the data over a socket to the client
 */
function sendPressure(socket) {
    const query = 'select * from pressure order by desc limit 1';
    dbClient.query(query).then(result => {
      //receive data and format it
      result = result[0];
      var data =
      {
          cid: result.ChairUUID,
          time: result.time,
          p: {}
      }
      for(var i = 0; i < 10; i++) {
          data.p[i] = result[i];
      }
      //and then send it
      socket.emit('pressure', JSON.stringify(data));

    }).catch(err => {
      console.log("sendPressure: " + err);
      res.status(500).send(err.stack)
    })
}

/** 
 * querries the for the newest temperature data (ignoring to which chair it belongs) database 
 * and sends the data over a socket to the client
 */
function sendTemperature(socket) {
    const query = 'select * from temperature group by * order by desc limit 1';
    dbClient.query(query).then(result => {
      //receive data and format it
      result = result[0];
      var data =
      {
          cid: result.ChairUUID,
          time: result.time,
          t: {}
      }
      for(var i = 0; i < 1; i++) {
          data.t[i] = result.temp;
      }
      //and then send it
      socket.emit('temperature', JSON.stringify(data));

    }).catch(err => {
      console.log("sendTemperature: " + err);
      res.status(500).send(err.stack)
    })

}