//☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃


var G = {

	//////////////////////////////////
	animationSpeed: 0.01, playerSpeed: 0.1,
	//////////////////////////////////

	width: 800,	height: 600,
	title: "Death in front",
	ctx: null, canv: null,
	gameState: "LOGOS",
	interval: null,
	lastTime: null, time: 0.0,
	LMB: false, MMB: false, RMB: false,
	keys: new Array(256),
	entities: new Array(501),
	player: {x: 320, y: 240, hp: 5, orientation: 'N', walking: false, faction: "N", active:true},
	zombies: new Array(500),
	mousePos: {x: 0, y: 0},
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
		document.onkeydown = function(e) {e = e || event;G.keys[e.keyCode] = true; }
		document.onkeyup = function(e)   {e = e || event;G.keys[e.keyCode] = false;}
		G.canv.addEventListener('mousemove', function(evt) {G.mousePos = G.getMousePos(G.canv, evt);}, false);
		G.canv.addEventListener('mousedown', function(evt) {G.getMouseButtons(evt, true);}, false);
		G.canv.addEventListener('mouseup', function(evt) {G.getMouseButtons(evt, false);}, false);
		document.getElementById("FTG_sound").play();
		for(i=0;i<500;i++)
			G.entities[i] = G.zombies[i] = {hp:6,								//zombies
							x:Math.round(Math.random()*800),
							y:Math.round(Math.random()*600),
							active:true, orientation: 'N', walking: false,
							drops:Math.round(Math.random()*20), faction:"Z"};
		G.entities[500] = G.player;
		
	},
	clearCanvas: function(){G.ctx.fillStyle="#000";G.ctx.fillRect(0,0,G.width,G.height);},
	tick: function() {
		var now = Date.now();var delta = now - G.lastTime;G.lastTime = now;
		G.update(delta);G.draw();
	},
	update: function(dt) {
		G.time+=dt;
		var arrow_keys   = true,
			qwerty       = true,
			azerty       = false;
		if(G.gameState === "PLAY"){
			for(i=0;i<501;i++)
				G.entities[i].walking=false;
			if((G.keys[37]===true&&arrow_keys)||(G.keys[65]&&qwerty)||(G.keys[81]&&azerty)){	//	☃left☃
				for(i=0;i<501;i++){
					G.entities[i].x-=dt * G.playerSpeed;
					G.entities[i].orientation = 'E';
					G.entities[i].walking=true;
				}
			}
			if((G.keys[38]===true&&arrow_keys)||(G.keys[87]&&qwerty)||(G.keys[90]&&azerty)){	//	☃up☃
				for(i=0;i<501;i++){
					G.entities[i].y-=dt * G.playerSpeed;
					G.entities[i].orientation = 'S';
					G.entities[i].walking=true;
				}
			}
			if((G.keys[39]===true&&arrow_keys)||(G.keys[68]&&qwerty)||(G.keys[68]&&azerty)){	//	☃right☃
				for(i=0;i<501;i++){
					G.entities[i].x+=dt * G.playerSpeed;
					G.entities[i].orientation = 'W';
					G.entities[i].walking=true;
				}
			}
			if((G.keys[40]===true&&arrow_keys)||(G.keys[83]&&qwerty)||(G.keys[83]&&azerty)){	//	☃down☃
				for(i=0;i<501;i++){
					G.entities[i].y+=dt * G.playerSpeed;
					G.entities[i].orientation = 'N';
					G.entities[i].walking=true;
				}
			}
		}
		if(G.gameState === "LOGOS")
				if(G.time>3000) {
					G.gameState = "MENU";
					document.getElementById("TITLE_sound").play();
				}
		if(G.gameState === "MENU")
			if(G.LMB){
				if(G.mousePos.x>540&&G.mousePos.y>300&&G.mousePos.x<750&&G.mousePos.y<390)
					G.gameState = "PLAY";
				if(G.mousePos.x>420&&G.mousePos.y>390&&G.mousePos.x<800&&G.mousePos.y<480)
					G.gameState = "SET";
				if(G.mousePos.x>420&&G.mousePos.y>480&&G.mousePos.x<800&&G.mousePos.y<580)
					G.gameState = "HELP";
				G.LMB=false;
			}
		if(G.gameState === "HELP"){
			if(G.LMB){
				if(G.mousePos.x>360&&G.mousePos.y>300&&G.mousePos.x<740&&G.mousePos.y<550)
					G.gameState = "MENU";
				G.LMB=false;
			}
		}
		if(G.gameState === "LOST") {
			G.setCookie("LD31_FTG_wave", 1, 10000);
			if(G.LMB)
				if(G.mousePos.x>0&&G.mousePos.y>0&&G.mousePos.x<0&&G.mousePos.y<0)
					G.gameState = "MENU";
		}
		if(G.gameState === "WON") {
			if(G.LMB)
				if(G.mousePos.x>0&&G.mousePos.y>0&&G.mousePos.x<0&&G.mousePos.y<0)
					G.gameState = "MENU";
		}
	},
	draw: function() {
		G.clearCanvas();
		switch(G.gameState) {
			case "MENU":
				var nofocus = document.getElementById("MainMenuImage"),
					playfocus = document.getElementById("MainMenuPlayImage"),
					optifocus = document.getElementById("MainMenuSettingsImage"),
					helpfocus = document.getElementById("MainMenuHelpImage");
				G.ctx.drawImage(nofocus, 0, 0);
				if(G.mousePos.x>540&&G.mousePos.y>300&&G.mousePos.x<750&&G.mousePos.y<390)
					G.ctx.drawImage(playfocus, 0, 0);
				if(G.mousePos.x>420&&G.mousePos.y>390&&G.mousePos.x<800&&G.mousePos.y<480)
					G.ctx.drawImage(optifocus, 0, 0);
				if(G.mousePos.x>420&&G.mousePos.y>480&&G.mousePos.x<800&&G.mousePos.y<580)
					G.ctx.drawImage(helpfocus, 0, 0);
				break;
			case "PLAY":
				var playerSprite = document.getElementById("PlayerSprites"),
					zombieSprite = document.getElementById("ZombieSprites"),
					sprite;
				G.entities.sort(function(a, b){return a.y-b.y;});
				
				for(i=0;i<501;i++) {
					if(!G.entities[i].active)continue;
					sprite = playerSprite;
					if(G.entities[i].faction==="Z")
						sprite = zombieSprite;
					if(!G.entities[i].walking) {
						switch(G.entities[i].orientation) {
							case 'N': G.ctx.drawImage(sprite, 0,   0, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'S': G.ctx.drawImage(sprite, 0, 100, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'E': G.ctx.drawImage(sprite, 0, 200, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'W': G.ctx.drawImage(sprite, 0, 300, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
						}
					} else {
						switch(G.entities[i].orientation) {
							case 'N': G.ctx.drawImage(sprite, 50 + Math.floor(G.time * G.animationSpeed) % 2 * 50,   0, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'S': G.ctx.drawImage(sprite, 50 + Math.floor(G.time * G.animationSpeed) % 2 * 50, 100, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'E': G.ctx.drawImage(sprite, 50 + Math.floor(G.time * G.animationSpeed) % 2 * 50, 200, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'W': G.ctx.drawImage(sprite, 50 + Math.floor(G.time * G.animationSpeed) % 2 * 50, 300, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
						}
					}
				}
				
				
				break;
			case "HELP":
				var help = document.getElementById("HelpImage"),
					hoverhelp = document.getElementById("HoverHelpImage");
				G.ctx.drawImage(help, 0, 0);
				if(G.mousePos.x>360&&G.mousePos.y>300&&G.mousePos.x<740&&G.mousePos.y<550)
					G.ctx.drawImage(hoverhelp, 0, 0);
				break;
			case "SET":
				break;
			case "WON":
				break;
			case "LOST":
				break;
			case "LOGOS":
				var logo = document.getElementById("LogoImage");
				G.ctx.drawImage(logo, 0, 0);
				break;
		}
	},
	getMousePos: function(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
    },
	getMouseButtons: function(evt, down) {
		evt = evt || window.event;
		var button = evt.which || evt.button;
		if(button==1)
			G.LMB=down;
	},
	setCookie: function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	getCookie: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
		}
		return "";
	}
};

