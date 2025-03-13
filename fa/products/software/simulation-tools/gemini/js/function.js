// JavaScript Document	

var typeSelect = $('#type-select');
var manufacturerSelect = $('#manufacturer-select');
var partsList = $('.partsList');
var typeList = [];
var manufacturerList = [];
var targetList = $('.target[data-type]');

var disp_parts="flex";
var disp_partsDetail ="table-row";
if ($(window).width()>870){
	disp_partsDetail="table-row";
}else{
	disp_partsDetail="block";
}

/*PCの場合はクリックイベント，スマホ・タブレットの場合はタッチイベントをセットする*/
var clickEventType = (( window.ontouchstart!==null ) ? 'click':'touchend');

/*ページ読み込み時にセレクトボックスを生成する*/
$(document).ready(function () {

	// 初期表示時にカテゴリを生成
	generateTypeBoxes();
	generateManufacturerBoxes();

});
/*タイプのセレクトボックスを変更したときに起動*/
typeSelect.change(function(){
	//検索ワードをリセット
	$('#search_text').val("");
	//ををを削除する
	$('#clear').remove();
	
	
	var dispMode = disp_parts;
	
	if(partsList.hasClass('detail')){
		dispMode = disp_partsDetail;
	}
	//選択したタイプのパーツを表示
	selectDisplay(dispMode);
	
	//選択したタイプと紐づく製造元をプルダウンをに表示
	ChangeManufacturerBoxes();
});	

/*製造元セレクトボックスを変更したときに起動*/
manufacturerSelect.change(function(){
	//検索ワードをリセット
	$('#search_text').val("");
		//ををを削除する
	$('#clear').remove();
	
	var dispMode = disp_parts;
	
	if(partsList.hasClass('detail')){
		dispMode = disp_partsDetail;
	}
	
	//選択した製造元のパーツを表示
	selectDisplay(dispMode);
	
	//選択した製造元と紐づくタイプをプルダウンに表示
	ChangeTypeBoxes();
});

/*検索ボタンを押したときに検索を実行する*/
$(document).on(clickEventType,'#search_buttun',function(){
	
	if($('#search_text').val()==''){
		alert("Please enter a search term");
		
		return
	}
	
	//表示するモードで値を変更する
	var dispMode = disp_parts;
	
	if(partsList.hasClass('detail')){
		dispMode = disp_partsDetail;
	}
	
	// セレクトボックスの状態を取得する
	var selType = (( typeSelect.val()=='all' ) ? '':'="' + typeSelect.val() + '"');
	var selManufacturer = ((manufacturerSelect.val() == 'all') ? '' : '="' + manufacturerSelect.val()+ '"');
	
	var searchText = $('#search_text').val().toLowerCase(); // 検索ボックスに入力された値
	
	targetList.fadeOut();
	
	$('.target[data-type' + selType + '][data-manufacture'+selManufacturer+']').each(function() {

		var $target = $(this);
		var targetText ="";

		$(this).find('p[data-search="true"]').each(function() {

			targetText = targetText + $(this).text().toLowerCase();

		});
		
		if (targetText.indexOf(searchText) != -1) {

			$target.css('display', dispMode).fadeIn();
		}
	});
	
	//×ボタンが表示されていなければ，表示する
	if($('#clear').length == 0){
		$('#search_text').after('<button id="clear"></button>');	
	}

});

/*×ボタンを押したときに検索結果をクリアする*/
$(document).on(clickEventType,'#clear',function(){

	var dispMode = disp_parts;
	
	if(partsList.hasClass('detail')){
		dispMode = disp_partsDetail;
	}
	
	$('#search_text').val('');
	$('#clear').remove();
	selectDisplay(dispMode);
});

