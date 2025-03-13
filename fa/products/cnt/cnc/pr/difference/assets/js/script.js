window.MM_openBrWindow = function(targetURL, windowName, features) {
  let wopen;
  wopen = window.open(targetURL, windowName, features);
  wopen.focus();
  }

$(window).on('load', function() {
	/* ******************************************************************************
		PARALLAX                                                                   */
		var PARALLAX_POSITION = 0.85;
	/* *************************************************************************** */
	$('.js-inImgLeft,.js-inImgRight,.js-inBottom').each(function() {
		var _this = $(this);
		$(window).on('scroll',function () {
			setParallax( _this );
		});
		$(window).on('resize',function () {
			setParallax( _this );
		});
		setParallax( _this );
	});
	function setParallax( _this ) {
		var _scrollTop = $(window).scrollTop() + ( window.innerHeight * PARALLAX_POSITION );
		var _playPosition = _this.offset().top;
		if ( _scrollTop >= _playPosition ) {
			if( !_this.hasClass('is-play') ) _this.addClass('is-play');
		}
	}

	


var $viArea = $('[data-js-vi-difference]');

$viArea.each(function() {
  var $this = $(this);
  var viChangeType = $this.attr('data-js-vi-difference');
  viChangeType = viChangeType === 'fade' ? 'fade' : 'slide';

  $this.vichanger({
    //メイン画像ラッパーの表示エリアの横幅を取得するためのセレクタ取得(changeType: 'slide'の場合は必須)
    mainViewAreaSelector: function() {
      return $(this).find('[data-js-vi-difference_body]');
    },
     //メイン画像ラッパーの取得(必須)
    mainWrapperSelector: function() {
      return $(this).find('[data-js-vi-difference_main]');
    },
    //ナビゲーションラッパーの取得(オプション)
    naviWrapperSelector: function() {
      return $(this).find('[data-js-vi-difference_nav]');
    },
    //PREVボタンの取得(オプション)
    prevBtnSelector: function() {
      return $(this).find('[data-js-vi-difference_prev]');
    },
    //NEXTボタンの取得(オプション)
    nextBtnSelector: function() {
      return $(this).find('[data-js-vi-difference_next]');
    },
    //一時停止ボタンの取得(オプション)
    pauseBtnSelector: function() {
      return $(this).find('[data-js-vi-difference_pause]');
    },
    //メイン画像切り替えタイプ（'slide' or 'fade'）
    changeType: 'fade',
    //changeType:'fade'の場合のフェードタイプ
    //（'01': クロスフェード、'02': カレントを非表示にしてからフェードイン、
    //  '03': カレントの上にかぶせてフェードイン、'04': カレントがフェードアウトしてからフェードイン）
    fadeTye: '03',
    //トリガイベント（'click' or 'mouseover' or 'null'）
    naviTriggerEvent: 'click',
    //ナビゲーションのアクティブ状態を表すクラス名
    naviActiveClassName: 'c-carousel__dot-active',
    //circular:falseの場合のNEXT・PREVボタン非活性化状態を表すクラス名
    btnDisabledClassName: 'is--disabled',
    //一時停止ボタンのアクティブ状態を表すクラス名
    pauseActiveClassName: 'c-carousel__pause-active',
     //スライド前の処理
    beforeSlideContent: null,
    //スライド後の処理
    endSlideContent: null,
    //切り替えアニメーションのスピード
    //'slow'、'normal'、'fast'、もしくは完了までの時間をミリ秒単位で指定
    duration: 800,
    //切り替えアニメーションのeasing設定（'swing' or 'linear'）
    easing: 'swing',
    //自動切り替えまでの時間をミリ秒単位で指定
    //（nullの場合は自動切り替えなし、Arrayで個別設定あり）
    auto: 4000,
     //切り替えループ処理（true:ループあり、false:ループなし）
    circular: true,
    //初期表示画像インデックス
    startIndex: 0,
    //ホバーアクションによるタイマー停止処理をするか否か
    hoverTimerStop: true,
    //スワイプ機能（true:ON、false:OFF）
    swipeFlag: true,
    // リキッドレイアウトにするか否か
    liquidLayoutFlag: true,
    //アクセシビリティ対応するか否か
    accessibilityFlag: true
  });
});

});