
var express = require("express");
var socket = require("socket.io");
var chalk = require("chalk");
var datetime = require("node-datetime");

var app = express();
var port = 3333;

var server = app.listen(port);
app.use(express.static("public"));

console.log(chalk.green("server running on port " + port));


var io = socket(server);
var onlineArr = [];
var storeLoginArr = [];

function newConnection(socket) {
	var ip = socket.handshake.address.substr(7);
	var defName = "guest";
	var name;
		var check = false;
	for (count = 0; count < storeLoginArr.length; count++) {
		if (ip == storeLoginArr[count].ip) {
			var name = storeLoginArr[count].name;
			var check = true;
			break;
		}
	}
	if (!check) {
		var name = defName;
	}
	onlineArr.push({id: socket.id, ip: ip, name: name});

	console.log(chalk.green(chalk.underline(curDate("H:M:S")) + " - connected: " + chalk.bold(socket.id + " - " + ip + " - " + name)));

	function mouseMsg(data) {
		// console.log(socket.id + " sending: " + data);

		socket.broadcast.emit("mouse", data);  // goes to every connection except this one

		// io.sockets.emit("mouse", data);  // goes to every connection including this one
	}

	function addName(data) {
		for (count = 0; count < onlineArr.length; count++) {
			if (onlineArr[count].id == data.id) {
				onlineArr[count].name = data.name;
				io.sockets.emit("info", {online: onlineArr});

				// add name to storeLoginArr
				var check = false;
				for (countStore = 0; countStore < storeLoginArr.length; countStore++) {  // check for existing entries
					if (storeLoginArr[countStore].ip == onlineArr[count].ip) {
						var check = true;
						storeLoginArr[countStore].name = data.name;
						break;
					}
				}
				// add new index if no corresponding already exists
				if (!check) {
					storeLoginArr.push({ip: onlineArr[count].ip, name: data.name});
				}

				break;
			}
		}
	}

	socket.on("mouse", mouseMsg);
	socket.on("info", addName);

	io.sockets.emit("info", {online: onlineArr});

	socket.on("disconnect", function () {  // disconnect

		for (count = 0; count < onlineArr.length; count++) {
			if (onlineArr[count].id == socket.id) {
				console.log(chalk.red(chalk.underline(curDate("H:M:S")) + " - disconnected: " + chalk.bold(socket.id + " - " + ip + " - " + onlineArr[count].name)));
				onlineArr.splice(count, 1);
				var data = {
					online: onlineArr,
					index: count
				};
				break;
			}
		}
		io.sockets.emit("info", data);

	});
}

io.sockets.on("connection", newConnection);


function curDate(frmt) {  // get date and/or time with format
	return datetime.create().format(frmt);
};
