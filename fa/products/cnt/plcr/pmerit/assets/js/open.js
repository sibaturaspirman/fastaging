// JavaScript Document
$(document).ready(function(){
	//クリックイベント
	$('.sol_index').click(function(){
		//class="openarea"をスライドで表示/非表示する
		/*$(this).next('.openarea').stop(true, true).slideToggle(300, "easeOutCubic", function(){ fixedSidebar.run() } );*/
		$(this).find('.openarea').stop(true, true).slideToggle(300, "easeOutCubic");
		$(this).find('.clickarea').toggleClass("on");
	});
});
