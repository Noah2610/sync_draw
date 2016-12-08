
var body = document.getElementsByTagName("body")[0];


window.addEventListener("resize", function (event) {
	cnv = document.getElementById("defaultCanvas0");
		console.log("test: " + windowWidth, windowHeight);
	cnv.style.width = window.innerWidth;
	cnv.style.height = window.innerHeight;

	// cnv.setAttribute("width", window.innerWidth);
	// cnv.setAttribute("height", window.innerHeight);
});
