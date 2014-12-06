var G = {
	width: 640,
	height: 480,
	title: "Death in front",
	ctx: null,
	canv: null,
	gameState: "LOGOS",
	interval: null,
	lastTime: null,
	time: 0.0,
	keys: new Array(256),
	player:{
		x: 320,
		y: 240,
		health: 100
	},
	init: function() {
		G.canv = document.getElementById("gameCanvas");
		G.ctx = G.canv.getContext("2d");
		document.title = G.title;
		G.canv.width = G.width; G.canv.height = G.height;
		G.interval = setInterval(G.tick, 0);
		G.lastTime = Date.now();
		for(i=0; i<256; i++) {
			G.keys[i] = false;
		}
		document.onkeydown = function(e) {
			  e = e || event
			  G.keys[e.keyCode] = true;
		}
		document.onkeyup = function(e) {
			  e = e || event
			  console.log(e.keyCode);
			  G.keys[e.keyCode] = false;
		}
	},
	clearCanvas: function(){
		G.ctx.fillStyle="#000";
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
		G.time+=dt;
		var arrow_keys = document.getElementById('arrows').checked,
			qwerty     = document.getElementById('qwerty').checked,
			azerty     = document.getElementById('azerty').checked;
		if((G.keys[37]===true&&arrow_keys)||(G.keys[65]&&qwerty)||(G.keys[81]&&azerty))	//	down
			G.player.x+=dt/3;
		if((G.keys[38]===true&&arrow_keys)||(G.keys[87]&&qwerty)||(G.keys[90]&&azerty))	//	right
			G.player.y+=dt/3;
		if((G.keys[39]===true&&arrow_keys)||(G.keys[68]&&qwerty)||(G.keys[68]&&azerty))	//	left
			G.player.x-=dt/3;
		if((G.keys[40]===true&&arrow_keys)||(G.keys[83]&&qwerty)||(G.keys[83]&&azerty))	//	up
			G.player.y-=dt/3;
	},
	draw: function() {
		G.clearCanvas();
		G.ctx.fillStyle="#ffffff";
		G.ctx.fillRect(G.player.x-10, G.player.y-20, 20, 40);//player
	},
	keydown: function(e){
		e = e || event;
		var keyCode = ('which' in event) ? event.which : event.keyCode;
		console.log(keycode + " down");
		keys[keyCode]=true;
	},
	keyup: function(e){
		e = e || event;
		var keyCode = ('which' in event) ? event.which : event.keyCode;
		console.log(keycode + " up");
		keys[keyCode]=false;
	}
};

