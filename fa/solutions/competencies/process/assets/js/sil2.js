// JavaScript Document

$(function() {
	'use strict';

	//初期画像と説明タブを開く
	$('.list_image').eq(0).css('display','block');
	$('.list_contents').eq(0).css('display','block');

	//クリックしたときのファンクションをまとめて指定
	$('.list_link').click(function() {

		//.index()を使いクリックされたタブが何番目かを調べ、
		//indexという変数に代入。（初期画像と説明タブの順番を飛ばすために1を足す）
		var index = $('.list_link').index(this) + 1;

		//画像とコンテンツを一度すべて非表示にし、
		$('.list_image').css('display','none');
		$('.list_contents').css('display','none');

		//クリックされたタブと同じ順番の画像とコンテンツを表示します。
		$('.list_image').eq(index).css('display','block');
		$('.list_contents').eq(index).css('display','block');

		//一度タブについているクラスselectを消し、
		$('.list_link').removeClass('select');

		//クリックされたタブのみにクラスselectをつけます。
		$(this).addClass('select');
	});
});