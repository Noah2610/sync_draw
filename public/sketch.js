
var socket;
var port = 3333;
var drawWHincr = 5;
var cnv;
var screenWidth;
var screenHeight;
var drawWHdef = 30;
var fps = 180;  // def = 60

var drawWH = drawWHdef;
var drawColorArr = [
	Math.floor((Math.random() * 255) + 1),
	Math.floor((Math.random() * 255) + 1),
	Math.floor((Math.random() * 255) + 1)
];

var onlineArr = [];
var socketID;


function setup() {

	frameRate(fps);

	screenWidth = windowWidth;
	screenHeight = windowHeight;
	cnv = createCanvas(screenWidth, screenHeight);
	background(128,128,128);

	socket = io.connect("http://noahro.dynu.com:" + port);
	socket.on("mouse", newDrawing);
	socket.on("info", logInfo);

	cnv.mouseWheel(changeWidth);  // add event listener

}

function newDrawing(data) {
	noStroke();
	fill(data.color);
	ellipse(data.x, data.y, data.width, data.width);
}

function logInfo(data) {
	if (data === undefined) {  // if user executes function
		console.log("current connection count: " + onlineArr.length);
		for (var count = 0; count < onlineArr.length; count++) {
			console.log(onlineArr[count].name);
		}

	} else if (typeof data == "object") {  // if client connects to socket
		if (data.online.length > onlineArr.length) {  // new connection
			if (socketID === undefined) {
				socketID = data.online[data.online.length - 1].id;
				console.log("Logged in as '" + data.online[data.online.length - 1].name + "'");
			}
			var str = "connected: ";
			var targetIP = data.online[data.online.length - 1].ip;
		} else if (data.online.length < onlineArr.length) {  // disconnect
			var str = "disconnected: ";
			var targetIP = onlineArr[data.index].ip;
		} else {  // default
			var str = false;
		}
		onlineArr = data.online;
		if (str) {
			console.log(str + targetIP);
		}
	}
}

function status(par) {
	logInfo(par);
}

function login(name) {
	if (name != "" && name !== undefined) {
		var data = {
			name: name,
			id: socketID
		};
		socket.emit("info", data);
		// socket.emit("dbInfo", data);
		return "Logged in as '" + name + "'";
	}
}

function keyPressed() {
	if (keyCode == " ".charCodeAt(0)) {  // space - new random color
		drawColorArr = [
			Math.floor((Math.random() * 255) + 1),
			Math.floor((Math.random() * 255) + 1),
			Math.floor((Math.random() * 255) + 1)
		];
	} else if (keyCode == "X".charCodeAt(0)) {  // X - reset drawWH
		drawWH = drawWHdef;
	} else if (keyCode == "1".charCodeAt(0)) {  // 1 - set draw color white (tmp)
		drawColorArr = [255,255,255];
	} else if (keyCode == "2".charCodeAt(0)) {  // 2 - set draw color red (tmp)
		drawColorArr = [255,0,0];
	}
}

function changeWidth(event) {
	if (event.deltaY < 0) {  // mouse wheel up
		drawWH += drawWHincr;
	} else if (event.deltaY > 0) {  // mouse wheel down
		drawWH -= drawWHincr;
	}
}

function mouseWheel(changeWidth) {}

function mouseDragged() {
	// draw
	noStroke();
	fill(drawColorArr);
	ellipse(mouseX * (screenWidth / window.innerWidth), mouseY * (screenHeight / window.innerHeight), drawWH, drawWH);

	// send data to sockets
	var data = {
		x: mouseX,
		y: mouseY,
		color: drawColorArr,
		width: drawWH
	};
	socket.emit("mouse", data);

}

function draw() {
	
}
