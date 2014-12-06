var G = {
	width: 640,
	height: 480,
	ctx: null,
	canv: null,
	gameState: "LOGOS",
	interval: null,
	lastTime: null,
	init: function() {
		G.canv = document.getElementById("gameCanvas");
		G.ctx = G.canv.getContext("2d");
		G.canv.width = G.width; G.canv.height = G.height;
		interval = setInterval(G.tick, 0);
		lastTime = Date.now();
	},
	clearCanvas: function(){
		G.ctx.fillColor="#000";
		G.ctx.fillRect(0,0,G.width,G.height);
	},
	tick: function() {
		var now = Date.now();
		var delta = G.lastTime - now;
		G.lastTime = now;
		G.update(delta);
		G.draw();
	},
	update: function(dt) {
	
	},
	draw: function() {
		G.clearCanvas();
	}
};