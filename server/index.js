// INCLUDING EXPRESS FRAMEWORK TO RUN NODE JS APPLICATION.
const express = require ("express");

// FLAG VARIABLE TO RUN THE NODE SERVER WITHOUT DB CONNETION
const dbEnabled = false;

// INCLUDING THIS MODULE TO USE .ENV FILE FOR STATIC VALUES.
require ('dotenv').config ();
const app = express ();

const https = require ("https"), http = require ("http");
const fs = require ("fs"); // FOR READING FILES FROM SERVER DIRECTORIES.
const path = require ('path'); // TO GET PATH OF FILES AND FOLDERS IN SERVER DIRECTORY.

// MODULE TO CONVERT USER'S TIME ZONE INTO SERVER'S TIME ZONE.
const moment = require ('moment-timezone');

// PARSE INCOMING REQUEST BODIES IN A MIDDLEWARE, AVAILABLE UNDER THE req.body PROPERTY.
const bodyParser = require ("body-parser");

// IMPORT SERVER DATA STORAGE
const serverStorage = require ('./server-storage');

// SET THE DOCUMENT ROOT FOR SERVER FOLDER
global.appRoot = path.resolve (__dirname);

// CREATE THE HTTP SERVER TO HANDLE CLIENT REQUEST
let server = http.createServer (app);

// SETUP THE SOCKET SERVER AND STORE THE SOCKET INSTANCE IN SERVER STORAGE.
serverStorage.io = require ('socket.io')(server,{pingInterval: 13000, pingTimeout: 8000, cors: {origin: '*'}});

// SET BODY PARSER SIZE TO 50 MB
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));

// TELLS THE SERVER TO USE JSON OBJECTS.
app.use (bodyParser.json());

// FOR DEEP PARSING BODY REQUEST
app.use (bodyParser.urlencoded
({
	extended: true
}));

// CORS (CROSS-ORIGIN RESOURCE SHARING) SETTING.
app.use (function (req, res, next)
{
	// ALLOWING ACCESS TO API FROM ALL THE ORIGINS.
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept, size, name, x-file-id, x-start-byte");
	res.header("Access-Control-Allow-Methods", "*");
	next();
});

// SETTING DEFAULT DATE TIME
moment.tz.setDefault(serverStorage.timezone);
console.log('Time is: ', moment().format());

// RESPONSE ON SERVER ROOT
app.get ('/', (req, res) =>
{
	res.writeHead (200, {'Content-Type': 'text/plain'});
	res.end ('Node Server is running!');
});

// INCLUDING socketClass TO HANDLE THE SOCKET COMMUNICATION IN SERVER.
const socketClass = require ('./classes/socket');
const socketObj = new socketClass(); 

if (dbEnabled)
{
	// INCLUDING API CONTROLLER TO HANDLE API REQUESTS
	const apiClass = require ('./controllers/api'); 
	const apiController = new apiClass(); 
	apiController.handleRequests (app); // HANDLING GET/POST API REQUEST.
}

// WHENEVER NEW/OLD SOCKET IS CONNECTED/RECONNECTED, CALL THE FUNCTION clientConnected
serverStorage.io.sockets.on ('connection', clientConnected);

// FUNCTION CALLED WHEN A SOCKET CONNECTION IS ESTABLISHED
function clientConnected (socket)
{
	socketObj.clientuserConnected (socket); // CONNECTING THE CLIENT'S SOCKET.
}

// STARTING SERVER AND LISTENING FOR REQUESTS ON THE PORT.
server.listen(process.env.port , () => console.log('server is running on port '+process.env.port ));
