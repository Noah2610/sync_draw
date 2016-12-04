
var socket;
var port = 3333;
var widthIncr = 5;
var cnv;
var screenWidth = 0.9875;  // in percent
var screenHeight = 0.98;  // in percent

var drawWidth = 30;
var drawColorArr = [
	Math.floor((Math.random() * 255) + 1),
	Math.floor((Math.random() * 255) + 1),
	Math.floor((Math.random() * 255) + 1)
];


function setup() {
	cnv = createCanvas(Math.round(windowWidth * screenWidth), Math.round(windowHeight * screenHeight));
	background(128,128,128);

	socket = io.connect("http://84.113.223.39:" + port);
	socket.on("mouse", newDrawing);

	cnv.mouseWheel(changeWidth);

}

function newDrawing(data) {
	noStroke();
	fill(data.color);
	ellipse(data.x, data.y, data.width, data.width);
}

function keyPressed() {
	if (keyCode == " ".charCodeAt(0)) {
		drawColorArr = [
			Math.floor((Math.random() * 255) + 1),
			Math.floor((Math.random() * 255) + 1),
			Math.floor((Math.random() * 255) + 1)
		];
	}
}

function changeWidth(event) {
	if (event.deltaY < 0) {  // mouse wheel up
		console.log("mouse wheel up");
		drawWidth += widthIncr;
	} else if (event.deltaY > 0) {  // mouse wheel down
		console.log("mouse wheel down");
		drawWidth -= widthIncr;
	}
}

function mouseWheel(changeWidth) {
	console.log("mouse wheel used");
};

// function mouseWheel(event) {
// 	console.log(event);
// };

function mouseDragged() {
	noStroke();

	var data = {
		x: mouseX,
		y: mouseY,
		color: drawColorArr,
		width: drawWidth
	};
	socket.emit("mouse", data);

	fill(drawColorArr);
	ellipse(mouseX, mouseY, drawWidth, drawWidth);
}

function draw() {
	
}
