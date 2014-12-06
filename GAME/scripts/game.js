var GAME = {
	ctx: null,
	init: function() {
		ctx = document.getElementById("gameCanvas").getContext("2d");
		ctx.fillRect(0,0,1000,1000);
	}
}