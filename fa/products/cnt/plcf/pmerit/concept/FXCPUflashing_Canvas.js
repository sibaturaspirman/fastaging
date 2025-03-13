(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes
lib.webFontTxtFilters = {}; 

// library properties:
lib.properties = {
	width: 780,
	height: 360,
	fps: 12,
	color: "#FFFFFF",
	webfonts: {},
	manifest: [
		{src:"images/FX5UCPU_flashing_W780.jpg", id:"FX5UCPU_flashing_W780"}
	]
};



lib.webfontAvailable = function(family) { 
	lib.properties.webfonts[family] = true;
	var txtFilters = lib.webFontTxtFilters && lib.webFontTxtFilters[family] || [];
	for(var f = 0; f < txtFilters.length; ++f) {
		txtFilters[f].updateCache();
	}
};
// symbols:



(lib.FX5UCPU_flashing_W780 = function() {
	this.initialize(img.FX5UCPU_flashing_W780);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,780,359);


(lib.OUT0消灯 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#1C1D1F").s().p("AgiAiQgPgOAAgUQAAgTAPgPQAPgPATAAQAUAAAOAPQAQAPgBATQABAUgQAOQgOAQgUgBQgTABgPgQg");
	this.shape.setTransform(5,5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,10,10);


(lib.FX5UCPU = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// レイヤー 1
	this.instance = new lib.FX5UCPU_flashing_W780();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,780,359);


(lib.ERR消灯 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#1C1D1F").s().p("AiIBVIAAipIERAAIAACpg");
	this.shape.setTransform(13.8,8.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,27.5,17);


// stage content:
(lib.FXCPUflashing_Canvas = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// OUT0点滅
	this.instance = new lib.OUT0消灯("synched",0);
	this.instance.setTransform(647.9,265.9,1,1,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(6).to({alpha:0},0).wait(6).to({alpha:1},0).wait(6).to({alpha:0},0).wait(6).to({alpha:1},0).wait(6).to({alpha:0},0).wait(6));

	// ERR点滅
	this.instance_1 = new lib.ERR消灯("synched",0);
	this.instance_1.setTransform(534.3,84,1,1,0,0,0,13.8,8.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2).to({alpha:1},0).wait(2).to({alpha:0},0).wait(2));

	// レイヤー 1
	this.instance_2 = new lib.FX5UCPU("synched",0);
	this.instance_2.setTransform(390,179.5,1,1,0,0,0,390,179.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(36));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(390,180,780,359);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;