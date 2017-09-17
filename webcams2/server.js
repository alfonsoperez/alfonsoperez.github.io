var http = require("http");
var fs = require("fs");
var express = require("express");
var index = fs.readFileSync("index.html");

var app = express();

app.use("/public", express.static(__dirname + "/public"));
app.get("/", function(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});
app.listen(4000);
