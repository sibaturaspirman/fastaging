$(function(){

	var controller = new ScrollMagic.Controller();
	$scene = $('#contents_c80');
	$scene.find('.infinity').css('top', '5px');

	tl = new TimelineMax();
	tl.from( $scene.find('.text1'), 1.0, { autoAlpha: 0, ease: Power2.easeOut })
		.from( $scene.find('.feature01'), .8, { x: '+=150', autoAlpha: 0, ease: Power4.easeOut }, 0.4)
		.from( $scene.find('.feature02'), .8, { x: '+=150', autoAlpha: 0, ease: Power4.easeOut }, 0.5)
		.from( $scene.find('.feature03'), .8, { x: '+=150', autoAlpha: 0, ease: Power4.easeOut }, 0.6)
		.from( $scene.find('.feature04'), .8, { x: '+=150', autoAlpha: 0, ease: Power4.easeOut }, 0.7)
		.from( $scene.find('.feature05'), .8, { x: '+=150', autoAlpha: 0, ease: Power4.easeOut }, 0.8)
		.from( $scene.find('.gear'), 1.1, { x: '-=70', autoAlpha: 0, ease: Power2.easeOut }, 0.5)
		.from( $scene.find('.light'), 2, { autoAlpha: 0, ease: Power2.easeOut }, 2.0)
		.from( $scene.find('.infinity'), 1, { y: '+=80', autoAlpha: 0, scale: 0, ease: Power2.easeOut, onComplete: function(){
			TweenMax.to( $scene.find('.infinity'), 3.0, { y: '+=25', yoyo:true, repeat:-1, ease: Power2.easeInOut });
		} }, 2.2)
		.from( $scene.find('.text2'), 1.0, { x: '-=10', autoAlpha: 0, ease: Power2.easeOut }, 3.5)
		.from( $scene.find('.border'), .1, { x: '-=30', y: '+=5', autoAlpha: 0, ease: Power2.easeOut }, 4);

	new ScrollMagic.Scene({triggerElement: '#contents_c80', reverse: false, triggerHook: 0.5})
		.setTween(tl)
		.addTo(controller);

	// スクロール表示位置
	var	$scroll = $('<div id="scroll"><img src="images/scroll.png" alt="" /></div>');
	$scroll.appendTo('#melfa_main_area').show();
	var scrollIn = new ScrollMagic.Scene({ triggerElement: '#contents_c80', triggerHook: 0.5 })
	.on('enter', function(e){
		$scroll.fadeOut(300);
	})
	.addTo(controller);

});