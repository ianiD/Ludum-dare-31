//☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃☃


var G = {
	width: 800,	height: 600,
	title: "Death in front",
	ctx: null, canv: null,
	gameState: "LOGOS",
	interval: null,
	lastTime: null, time: 0.0,
	LMB: false, MMB: false, RMB: false,
	keys: new Array(256),
	entities: new Array(501),
	projectiles: new Array(201),
	player: {x: 320, y: 240, hp: 5, orientation: 'N', walking: false, faction: 0, active:true, animationSpeed: 0.01, walkSpeed: 0.1, tX: 320, tY: 240, dX: 0, dY: 0},
	deltaRotX: [+1, +1,  0, -1, -1, -1,  0, +1],
	deltaRotY: [ 0, +1, +1, +1,  0, -1, -1, -1],
	light:true,
	tiles: new Array(20),
	zombies: new Array(500),
	mousePos: {x: 0, y: 0},

	spritesheet: null,

	init: function() {
		G.canv = document.getElementById("gameCanvas");
		G.ctx = G.canv.getContext("2d");
		document.title = G.title;
		G.canv.width = G.width; G.canv.height = G.height;
		G.interval = setInterval(G.tick, 0);
		G.lastTime = Date.now();
		for(i=0; i<256; i++)
			G.keys[i] = false;
		document.onkeydown = function(e) {e = e || event;G.keys[e.keyCode] = true; }
		document.onkeyup = function(e)   {e = e || event;G.keys[e.keyCode] = false;}
		G.canv.addEventListener('mousemove', function(evt) {G.mousePos = G.getMousePos(G.canv, evt);}, false);
		G.canv.addEventListener('mousedown', function(evt) {G.getMouseButtons(evt, true);}, false);
		G.canv.addEventListener('mouseup', function(evt) {G.getMouseButtons(evt, false);}, false);
		document.getElementById("FTG_sound").play();
		for(i=0;i<500;i++){
			G.entities[i] = G.zombies[i] = {hp: 6,								//zombies
							x:Math.round(Math.random()*800), tX:Math.round(Math.random()*800), 
							y:Math.round(Math.random()*600), tY:Math.round(Math.random()*600), 
							active:true, orientation: 'N', walking: false,			//TODO: drops
							drops:Math.round(Math.random()*20), faction: 1,
							walkSpeed: Math.random()/10*1.2, animationSpeed: 1};
			G.entities[i].animationSpeed = G.entities[i].walkSpeed / 10;
			G.zombies[i].animationSpeed = G.zombies[i].walkSpeed / 10;
		}
		for(i=0;i<20;i++){
			G.tiles[i] = [];
			for(j=0;j<25;j++)
				G.tiles[i][j] = Math.round(Math.random()) + 1;
		}
		G.entities[500] = G.player;
		G.spritesheet = document.getElementById("EntSpr");
	},
	clearCanvas: function(){G.ctx.fillStyle="#000";G.ctx.fillRect(0,0,G.width,G.height);},
	tick: function() {
		var now = Date.now();var delta = now - G.lastTime;G.lastTime = now;
		G.update(delta);G.draw();
	},
	update: function(dt) {
		G.time+=dt;
		if(dt===0)
			dt=0.000000001;
		document.getElementById("time").innerHTML="Debug info:<br>Delta time: "+dt+"<br>Elapsed time: "+G.time+"ms";
		var arrow_keys   = true,
			qwerty       = true,
			azerty       = true;
		switch(G.gameState) {
			case "PLAY":
				var pp = false;
				if(G.keys[27]) {
					G.setCookie("LD31_FTG_wave",G.curr_wave,1000);
					G.gameState = "MENU";
				}
				G.player.dX=G.player.dY=0;
				if((G.keys[37]===true&&arrow_keys)||(G.keys[65]&&qwerty)||(G.keys[81]&&azerty)) {	//	left
					G.player.dX = -dt;
				}
				if((G.keys[38]===true&&arrow_keys)||(G.keys[87]&&qwerty)||(G.keys[90]&&azerty)) {	//	up
					G.player.dY = -dt;
				}
				if((G.keys[39]===true&&arrow_keys)||(G.keys[68]&&qwerty)||(G.keys[68]&&azerty)) {	//	right
					G.player.dX = +dt;
				}
				if((G.keys[40]===true&&arrow_keys)||(G.keys[83]&&qwerty)||(G.keys[83]&&azerty)) {	//	down
					G.player.dY = +dt;
				}
				G.player.tX=G.player.x+G.player.dX*G.player.walkSpeed;
				G.player.tY=G.player.y+G.player.dY*G.player.walkSpeed;
				G.ai(dt);
				break;
			case "LOGOS":
					if(G.time>3000) {
						G.gameState = "MENU";
						document.getElementById("TITLE_sound").play();
					}
					break;
			case "MENU":
				if(G.LMB){
					if(G.mousePos.x>540&&G.mousePos.y>300&&G.mousePos.x<750&&G.mousePos.y<390)
						G.gameState = "PLAY";
					if(G.mousePos.x>420&&G.mousePos.y>390&&G.mousePos.x<800&&G.mousePos.y<480)
						G.gameState = "SET";
					if(G.mousePos.x>420&&G.mousePos.y>480&&G.mousePos.x<800&&G.mousePos.y<580)
						G.gameState = "HELP";
					G.LMB=false;
				}
				break;
			case "HELP":
				if(G.LMB){
					if(G.mousePos.x>360&&G.mousePos.y>300&&G.mousePos.x<740&&G.mousePos.y<550)
						G.gameState = "MENU";
					G.LMB=false;
				}
				break;
			case "LOST":
				G.setCookie("LD31_FTG_wave", 1, 10000);
				if(G.LMB)
					if(G.mousePos.x>0&&G.mousePos.y>0&&G.mousePos.x<0&&G.mousePos.y<0)
						G.gameState = "MENU";
				break;
			case "WON":
				if(G.LMB)
					if(G.mousePos.x>0&&G.mousePos.y>0&&G.mousePos.x<0&&G.mousePos.y<0)
						G.gameState = "MENU";
				break;
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
				var mouseAngle, gunrot, gunspr = [document.getElementById("Gun0"),
												document.getElementById("Gun1"),
												document.getElementById("Gun2"),
												document.getElementById("Gun3"),
												document.getElementById("Gun4"),
												document.getElementById("Gun5"),
												null,
												document.getElementById("Gun7")],
					HP = [document.getElementById("Hp0"),document.getElementById("Hp1"),document.getElementById("Hp2"),document.getElementById("Hp3"),document.getElementById("Hp4"),document.getElementById("Hp5")];
				G.entities = G.zombies.concat(G.player);
				G.entities.sort(function(a, b){return a.y-b.y;});
				mouseAngle = Math.atan2(G.player.y-G.mousePos.y, G.player.x-G.mousePos.x);
				G.player.hp = Math.round(G.time / 100) % 6;
				var dmin = 10;
				for(j=0;j<16;j++){
					if(dmin>Math.abs(mouseAngle - (j-8)*Math.PI/8)){
						dmin = Math.abs(mouseAngle - (j-8)*Math.PI/8);
						gunrot = Math.round(j/2);
					}
				}
				if(gunrot===8)
					gunrot=0;
				for(i=0;i<20;i++) {
					for(j=0;j<25;j++){
						if(G.tiles[i][j])
							G.ctx.drawImage(G.spritesheet, 288 + G.tiles[i][j] * 32, 0, 32, 32, j*32, i*32, 32, 32);
					}
				}
				for(i=0;i<501;i++) {			//ENTITIES
					if(!G.entities[i].active)continue;
					if(G.entities[i].hp == 0) {

					}
					if(!G.entities[i].walking) {
						switch(G.entities[i].orientation) {
							case 'S': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150,   0, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'N': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150, 100, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'W': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150, 200, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'E': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150, 300, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
						}
					} else {
						switch(G.entities[i].orientation) {
							case 'S': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150 + 50 + Math.floor(G.time * G.entities[i].animationSpeed) % 2 * 50,   0, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'N': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150 + 50 + Math.floor(G.time * G.entities[i].animationSpeed) % 2 * 50, 100, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'W': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150 + 50 + Math.floor(G.time * G.entities[i].animationSpeed) % 2 * 50, 200, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
							case 'E': G.ctx.drawImage(G.spritesheet, G.entities[i].faction*150 + 50 + Math.floor(G.time * G.entities[i].animationSpeed) % 2 * 50, 300, 50, 100, G.entities[i].x - 10, G.entities[i].y - 20, 20, 40);break;
						}
					}
					if(gunrot!=6&&G.entities[i].faction==0)
						G.ctx.drawImage(gunspr[gunrot], G.player.x - 100, G.player.y - 75, 200, 150);
				}
				//LIGHTMASK
				//if(G.light)
				var lightmask = document.getElementById("Light");
				var nolight = document.getElementById("NoLight");
				G.ctx.translate(G.player.x, G.player.y);
				G.ctx.rotate(mouseAngle - Math.PI);
				G.ctx.drawImage(lightmask, 0, 0, 1024, 1024, 0, 0, 1024, 1024);
				G.ctx.scale(+1, -1);
				G.ctx.drawImage(lightmask, 0, 0, 1024, 1024, 0, 0, 1024, 1024);
				G.ctx.scale(-1, -1);
				G.ctx.drawImage(nolight, 0, 0, 512, 1024, -0.5, -1024, 1024, 2048);
				G.ctx.scale(-1, +1);
				G.ctx.rotate(-mouseAngle + Math.PI);
				G.ctx.translate(-G.player.x, -G.player.y);
				//high blocks
				//GUI
				G.ctx.drawImage(HP[G.player.hp], 323, 562);
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
	pointOnCircle: function(center, radius) {
		var random_angle = Math.random() * Math.PI * 2;
		return {x:center.x+Math.cos(random_angle)*radius, y:center.y+Math.sin(random_angle)*radius};
	},
	ai: function(dt) {
		for(i=0;i<500;i++)	//for every zombie
			if(Math.random() > 0.975 && G.zombies[i].active){
				var player_distance = G.distance(G.zombies[i].x, G.zombies[i].y, G.player.x, G.player.y);
				G.zombies[i].tX = G.pointOnCircle(G.player, player_distance/2).x;
				G.zombies[i].tY = G.pointOnCircle(G.player, player_distance/2).y;
			}
		for(i=0;i<501;i++){	//for every entity
			if(!G.entities[i].active) continue;
			if(G.distance(G.entities[i].x, G.entities[i].y, G.entities[i].tX, G.entities[i].tY)<1){
				G.entities[i].tX = G.entities[i].x;
				G.entities[i].tY = G.entities[i].y;
				G.entities[i].walking=false;
			}
			G.walk(G.entities[i], dt);
		}
	},
	walk: function(who, dt) {
		if(who.x<who.tX){
			who.x+=dt*who.walkSpeed;
			who.orientation = "E";
			who.walking=true;
		}
		if(who.x>who.tX){
			who.x-=dt*who.walkSpeed;
			who.orientation = "W";
			who.walking=true;
		}
		if(who.y<who.tY){
			who.y+=dt*who.walkSpeed;
			who.orientation = "S";
			who.walking=true;
		}
		if(who.y>who.tY){
			who.y-=dt*who.walkSpeed;
			who.orientation = "N";
			who.walking=true;
		}
	},
	distance: function(x1, y1, x2, y2) {
		return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	},
	getMousePos: function(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {x: evt.clientX - rect.left,y: evt.clientY - rect.top};
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

