// JavaScript Document

(window.onload = function() {

  // フェードイン処理
  jQuery(window).scroll(function (){
    jQuery(".fade").each(function(){
      var winheight = jQuery(window).height();
      var posi = jQuery(this).offset().top;
      var scroll = jQuery(window).scrollTop();
      if (scroll + winheight > posi){
        jQuery(this).addClass("fadein");
      } else {
        //スクロールで画面上部に戻った際に要素を非表示にしたい場合は、下記の行のコメントを外し有効にする
        //jQuery(this).removeClass("fadein");
      }
    });
   });

})(); 


// メインフェードイン処理
$(window).scroll(function (){
    $(".main_bgwrap").each(function(){
      var offset    = $(this).offset().top;
      var scroll    = $(window).scrollTop();
      var wHeight   = $(window).height();

      if (scroll > offset - wHeight + wHeight/2){
        $(this).addClass("show");
      }
    });
  });


// アンダーライン設定
$(window).on('scroll',function(){
  $(".underline-before").each(function(){
    let position = $(this).offset().top;
    let scroll = $(window).scrollTop();
    let windowHeight = $(window).height();
    if (scroll > position - windowHeight + 200){
      $(this).addClass('underline-after');
    }
  });
});


