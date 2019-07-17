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

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.use(express.static(`${__dirname}/ui-react/build`));

app.get("/",function(req,res){
  res.json({message:"hello world"})

})

const port= process.env.PORT || 3001;

// start server on the specified port and binding host
app.listen(port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + port);
});