/*トグルボタンを変更したときに起動*/
/*ページ分離のため不要*/
//$('#toggle').on('change',function(){
//	
//	//$('.loading-overlay').removeClass('hidden');
//	
//	//トグルボタンをONにしたとき，詳細情報を表示する
//	if($(this).prop('checked')){
//		
//		$('.partsList').addClass('detail');
//
//		$('.target').each(function(){
//			$('.target[style*="display: flex"]').css('display',disp_partsDetail);
//			$(this).find('p:last-of-type').attr('data-search','true');			
//		});		
//		
//		//$('.loading-overlay').addClass('hidden');
//		$('.target').off('click',openModal);
//		
//    //トグルボタンをOFFにしたとき，詳細情報を非表示にする		
//	}else{
//		$('.partsList').removeClass('detail');
//		$('.target').on('click', openModal);
//		$('.target p:last-of-type').attr('data-search','false');
//		
//		//$('.loading-overlay').addClass('hidden');
//	}
//});

//モーダルウィンドウを表示する	
$('.target div').on('click', function(){

	var imgSrc = $(this).find('img').attr('src');
	var imgAlt = $(this).find('img').attr('alt');
	
	$("#modal").addClass("open"); // modalクラスにopenクラス付与
	$("#overlay").addClass("open"); // overlayクラスにopenクラス付与
	
	$('.modal_title').text($(this).find('p').text()); //クリックした要素のタイトルを取得し，設定
	$('.modal_inner').append('<img src="'+ imgSrc +'" alt="'+ imgAlt +'" >');
});

$("#close,#overlay").on('click', function () { //×ボタンをクリックしたとき
	$("#modal").removeClass("open"); // modalクラスからopenクラスを外す
	$("#overlay").removeClass("open"); // overlayクラスからopenクラスを外す
	$('.modal_title').text('');
	$('.modal_inner img').remove();
});

$(document).ready(function() {
	var lastScrollTop = 0;
	
	$(window).scroll(function() {
		
		var scrollTop = $(this).scrollTop();
		var inputblockHeight = $('.input-block').outerHeight();
				
		// 下にスクロールしている場合
		if (scrollTop > lastScrollTop) {
			
			if($(window).width() > 980){

				$('.input-block').stop().animate({top:'0px'},200,'swing');
				$('.detail_header').stop().animate({top:inputblockHeight}),100,'swing';
			}else{
				$('.input-block').stop().animate({top:'0px'}),200,'swing';
			}
			

		// 上にスクロールしている場合
		} else if (scrollTop < lastScrollTop){

			if($(window).width() > 980){

				$('.input-block').stop().animate({top:'117px'},200,'swing');	/*hedder+navi 85 + 32 (px) */
				
				inputblockHeight = inputblockHeight + 117 + 1;
				$('.detail_header').stop().animate({top:inputblockHeight},100,'swing');  /*hedder+navi+検索エリア 85 + 32 + 検索エリアの高さ (px)*/
			}else{
				$('.input-block').stop().animate({top:'65px'},200,'swing');	/*hedder 85(px) */
				$('.detail_header').css('top','0');

			}
		}else{
				$('.input-block').stop().animate({top:'0px'},200,'swing');

		}
    lastScrollTop = scrollTop;
  });
});


// タイプのセレクトボックスを生成する関数
function generateTypeBoxes() {

	typeList = [];
	
	partsList.find('.target').each(function () {
		var data_type = $(this).data('type');
		
		if (!typeList.includes(data_type)) {

			typeList.push(data_type);
			typeSelect.append($('<option></option>').val(data_type).text(data_type));
			
		}
	});
	
	// ABC順に並び替える
	var item = typeSelect.children().sort(sortSelction);
	
	// 製造元のプルダウンに「選択してください」を加える
	typeSelect.append($('<option></option>').val("all").text('Please select'));
	
	typeSelect.append(item);
	
	typeSelect.val('all');
}

// 製造元のセレクトボックスを生成する関数
function generateManufacturerBoxes() {
	
	manufacturerList = [];
	
	partsList.find('.target').each(function () {
		
		var data_manufacturer = $(this).data('manufacture');
    
		if (!manufacturerList.includes(data_manufacturer)) {
			
			manufacturerList.push(data_manufacturer);
			manufacturerSelect.append($('<option></option>').val(data_manufacturer).text(data_manufacturer));
		}
  });

	// ABC順に並び替える
	var item = manufacturerSelect.children().sort(sortSelction);
	
	// 製造元のプルダウンに「選択してください」を加える
	manufacturerSelect.append($('<option></option>').val("all").text('Please select'));
	
	manufacturerSelect.append(item);
	
	manufacturerSelect.val('all');	
}

