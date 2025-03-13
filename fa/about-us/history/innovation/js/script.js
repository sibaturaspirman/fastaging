$('body').append('<div class="innovation_modal_bg"></div><div class="innovation_modal"><div class="modal_close"><a href="javascript:;"><span><img src="/fa/about-us/history/innovation/img/icon_close.png" alt="閉じる"></span></a></div><div class="modal_contents"><div class="modal_inner"></div></div></div>');
var $modal = $('.innovation_modal');
var $modalBg = $('.innovation_modal_bg');
var $modalContents = $('.innovation_modal .modal_inner');
var scrollPosTop = 0;
var paramObj = getParams( location.href );
$('.innovation_list a').on('click',function(){
	modalOpen( $(this).data('modal') );
});
$('.innovation_modal_bg, .innovation_modal .modal_close').on('click', function(){
	$('body').removeClass('is-fixed').css({'top': 0});
	$('html, body').animate({scrollTop:scrollPosTop}, 0);
	history.replaceState('null', '', location.href.split('?')[0]);
	$modalBg.fadeOut(300);
	$modal.fadeOut(300,function(){
		$modalContents.empty();
	});
});
//モーダル位置調整
$(window).on('resize',function(){
	modalPosition();
});
//URLパラメータでのモーダル初期表示
if( paramObj["id"] !== undefined ) {
	if( $('.innovation_list a[data-modal="'+paramObj["id"]+'"]').length > 0 ) {
		modalOpen( paramObj["id"] );
	}
}
function modalOpen( _id ) {
	scrollPosTop = $(window).scrollTop();
	$('body').addClass('is-fixed').css({'top': -scrollPosTop});
	var _modal = "#modal_" + _id;
	var _html = $(_modal).html();
	history.replaceState('null', '', ('?id='+_id) );
	$modalContents.append(_html);
	modalPosition();
	$modalBg.fadeIn(300);
	$modal.fadeIn(300);
}
function modalPosition() {
	var _windowHeight = window.innerHeight;
	var _modalHeight = $modal.outerHeight();
	var _top = scrollPosTop;
	if( _windowHeight > _modalHeight ) {
		_top = _top + ( _windowHeight - _modalHeight) / 2;
	}
	$modal.css({'top':_top});
}
function getParams(params){
	const regex = /[?&]([^=#]+)=([^&#]*)/g;
	const params_obj = {};
	let match;
	while(match = regex.exec(params)){
		params_obj[match[1]] = match[2];
	}
	return params_obj;
}
