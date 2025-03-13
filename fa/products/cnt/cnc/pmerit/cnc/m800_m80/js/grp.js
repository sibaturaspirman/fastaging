// ƒOƒ‰ƒt‚Ì“®ìˆ—

$(function(){
	$(window).bind('load scroll resize',function(){
		var spd = 900;
	
		var wh = $(window).height();
		var scTop = $(window).scrollTop();
		
		var offtop = $("#grp img").offset().top ;
		var gPos = offtop-wh;
		if (scTop >= gPos + 200) {
			$("#grp #grp1 img.g1").animate({'width':'176px'},spd,nexg);
			$("#grp #grp2 img.g1").animate({'width':'176px'},spd,nexg);
			$("#grp #grp3 img.g1").animate({'width':'98px'},spd,nexg);
		} 
		function nexg() {
			$("#grp img.g2").animate({'width':'290px'},spd,nexg2);
		}

		function nexg2 () {
			$(".grp_s").css("display","block");
		}
 	});
});