// タイプと紐づく製造元のプルダウンを生成する関数
function ChangeManufacturerBoxes() {
	manufacturerList = [];
	
	//選択されている製造元を保持
	var selManufacturer = manufacturerSelect.val();
	
	// 製造元のプルダウンをリセット
	$('#manufacturer-select > option').remove();
	
	if (typeSelect.val() == 'all') {
		
		//製造元のプルダウンを生成
		generateManufacturerBoxes();
		
    }else{
		
		// 製造元のプルダウンに「選択してください」を加える
		manufacturerSelect.append($('<option></option>').val("all").text('Please select'));
		
		// 選択されたタイプと同じ製造元のみを、プルダウンの選択肢に設定する
		partsList.find('.target').each(function() {

			var data_type = $(this).data('type');
			var data_manufakucturer = $(this).data('manufacture');

			if (typeSelect.val() == data_type) {

				if (!manufacturerList.includes(data_manufakucturer)) {

					manufacturerList.push(data_manufakucturer);
					manufacturerSelect.append($('<option></option>').val(data_manufakucturer).text(data_manufakucturer));
				}		
			}
		});		
	}
	if(selManufacturer != 'all'){
		manufacturerSelect.val(selManufacturer);
	}
}

// 製造元と紐づくタイプのプルダウンを生成する関数
function ChangeTypeBoxes() {
	typeList = [];
	
	//選択されているモデルを保持
	var selType = typeSelect.val();
	
	// モデルのプルダウンをリセット
	$('#type-select > option').remove();
	
	if (manufacturerSelect.val() == 'all') {
		//モデルのプルダウンを生成
		generateTypeBoxes();
		
    }else{
		// モデルのプルダウンに「選択してください」を加える
		typeSelect.append($('<option></option>').val("all").text('Please select'));

		// 製造元で選択されたカテゴリーと同じモデルのみを、プルダウンの選択肢に設定する
		partsList.find('.target').each(function() {

			var data_type = $(this).data('type');
			var data_manufakucturer = $(this).data('manufacture');

			if (manufacturerSelect.val() == data_manufakucturer) {

				if (!typeList.includes(data_type)) {

					typeList.push(data_type);
					typeSelect.append($('<option></option>').val(data_type).text(data_type));
				}		
			}
		});
	}

	
	if(selType != 'all'){
		typeSelect.val(selType);
	}
}

/*セレクトボックスを変更したときに表示を絞り込む*/
function selectDisplay(dispMode){
	
	targetList.fadeOut().promise().done(function(){
		if (typeSelect.val() == 'all'){


			//製造元が選択されている場合は，製造元で絞り込んだ状態を表示する
			if (manufacturerSelect.val() != 'all'){
				targetList.fadeOut();
				targetList.filter('[data-manufacture = "' + manufacturerSelect.val() + '"]').css('display', dispMode).fadeIn();			

			}else{

				targetList.css('display', dispMode).fadeIn();
			}

		} else {

			if(manufacturerSelect.val() == 'all'){
				targetList.fadeOut();
				targetList.filter('[data-type = "' + typeSelect.val() + '"]').css('display', dispMode).fadeIn();

			}else{
				targetList.fadeOut();
				targetList.filter('[data-type = "' + typeSelect.val() + '"]' + '[data-manufacture = "' + manufacturerSelect.val() + '"]').css('display', dispMode).fadeIn();
			}

		}	
	});	
}

/*セレクトボックスを並び替える*/
function sortSelction (a,b){
	
	//textでソート
	var sortA= a.text;
	var sortB = b.text;

	if (sortA > sortB) {
		return 1;
	} else if (sortA < sortB) {
		return -1;
	} else {
		return 0;
	}
}

