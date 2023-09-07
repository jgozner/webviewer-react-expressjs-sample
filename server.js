const express = require("express");
const NodeCache = require( "node-cache" );
var xml = require('xml');

const myCache = new NodeCache();
const PORT = process.env.PORT || 3005;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

const app = express();

app.use(allowCrossDomain);
app.use(express.json());  

//save xfdf
app.post("/xfdf", (req, res) => {
  myCache.set(req.body["documentId"], req.body["xfdf"]);
  res.sendStatus(200)
});

//get xfdf
app.get("/xfdf", (req, res) => {
  const xfdf = myCache.get(req.query["documentId"])
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(xfdf));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});