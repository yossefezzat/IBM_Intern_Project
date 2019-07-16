/*eslint-env node*/

//------------------------------------------------------------------------------
// hello world app is based on node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var me = 'youssef_walid@hotmail.com'; // Set this to your own account.
var password = process.env.cloudant_password;

// Initialize the library with my account.
var cloudant = Cloudant({ account: me, password: password });

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


async function asyncCall() {
  await cloudant.db.create('alice');
  return cloudant.use('alice').insert({ happy: true }, 'rabbit');
}

asyncCall().then((data) => {
  console.log(data); // { ok: true, id: 'rabbit', ...
}).catch((err) => {
  console.log(err);
});


