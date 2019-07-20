//------------------------------------------------------------------------------
// Copyright IBM Corp. 2015
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var express = require("express");
var fs = require("fs");
var http = require("http");
var path = require("path");
var cfenv = require("cfenv");
var pkg = require("./package.json");
var redis = require("redis");
var nconf = require("nconf");
const { URL } = require("url");

const session = require("express-session");
const passport = require("passport");
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const CALLBACK_URL = "/ibm/cloud/appid/callback";

var appEnv = cfenv.getAppEnv();
nconf.env();
var isDocker = nconf.get("DOCKER") == "true" ? true : false;
var clients = [];

var app = express();
app.set("port", appEnv.port || 3000);
app.use(express.json());
app.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

const secrets = JSON.parse(process.env.appidSecrets);

passport.use(
  new WebAppStrategy({
    tenantId: secrets.tenantId,
    clientId: secrets.clientId,
    secret: secrets.secret,
    oauthServerUrl: secrets.oauthServerUrl,
    redirectUri: "http://<your node public ip>:30189" + CALLBACK_URL
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));

if (isDocker) {
  credentials = { hostname: "redis", port: 6379 };
} else {
  credentials = { hostname: "127.0.0.1", port: 6379 };
}

var subscriber = redis.createClient(credentials.port, credentials.hostname);
var publisher = redis.createClient(credentials.port, credentials.hostname);

subscriber.on("error", function(err) {
  if (isDocker && err.message.match("getaddrinfo EAI_AGAIN")) {
    console.log("Waiting for IBM Containers networking to be available...");
    return;
  }
  console.error("There was an error with the subscriber redis client " + err);
});
subscriber.on("connect", function() {
  console.log("The subscriber redis client has connected!");

  subscriber.on("message", function(channel, msg) {
    if (channel === "chatter") {
      while (clients.length > 0) {
        var client = clients.pop();
        client.end(msg);
      }
    }
  });
  subscriber.subscribe("chatter");
});

publisher.on("error", function(err) {
  if (isDocker && err.message.match("getaddrinfo EAI_AGAIN")) {
    console.log("Waiting for IBM Containers networking to be available...");
    return;
  }
  console.error("There was an error with the publisher redis client " + err);
});
publisher.on("connect", function() {
  console.log("The publisher redis client has connected!");
});

if (credentials.password != "" && credentials.password != undefined) {
  subscriber.auth(credentials.password);
  publisher.auth(credentials.password);
}

app.get("/", function(req, res) {
  res.redirect("/index.html");
});

// Serve up our static resources
app.get(
  "/index.html",
  passport.authenticate(WebAppStrategy.STRATEGY_NAME),
  function(req, res) {
    fs.readFile("./public/index.html", function(err, data) {
      res.end(data);
    });
  }
);

app.use(express.static(path.join(__dirname, "public")));

// Poll endpoint
app.get("/poll/*", function(req, res) {
  clients.push(res);
});

// Msg endpoint
app.post("/msg", function(req, res) {
  message = req.body;
  publisher.publish("chatter", JSON.stringify(message), function(err) {
    if (!err) {
      console.log("published message: " + JSON.stringify(message));
    } else {
      console.error("error publishing message: " + err);
    }
  });
  res.end();
});

var instanceId = !appEnv.isLocal ? appEnv.app.instance_id : undefined;
app.get("/instanceId", function(req, res) {
  if (!instanceId) {
    res.writeHeader(204);
    res.end();
  } else {
    res.end(
      JSON.stringify({
        id: instanceId
      })
    );
  }
});

// This interval will clean up all the clients every minute to avoid timeouts
setInterval(function() {
  while (clients.length > 0) {
    var client = clients.pop();
    client.writeHeader(204);
    client.end();
  }
}, 60000);

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
