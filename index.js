
var express = require("express");
var socket = require("socket.io");
var chalk = require("chalk");
// var path = require("path");

var app = express();
var port = 3333;

var server = app.listen(port);
app.use(express.static("public"));

console.log(chalk.green("server running on port " + port));


var io = socket(server);

io.sockets.on("connection", newConnection);

function newConnection(socket) {
	console.log(chalk.green("new connection: " + socket.id));

	function mouseMsg(data) {
		console.log(socket.id + " sending: " + data);

		socket.broadcast.emit("mouse", data);
	}

	socket.on("mouse", mouseMsg);
}
