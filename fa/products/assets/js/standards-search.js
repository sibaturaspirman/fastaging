/**
 * @fileOverview standrds-search.js
 */

// 新システムに移行済みの機種ページか判定
const isDotPage = document.location.href.indexOf('.page') !== -1;

// 言語対応
const specSearchLabels = {};
if( document.documentElement.lang.indexOf('ja') !== -1 ) {
	specSearchLabels.compareSpec = '仕様比較';
	specSearchLabels.close = '閉じる';
	specSearchLabels.viewAll = 'すべて表示';
	specSearchLabels.changeConditions = '条件変更';
	specSearchLabels.imageWindowTitle = '画像ウィンドウ｜三菱電機 FA';
	specSearchLabels.zoomImage = '拡大画像';
} else {
	specSearchLabels.compareSpec = 'Specification comparisons';
	specSearchLabels.close = 'Close';
	specSearchLabels.viewAll = 'View all';
	specSearchLabels.changeConditions = 'Change Conditions';
	specSearchLabels.imageWindowTitle = 'Image window｜Mitsubishi Electric FA';
	specSearchLabels.zoomImage = 'Extended image';
}


if(isDotPage) {
	// console.log('新システム');

	//===================================== init var
	var $body = $('body');

	var sideNavSelector = 'div.l-grid__item:has(.product_table_nav)'; //左ナビ全体
	var tableFilterSelector = 'div.product_table_filter'; //フィルター全体のブロック要素
	var itemWrapperSelector = 'div.product_table_filter_item_wrapper'; //選択エリア
	var itemInputSelector = 'input.product_table_filter_switch'; //選択エリアのinput要素
	var itemInputTextSelector = 'span.product_table_filter_text'; //選択エリアのinput要素のテキスト
	var selectedSelector = 'div.product_table_filter_selected'; //選択済みエリア
	var triggerSelector = 'div.product_table_filter_trigger'; //開閉トリガ
	var triggerLabelSelector = 'a.product_table_filter_trigger_label'; //開閉トリガ内のテキストラベル
	var resetTriggerSelector = 'p.product_table_filter_reset'; //リセットボタン

	var filterHasChildClass = 'has_child';
	var itemBlockParentClass = 'parent';
	var itemBlockChildClass = 'child';
	var itemWrapperDefaultClass = 'default';
	var itemWrapperOpenedClass = 'opened';
	var selectedOpendClass = 'opened';
	var selectedItemClassHeadName = 'selected_item_';
	var triggerOpenedClass = 'close';
	var triggerClosedClass = 'open';
	var triggerOpenedLabelText = specSearchLabels.close;
	var triggerDefaltLabelText = specSearchLabels.viewAll;
	var triggerSelectedLabelText = specSearchLabels.changeConditions;

	var currentNavIndex = null;

	var search = '';
	var word = '';
	var kisyu = '';
	var cfMode = '0';
	var lastSend = '';
	var currentPage = 1;
	var compForm;
	var sortKey = ''; // 並び替えキー
	var sortOrder = ''; // 並び替え順
	var refreshFlg = false; // 検索結果一覧を更新するかどうか
	var categoryChangeFlg = false; // カテゴリを変更したかどうか
	var referrerCookie = "";
	var loadCnt = 0; // tooltipのjs呼び出しカウント
	var ptnL = '0'; // 形名指定用特殊文字


	//関数群------------------------------------------------
	/**
	 * [仕様から探す]ページの左ナビ初期化
	 */
	function initProductTableNav() {
		var $productTableNav = $(sideNavSelector).find('div.product_table_nav');
		var $productTableFilterItemBlock = $productTableNav.find('dd.product_table_filter_item_block');

		currentNavIndex = null;

		$productTableFilterItemBlock.each(function (blockIndex) {
			var $targetBlock = $(this);
			var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
			var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
			var $targetItemInput = $targetItemWrapper.find(itemInputSelector);
			var $targetSelected = $targetBlock.find(selectedSelector);
			var $targetSelectedUl = $targetSelected.find('ul');
			var $targetTrigger = $targetBlock.find(triggerSelector);
			var $resetTrigger = $targetBlock.find(resetTriggerSelector).children('a');

			//デフォルトで開いているブロックがあればカレントに設定
			if ($targetItemWrapper.hasClass(itemWrapperOpenedClass) && $targetTrigger.hasClass(triggerOpenedClass)) {
				currentNavIndex = blockIndex;
				$body.bind('mousedown', ItemBlockClose);
			}

			//デフォルトで選択済みエリアが開いていたら
			if ($targetSelected.hasClass(selectedOpendClass)) {
				//選択済みラベルをチェックボックスへ反映
				$targetSelectedUl.find('li').each(function () {
					var $targetLi = $(this);
					var targetInputIndex = $targetLi.prop('class').replace(selectedItemClassHeadName, '');
					$targetItemWrapper.find(itemInputSelector).eq(targetInputIndex).prop('checked', true);
				});
				//選択済み項目の削除イベント初期化
				selectedItemEventInit($targetBlock);
			}

			//開閉トリガのクリックイベント
			$targetTrigger.click(function(e) {
				//他が開いていたら閉じる
				if (currentNavIndex !== blockIndex) ItemBlockClose();

				if (!$targetItemWrapper.hasClass(itemWrapperOpenedClass)) {
					currentNavIndex = blockIndex;
					ItemBlockOpen();
				} else {
					ItemBlockClose();
				}

				e.preventDefault();
				return false;
			});

			//選択エリアのクリックイベント
			$targetItemWrapper.click(function(e) {
				//他が開いていたら閉じる
				if (currentNavIndex !== blockIndex) ItemBlockClose();
				//ターゲットのブロックが閉じていたら開く
				if (!$targetItemWrapper.hasClass(itemWrapperOpenedClass)) {
					currentNavIndex = blockIndex;
					ItemBlockOpen();
				}
			});

			//選択エリア内のクリックイベントでは閉じないようにする
			$targetBlock.bind('mousedown', function(e) {
				e.stopPropagation();
			});

			//チェックボックス、ラジオボタンイベント
			$targetItemInput.each(function (inputIndex) {
				var $targetInput = $(this);

				$targetInput.click(function(e) {
					//ラジオボタンの場合は選択済みエリアをリセット
					if ($targetInput.prop('type') === 'radio') {
						$targetSelectedUl.empty();
					}

					//チェック状態を選択済みエリアに反映
					if($targetInput.prop('checked')) {
						var selectedText = $targetInput.next(itemInputTextSelector).html();
						$targetSelectedUl.append('<li class="' + selectedItemClassHeadName + inputIndex + '">' + selectedText + '<a class="delete" href="#">削除</a></li>');
					} else {
						$targetSelectedUl.find('.' + selectedItemClassHeadName + inputIndex).remove();
					}

					//親分類
					if ($targetBlock.hasClass(itemBlockParentClass)) {
						//チェックが入っている場合
						if ($targetItemInput.filter(':checked').length > 0) {
							//子分類を表示
							if (!$targetTableFilter.hasClass(filterHasChildClass)){
								$targetTableFilter.addClass(filterHasChildClass);
							}
						} else {
							//子分類を非表示
							if ($targetTableFilter.hasClass(filterHasChildClass)){
								$targetTableFilter.removeClass(filterHasChildClass);
							}
						}
					}

					// 画面更新
					if (refreshFlg == true) {
						selectChange();
					}
				});
			});

			//リセットボタン
			$resetTrigger.click(function(e) {
				$targetItemInput.prop("checked", false);
				$targetSelectedUl.find('li').remove();
				//親分類の場合は子を非表示
				if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
					$targetTableFilter.removeClass(filterHasChildClass);
				}
				e.preventDefault();

				// 画面更新
				if (refreshFlg == true) {
					selectChange();
				}

				return false;
			});

		});

		/**
		 * 絞り込みエリアを開く
		 */
		function ItemBlockOpen() {
			if (currentNavIndex !== null) {
				var $targetBlock = $productTableFilterItemBlock.eq(currentNavIndex);
				var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
				var $targetSelected = $targetBlock.find(selectedSelector);
				var $targetTrigger = $targetBlock.find(triggerSelector);
				var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

				//チェックボックスエリアを開く
				$targetItemWrapper.removeClass(itemWrapperDefaultClass).addClass(itemWrapperOpenedClass);
				//選択済みエリアを閉じる
				$targetSelected.removeClass(selectedOpendClass);
				//トリガーを開いた状態に変更
				$targetTriggerLabel.text(triggerOpenedLabelText);
				$targetTrigger.removeClass(triggerClosedClass).addClass(triggerOpenedClass);
				//エリア外クリックで閉じる
				$body.bind('mousedown', ItemBlockClose);
			}

		}

		/**
		 * 絞り込みエリアを閉じる
		 */
		function ItemBlockClose() {
			if (currentNavIndex !== null) {
				var $targetBlock = $productTableFilterItemBlock.eq(currentNavIndex);
				var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
				var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
				var $targetItemInput = $targetItemWrapper.find(itemInputSelector);
				var $targetSelected = $targetBlock.find(selectedSelector);
				var $targetSelectedUl = $targetSelected.find('ul');
				var $targetTrigger = $targetBlock.find(triggerSelector);
				var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

				//チェックボックスエリアを閉じる
				$targetItemWrapper.removeClass(itemWrapperOpenedClass);

				//チェックボックス、又はラジオボタンにチェックが入っている場合
				if ($targetItemInput.filter(':checked').length > 0) {
					//選択済みエリアのリスト要素の並べ替え
					$targetSelectedUl.html(
						$targetSelectedUl.find('li').sort(function(a, b) {
							return parseInt($(a).prop('class').replace(selectedItemClassHeadName, ''), 10) - parseInt($(b).prop('class').replace(selectedItemClassHeadName, ''), 10);
						})
					);

					//選択済み項目の削除イベント初期化
					selectedItemEventInit($targetBlock);

					//選択済みエリアを開く
					$targetSelected.addClass(selectedOpendClass);
					//トリガのラベルを選択済みの状態に変更
					$targetTriggerLabel.text(triggerSelectedLabelText);

				//チェックボックス、又はラジオボタンにチェックが入っていない場合
				} else {
					//チェックボックスエリア・及びトリガをデフォルトの状態にする
					$targetItemWrapper.addClass(itemWrapperDefaultClass);
					$targetTriggerLabel.text(triggerDefaltLabelText);

					//親子関係がある場合は子を非表示
					if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
						$targetTableFilter.removeClass(filterHasChildClass);
					}
				}
				//トリガを閉じた状態に変更
				$targetTrigger.removeClass(triggerOpenedClass).addClass(triggerClosedClass);
				//エリア外クリックイベント解除
				$body.unbind('mousedown', ItemBlockClose);

				currentNavIndex = null;
			}
		}

		/**
		 * 選択済みエリアの削除イベント初期化
		 */
		function selectedItemEventInit($targetBlock) {
			var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
			var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
			var $targetSelected = $targetBlock.find(selectedSelector);
			var $targetSelectedUl = $targetSelected.find('ul');
			var $targetTrigger = $targetBlock.find(triggerSelector);
			var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

			$targetSelectedUl.find('li').each(function () {
				var $targetLi = $(this);

				$targetLi.find('a').click(function(e) {
					//対象のチェックボックスのチェックを外す
					var targetInputIndex = $targetLi.prop('class').replace(selectedItemClassHeadName, '');
					$targetItemWrapper.find(itemInputSelector).eq(targetInputIndex).prop('checked', false);
					//選択済み項目を削除
					$targetLi.remove();
					//全て削除されたらチェックボックスエリアをデフォルトの状態にする
					if ($targetSelectedUl.find('li').length < 1 ){
						$targetSelected.removeClass(selectedOpendClass);
						$targetItemWrapper.addClass(itemWrapperDefaultClass);
						$targetTriggerLabel.text(triggerDefaltLabelText);

						//親子関係がある場合は子を非表示
						if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
							$targetTableFilter.removeClass(filterHasChildClass);
						}
					}
					e.preventDefault();

					// 画面更新
					if (refreshFlg == true) {
						selectChange();
					}

					return false;
				});
			});
		}
	}

	// 検索結果表示
	// クエリから呼び出しを判定し、表示無内容を決定する
	function searchSpec() {
		// クエリ取得
		var prm = getUrlParams();
		var selectSearch = prm["search"];
		var selectWord = prm["word"];

		// クエリ:search=Lかつwordが設定されている場合は、形名検索結果の表示
		if (null != selectSearch && null != selectWord) {
			if ("L" == selectSearch && ptnL == '0') {
				ptnL = '1';
				// 形名検索結果を取得する
				checkFormSearchParm(selectWord);
			} else {
				// 検索結果を取得する
				getSearchResult();
			}
		} else {
			// 検索結果を取得する
			getSearchResult();
		}
	}

	// リストボックス検索表示設定
	function listboxSearch(html) {
		// 検索結果の書き込み
		$('#search_result').html(html);
		checkComp();

		// 比較チェックボックスクリック
		$('a', '#search_result').click(saveSelectState);
		$('#search_result input[type="checkbox"][name="comp"]').click(function() {
			setCheckState($(this));
		});

		// 検索モード設定：リストボックス使用
		cfMode = '0';
		lastSend = '';
		$("#SearchString").val("");

	}

	// 検索結果一覧をAjaxで取得する
	function getSearchResult() {
		var requestStr = "SearchServlet.page?" + makeRequestStr();
		window.location.href = requestStr;
	}

	function makeRequestStr() {
		var params = getUrlParams();
		var str = "menu=" + params["menu"] ;
		var radio = "";
		var bType = $('form[name="search"] input[name="B"]').prop('type');
		if (bType == 'radio') {
			radio = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			radio = $('form[name="search"] input[name="B"]').val();
		}

		if (typeof bType === "undefined") {
			str = str + "&kisyu=" + encodeURIComponent(kisyu) + "&page="
			+ encodeURIComponent(currentPage);
		}
		else {
			str = str + "&kisyu=" + encodeURIComponent(kisyu) + "&page="
					+ encodeURIComponent(currentPage)
					+ "&search=B"
					+ "&word=" + encodeURIComponent(radio);
		}

		$('form[name="search"] input[name^="K-"]:checked').each(
			function() {
				str = str + "&" + $(this).prop("name") + "="
						+ encodeURIComponent($(this).val());
			}
		);

		$('form[name="search"] input[name^="TGKK"]:checked').each(
				function() {
					str = str + "&" + $(this).prop("name") + "="
							+ encodeURIComponent($(this).val());
				}
			);

		$('form[name="search"] input[name="HBJK"]:checked').each(
			function() {
				str = str + "&" + $(this).prop("name") + "="
						+ encodeURIComponent($(this).val());
			}
		);

		// 形名指定表示後または製品カテゴリ変更後は、search,wordを無視する
		if (ptnL == '1' || categoryChangeFlg == true) {
			chkSearch = "";
			chkWord = "";
		}

		// 並び替えキー・並び替え順
		if (sortKey != undefined && sortKey != '' && sortKey != '指定なし') {
			str = str + "&sortKey=" + encodeURIComponent(sortKey);
			if (sortOrder != '') {
				str = str + "&sortOrder=" + encodeURIComponent(sortOrder);
			}
		}

		if (array_key_exists("preview", params)) {
			str = str + "&preview=" + params["preview"];
		}

		if (array_key_exists("category", params)) {
			str = str + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			str = str + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			str = str + "&lang=" + params["lang"];
		}

		return str;
	}

	// 形名検索(URL)
	function checkFormSearchParm(fn) {
		$("#SearchString").val(fn);
		checkFormSearch();
	}

	// 形名検索
	function checkFormSearch() {
		val1 = $("#SearchString").val();
		if (val1 == "") {
			$('#search_result').children().remove();
			$("#search_con_hit_count").html("<span>&nbsp</span>");
			$("#search_con_hit_count_form").html('<span>&nbsp</span>');
			$("#search_result").append("<p>1文字以上入力して検索してください。</p>");
			lastSend = '';
			return;
		}

		if (lastSend != val1) {
			clearCondition("2");

			compForm.length = 0;
			formSearch(val1);
		}
	}

	// 形名検索表示設定
	function formSearch(val1) {
		if (val1 != "" && typeof val1 !== 'undefined' ) {
			list = getFormSearchResult(val1);
		}
	}

	function checkFormSearchJump() {
		formSearch(lastSend);
	}

	function makeSelectSaveString() {
		var ret = new Array;
		ret.push('kisyu=');
		ret.push(encodeURIComponent(kisyu));
		ret.push(' lang=');
		ret.push(encodeURIComponent(lang));
		ret.push(' search=');
		ret.push(encodeURIComponent(search));
		ret.push(' word=');
		ret.push(encodeURIComponent(word));
		ret.push(' cf=');
		ret.push(encodeURIComponent(cfMode));
		ret.push(' count=');
		ret.push(encodeURIComponent(currentPage));
		if (cfMode == 1 && lastSend != '') {
			ret.push(' L=');
			ret.push(encodeURIComponent(lastSend));
		} else if (cfMode == 2) {
			ret.push(' N=');
			ret.push(encodeURIComponent('1'));
		} else {
			ret.push(' L=');
			ret.push(encodeURIComponent($('#SearchString').val()));
		}
		var radio = '';
		var bType = $('form[name="search"] input[name="B"]').prop('type');
		if (bType == 'radio') {
			radio = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			radio = $('form[name="search"] input[name="B"]').val();
		}
		ret.push(' B=');
		ret.push(encodeURIComponent(radio));

		var condition = new Array;
		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			var name = $(this).prop('name');
			if (condition[name] == undefined) {
				condition[name] = encodeURIComponent($(this).prop('value'));
			} else {
				condition[name] += ' ' + encodeURIComponent($(this).prop('value'));
			}
		});
		$('form[name="search"] input[name^="TGKK"]:checked').each(function() {
			var name = $(this).prop('name');
			if (condition[name] == undefined) {
				condition[name] = encodeURIComponent($(this).prop('value'));
			} else {
				condition[name] += ' ' + encodeURIComponent($(this).prop('value'));
			}
		});
		$('form[name="search"] input[name^="HBJK"]:checked').each(function() {
			var name = $(this).prop('name');
			if (condition[name] == undefined) {
				condition[name] = encodeURIComponent($(this).prop('value'));
			} else {
				condition[name] += ' ' + encodeURIComponent($(this).prop('value'));
			}
		});
		for (cond in condition) {
			ret.push(' ' + cond + '=');
			ret.push(encodeURIComponent(condition[cond]));
		}

		var check = new Array;
		for ( var i = 0; i < compForm.length; i++) {
			if (i > 0) {
				check.push(' ');
			}
			check.push(encodeURIComponent(compForm[i]));
		}
		ret.push(" C=");
		ret.push(encodeURIComponent(check.join("")));

		if (sortKey != undefined && sortKey != '指定なし') {
			ret.push(' sortKey=' + encodeURIComponent(sortKey));
			if (sortOrder != undefined) {
				ret.push(' sortOrder=' + encodeURIComponent(sortOrder));
			}
		}

		return ret.join("");
	}

	function saveSelectState() {
		var path = location.pathname;
		var SEP = "__SEP__";
		var params = document.location.search.substring(1).split("&");
		var cookieValue = new Array;
		if (params.length) {
			for ( var i = 0; i < params.length; i++) {
				var valp =params[i].split("=");
				if (valp[0]=="word") {
					cookieValue.push('word=' +encodeURI($('form[name="search"] input[name="B"]:checked').val()));
				}else{
				cookieValue.push(params[i]);
				}

				if (i < params.length - 1) {
					cookieValue.push(SEP);
				}
			}
		} else {
			cookieValue.push(document.location.search.substring(1));
		}
		document.cookie = "fa_search_url=" + encodeURIComponent(path + "##" + cookieValue.join("")) + "; path=/fa/products/faspec; Secure";
		var save = makeSelectSaveString();
		document.cookie = 'fa_stand_select=' + encodeURIComponent(save) + "; Secure";
	}

	function saveSelectStateBack() {
		var save = makeSelectSaveString();

		$('input[name=state_save]').val(save);
	}

	// URLのクエリを取得する
	function getUrlParams() {
		var result = new Object();
		var temp_params = window.location.search.substring(1).split('&');
		for ( var i = 0; i < temp_params.length; i++) {
			var param = temp_params[i].split('=');
			result[param[0]] = param[1];
		}
		return result;
	}

	function getFormSearchResult(str) {
		var result = "";
		var params = getUrlParams();
		var requestStr = "SearchServlet.page?" + "menu=" + params["menu"] + "&kisyu=" + params["kisyu"] + "&page=" + currentPage;

		requestStr = requestStr + "&search=" + params["search"];

		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}

		if (array_key_exists("word", params)) {
			requestStr = requestStr + "&word=" + params["word"];
		}

		if (array_key_exists("category", params)) {
			requestStr = requestStr + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			requestStr = requestStr + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		window.location.href = requestStr;
		return result;
	}

	function initSearch() {
		var param = getParam($(document).prop('location').search);
		lang = "";
		tgkk = "";
		hbjk = "";

		if (array_key_exists('search', param))
			search = param['search'];
		if (array_key_exists('word', param))
			word = param['word'];
		if (array_key_exists('kisyu', param))
			kisyu = param['kisyu'];
		if (array_key_exists('lang', param))
			lang = param['lang'];
		if (array_key_exists('TGKK', param))
			tgkk = param['TGKK'];
		if (array_key_exists('HBJK', param))
			hbjk = param['HBJK'];
		compForm = new Array();

		var resume = false;
		if (resume == false) {
			if ($('form[name="search"] input[name="B"]').prop('type') == "radio" &&
				$('form[name="search"] input[name="B"]:checked').length == 0) {
				// 製品カテゴリの指定がない場合は一番上のものを選択する
				$('form[name="search"] input[name="B"]').eq(0).prop("checked", true);
			}

			// URLパラメータにてK-XXの条件を指定している場合の対象条件クリック処理（初期表示のみ）
			var condType = new Array();
			if(Array.isArray(search)){
				for( i = 0; i < search.length; i++ ){
					val = search[i];
					condType = condType.concat(val.split('@@'));
				}
			} else {
				condType = search.split('@@');
			}
			var condValue = new Array();
			if(Array.isArray(word)){
				for( i = 0; i < word.length; i++ ){
					val = word[i];
					condValue = condValue.concat(val.split('@@'));
				}
			} else {
				condValue = word.split('@@');
			}
			if(Array.isArray(tgkk)){
				for( i = 0; i < tgkk.length; i++ ){
					val = tgkk[i];
					// condType と condValueに追加する
					let tgkkArr = val.split('@@');
					for( j = 0; j < tgkkArr.length; j++ ){
						tgkkVal = tgkkArr[j];
						condType.push("TGKK");
						condValue.push(tgkkVal);
					}
				}
			} else {
				// condType と condValueに追加する
				let tgkkArr = tgkk.split('@@');
				for( i = 0; i < tgkkArr.length; i++ ){
					tgkkVal = tgkkArr[i];
					condType.push("TGKK");
					condValue.push(tgkkVal);
				}
			}

			if(Array.isArray(hbjk)){
				for( i = 0; i < hbjk.length; i++ ){
					val = hbjk[i];
					// condType と condValueに追加する
					let hbjkArr = val.split('@@');
					for( j = 0; j < hbjkArr.length; j++ ){
						hbjkVal = hbjkArr[j];
						condType.push("HBJK");
						condValue.push(hbjkVal);
					}
				}
			} else {
				// condType と condValueに追加する
				let hbjkArr = hbjk.split('@@');
				for( i = 0; i < hbjkArr.length; i++ ){
					hbjkVal = hbjkArr[i];
					condType.push("HBJK");
					condValue.push(hbjkVal);
				}
			}

			var arrayCondIdx = new Array();
			var iCount = 0;
			var tmpCnt = 0;

			for (var i = 0; i < condType.length; i++) {
				if (condType[i].match(/K-[0-9][0-9]/) || condType[i].match(/TGKK/) || condType[i].match(/HBJK/) ) {
					kCondIdx = i;
					arrayCondIdx[iCount] = i;
					iCount++;
				}
			}

			// #3395 対応　パラメータ「K-XX」を指定している場合の対象条件クリック処理(condType,condValueに追加）
			for (key in param) {
				if (key.match(/K-[0-9][0-9]/)) {
					if(condType.indexOf(key) < 0){
						// 追加する
						if(Array.isArray(param[key])){	// 同一パラメータ複数選択時
							let arr = param[key];
							for( i = 0; i < arr.length; i++ ){
								val = arr[i];
								condType.push(key);
								condValue.push(val);
								arrayCondIdx[iCount] = condType.length -1;	// 追加なのでインデックスは最後
								iCount++;
							}
						} else {
							condType.push(key);
							condValue.push(param[key]);
							arrayCondIdx[iCount] = condType.length -1;	// 追加なのでインデックスは最後
							iCount++;
						}
					}
				}
			}

			if (arrayCondIdx.length > 0) {

				for (var i = 0 ; i < arrayCondIdx.length ; i++) {

					// 左メニューの条件選択
					$('form[name="search"] .product_table_filter').each(function() {
						// クリック対象の条件かどうか
						var condition = $(this).find('.product_table_filter_switch').prop('name');
						if (condition != condType[arrayCondIdx[i]]) {
							// 対象のK-XXでない場合は次の条件へ
							return true;
						}

						// [すべて表示]をクリック
						$(this).find('.product_table_filter_trigger.open').trigger('click');

						$($(this).find('.product_table_filter_switch')).each(function(){
							if (this.value == condValue[arrayCondIdx[i]]) {
								if (!$(this).prop('checked')) {
									this.click();
								}
								return false;
							}
						});

						// [閉じる]をクリック
						$(this).find('.product_table_filter_trigger.close').trigger('click');
					});

				}
			}
		}

		makeNewMem();

		if (refreshFlg) {
			if (cfMode == '0') {
				searchSpec();
			} else if (cfMode == '1') {
				checkFormSearchJump();
			} else {
				checkNewInfoSearchJump();
			}
		}
		
		// [製品カテゴリ]変更時イベント
		$('form[name="search"] input[name="B"]').change(function() {
			$("#SearchString").val("");
			$("p.filter_data_content_label").text($('form[name="search"] input[name="B"]:checked').val());
			lastSend = '';
			search = 'B';
			word = $('form[name="search"] input[name="B"]:checked').val();
			sortKey = '';
			sortOrder = '';
			categoryChangeFlg = true; // カテゴリを変更
			reloadCondition("0");
		});

		$('form[name="search"]').submit(function() {
			return false;
		});

		$("#SearchString").keypress(
				function(ev) {
					if ((ev.which && ev.which === 13)
							|| (ev.keyCode && ev.keyCode === 13)) {
						currentPage = 1;
						checkFormSearch();
						return false;
					} else {
						return true;
					}
				});

		$('input[name=state_save]').prop('checked', true);

		setOptionAttr();

		// #3371対応 元に戻す
		saveSelectState();

		document.cookie = 'fa_search_url=; Secure';

	}

	function selectChange() {
		setOptionAttr();

		currentPage = 1;
		compForm.length = 0;
		searchSpec();
	}

	//左メニューの条件の更新
	function setOptionAttr() {
		if (typeof (datas) == 'undefined') {
			return;
		}

		var langWk = lang;
		if (langWk == "") {
			langWk = "1";
		}

		if (!array_key_exists(langWk, datas)) {
			return;
		}

		var langData = datas[langWk];

		var bType = $('form[name="search"] input[name="B"]').prop('type');
		var category = "";
		if (bType == 'radio') {
			category = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			category = $('form[name="search"] input[name="B"]').val();
		}

		if (!array_key_exists(category, langData)) {
			return;
		}

		var selData = langData[category];
		var selectArr = [];
		var selectArrStr = [];
		var cond = [];
		var checkAllCnt = 0;
		var checkCnt = 0;


		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			checkAllCnt++;
		});

		// 検索条件押下
		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			var name = $(this).prop('name');
			selectArrStr[name] += "," + $(this).val();

			// チェック数カウント
			checkCnt++;

			if (checkAllCnt > 0 && checkAllCnt === checkCnt) {
				for (var i in selectArrStr) {
					selectArr[i] = selectArrStr[i].replace("undefined,", "");
				}

				for (var i in selectArr) {
					selectArr[i] = selectArr[i].split(",");
				}

				cond = getSettingList(selData, selectArr);
			}
		});

		// 対象製品が存在しない且つチェックが入っていない条件項目は非活性にする
		$('form[name="search"] input[name^="K-"]').each(function() {
			var name = $(this).prop('name');
			$(this).removeAttr('disabled');
			var str = "@@" + $(this).val() + "@@";
			var checked = $(this).prop('checked');
			if (!checked) {
				if (name in cond && cond[name].indexOf(str) == -1) {
					$(this).prop('disabled', 'disabled');
				}
			}
		});
	}

	function keywordSelect(obj, keywordArr, select) {
		// 子要素を順番にチェックし、選択項目以外で一致した場合trueを返す
		var properties = Object.getOwnPropertyNames(obj);
		var keywordCnt = 0;
		var judgeCnt = 0;
		for (var cnt in keywordArr) {
			keywordCnt++;
		}
		// 選択項目の場合は自身の分を減らす
		if (keywordArr[select]) {
			keywordCnt--;
		}
		for (var name in keywordArr) {
			if (name !== select) {
				for (var property in properties) {
					var child = obj[properties[property]];
					for (var selectNum in keywordArr[name]) {
						if (child === keywordArr[name][selectNum] && properties[property] == name) {
							judgeCnt++;
						}
						if (judgeCnt === keywordCnt) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	// 子要素を順番にチェックし、対象の項目名を返す
	function getConditionArray(list, conditionList) {
		var retArray = [];

		for (name in conditionList) {
			var ret = [];
			var sort = [];
			var retStr = "";
			for (var i in list) {
				ret.push(list[i][name]);
			}

			// 空欄を削除
			ret = ret.filter(function(e){return e !== undefined;});

			// 重複を削除
			sort = ret.filter(function (x, i, self) {
				return self.indexOf(x) === i;
			});

			retStr = "@@" + sort.join('@@@@') + "@@";

			if (retStr === "@@@@") {
				retStr = "";
			}

			retArray[name] = retStr;
		}
		return retArray;
	}

	// 項目名を返す
	function getPreList(list) {
		var ret = [];
		var listCnt = 0;

		for (var cnt in list) {
			listCnt++;
		}

		for (var i = 0; i < listCnt; i++) {
			for (var name in list[i]) {
				ret[name] = "";
			}
		}

		return ret;
	}

	function getSettingList(list, searchArr) {
		// 検索条件が選択されている場合
		if (searchArr) {
			var conditionListArray = [];
			var conditionList = [];

			// 空の項目一覧を作成
			preListArray = getPreList(list);

			// キーワード項目の一覧を作成
			conditionListAll = getConditionArray(list, preListArray);

			for (var select in preListArray) {
				var filteredSelectListArray = [];
				list.forEach(function (obj) {
					var isSelectMatch = keywordSelect(obj, searchArr, select);
					if (isSelectMatch) {
						filteredSelectListArray.push(obj);
					}
				});
				conditionListArray[select] = filteredSelectListArray;
			}

			for (var selectName in conditionListArray) {
				var args = Array.prototype.slice.call(conditionListArray[selectName]);
				var len = args.length;
				var retStr = "";

				for(var i = 0; i < len ; i++ ){
					var arg = args[i];
					if (arg.hasOwnProperty(selectName) && retStr.indexOf("@@" + arg[selectName] + "@@") == -1) {
						retStr += "@@" + arg[selectName] + "@@";
					}
				}
				conditionList[selectName] = retStr;
				if (conditionList[selectName] === "" && searchArr[selectName]) {
					conditionList[selectName] = conditionListAll[selectName];
				}
			}

			ret = conditionList;

			return ret;
		} else {
			return list;
		}
	}

	function array_key_exists(key, search) {
		if (!search
				|| (search.constructor !== Array && search.constructor !== Object)) {
			return false;
		}

		return key in search;
	}

	function getLastSelect() {
		var ret = new Array();
		var hash_cookies = getHashCookies();

		if (array_key_exists('fa_stand_select', hash_cookies) == true) {
			var str = decodeURIComponent(hash_cookies['fa_stand_select']);
			var array_select = str.split(" ");
			for ( var i = 0; i < array_select.length; i++) {
				var tmp = array_select[i].split("=");
				ret[tmp[0]] = decodeURIComponent(tmp[1]);
			}
		}

		return ret;
	}

	function getHashCookies() {
		var ret = new Array();
		var full_cookie_data = document.cookie;
		var array_cookies = full_cookie_data.split(";");
		for ( var i = 0; i < array_cookies.length; i++) {
			array_cookies[i] = array_cookies[i].replace(/^ +| +$/, '');
			var tmp = array_cookies[i].split("=");
			ret[tmp[0]] = tmp[1];
		}

		return ret;
	}

	function getLastSelectBack() {
		var ret = new Array();

		var str = $('input[name=state_save]').val();
		var array_select = str.split(" ");
		for ( var i = 0; i < array_select.length; i++) {
			var tmp = array_select[i].split("=");
			ret[tmp[0]] = decodeURIComponent(tmp[1]);
		}

		return ret;
	}

	function setLastSelect(lastSelect) {
		if (array_key_exists('cf', lastSelect)
				&& lastSelect['cf'].match(/^[012]$/) != null) {
			cfMode = lastSelect['cf'];
		}

		if (array_key_exists('count', lastSelect)
				&& lastSelect['count'].match(/^[0-9]+$/)) {
			currentPage = Number(lastSelect['count']);
		}

		if (array_key_exists('L', lastSelect)) {
			$("#SearchString").val(lastSelect['L']);
			if (cfMode == '1') {
				lastSend = lastSelect['L'];
			}
		}
		if (array_key_exists('N', lastSelect)) {
			if (cfMode == '2') {
				lastSend = lastSelect['N'];
			}
		}

		if (array_key_exists('B', lastSelect)
				&& $('form[name="search"] input[name="B"]').prop('type') == 'radio') {
			$('form[name="search"] input[name="B"]').val([ lastSelect['B'] ]);
			var html = "";
			if (html != "") {
				$(sideNavSelector).html(html);
				initProductTableNav();
			}
		}

		// 左メニューの条件選択
		$('form[name="search"] .product_table_filter').each(function() {
			// [すべて表示]をクリック
			$(this).find('.product_table_filter_trigger.open').trigger('click');

			// 条件を選択
			var condition = $(this).find('.product_table_filter_switch').prop('name');
			if (lastSelect[condition] != undefined) {
				var list = lastSelect[condition].split(' ');
				$($(this).find('.product_table_filter_switch')).each(function(){
					for (var i = 0; i < list.length; i++) {
						if (decodeURIComponent(list[i]) == this.value) {
							if (!$(this).prop('checked')) {
								this.click();
							}
							break;
						}
					}
				});
			}

			// [閉じる]をクリック
			$(this).find('.product_table_filter_trigger.close').trigger('click');
		});

		if (array_key_exists('C', lastSelect)) {
			var tmp = lastSelect['C'].split(' ');
			for ( var i = 0; i < tmp.length; i++) {
				if (tmp[i] != "") {
					compForm.push(decodeURIComponent(tmp[i]));
				}
			}
		}

		// 並び替え項目
		if (array_key_exists('sortKey', lastSelect)) {
			sortKey = lastSelect['sortKey'];
			if (array_key_exists('sortOrder', lastSelect)) {
				sortOrder = lastSelect['sortOrder'];
			}
		}
	}

	function getParam(locationSearch) {

		if ((locationSearch != null) && (locationSearch.length > 1)) {
			var query = locationSearch.substring(1);

			var parameters = query.split('&');

			var result = new Array();
			for ( var i = 0; i < parameters.length; i++) {
				var element = parameters[i].split('=');

				var paramName = decodeURIComponent(element[0]);
				var paramValue = decodeURIComponent(element[1]);

				// #3395 パラメータ名同じものは配列にする
				if(paramName in result){
					if(Array.isArray(result[paramName])){
						// 配列に追加
						result[paramName].push(decodeURIComponent(paramValue));
					} else {
						// 配列にする
						let arr = new Array();
						arr.push(result[paramName]);				//既存データ
						arr.push(decodeURIComponent(paramValue));	//追加データ
						result[paramName] = arr;
					}
				} else {
					result[paramName] = decodeURIComponent(paramValue);
				}
			}

			return result;
		}

		return null;
	}

	function checkReferrer() {
		var current = document.location.href.replace(/^https?:\/\/[^\/]*\//, "");
		var referrer;
		if (document.referrer != "") {
			referrer = document.referrer.replace(/^https?:\/\/[^\/]*\//, "");
		} else {
			referrer = referrerCookie.replace(/^https?:\/\/[^\/]*\//, "");
		}

		var temp = current.split('?');
		current = temp[0];

		temp = referrer.split('?');
		referrer = temp[0];

		var file = referrer.substring(referrer.lastIndexOf('/') + 1);
		if (!file.match(/^(detail|point|device|download|compare|search).page$/)) {
			return false;
		}

		return true;
	}

	function reloadCondition(mode) {
		var html = "";
		if (mode == "0") {
			html = getConditionUrlB();
			window.location.href = html;
			// 値をクリア
			html = "";
		} else if (mode == "2") {
			html = getConditionUrlK();
			window.location.href = html;
			// 値をクリア
			html = "";
		}
		if (html != "") {
			initProductTableNav();
			currentPage = 1;
			if (mode == "1") {
				$('#search_result').html('');
			} else if (mode == "2") {
			} else {
				searchSpec();
			}

			makeNewMem();
		}

	}

	function getConditionUrlK() {
		var result = "SearchServlet.page?";
		var params = getUrlParams();

		result = result + "menu=" + params["menu"] + "&kisyu=" + params["kisyu"] + "&search=";

		$('form[name="search"] input[name^="K-"]:checked').each(
			function() {
				result = result + $(this).attr("name") + "&word="
						+ encodeURIComponent($(this).val());
			}
		);

		return result;

	}

	function getConditionUrlB() {
		var result = "SearchServlet.page?";

		var params = getUrlParams();
		var radio = $('form[name="search"] input[name="B"]:checked').val();
		result = result + "menu=" + params["menu"] + "&kisyu=" + params["kisyu"] + "&radio=";
		if (typeof(radio) != "undefined") {
			result += encodeURI(radio);
		}
		result += "&search=" + encodeURI(search) + "&word=" + encodeURI(word);
		if (array_key_exists("preview", params)) {
			result = result + "&preview=" + params["preview"];
		}
		if (array_key_exists("lang", params)) {
			result = result + "&lang=" + params["lang"];
		}

		return result;
	}
	function getConditionHtml() {
		var result = "";
		// create HTTP Object
		var xmlhttp = new XMLHttpRequest();
		var params = getUrlParams();
		var radio = $('form[name="search"] input[name="B"]:checked').val();
		var requestStr = "kisyu=" + params["kisyu"] + "&radio=";
		if (typeof(radio) != "undefined") {
			requestStr += encodeURI(radio);
		}
		requestStr += "&search=" + encodeURI(search) + "&word=" + encodeURI(word);
		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}
		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		return result;
	}

	function clearCondition(mode) {
		if (mode == "2") {
			reloadCondition("2");
		} else {
			if ($('form[name="search"] input[name="B"]')[0]) {
				$('form[name="search"] input[name="B"]').eq(0).prop("checked", true);
				var reloadMode = "1";
				if (mode != "1") {
					$("#SearchString").val("");
					reloadMode = "0";
				}
				reloadCondition(reloadMode);
			} else {
				$('form[name="search"] input[name^="K-"]').each(function() {
					$(this).prop("selectedIndex", "0");
				});
				reloadCondition("0");
			}
		}
	}

	//比較チェックボックスのチェックを全て外す
	function compareProdClear() {
		compForm.length = 0;
		$('#search_result input[type="checkbox"][name="comp"]').prop("checked", false);
		enableCheckButton();
	}

	// 疑似結合表示
	function setListBorder() {
		$(".comb_top").each(function() {
			$(this).css("border-top", "none");
		});

		$('.comb_bottom').each(function() {
			$(this).css("border-bottom", "none");
		});
	}

	function jumpResultPage(param) {
		currentPage = param;

		if (cfMode == '0') {
			searchSpec();
		} else if (cfMode == '1') {
			checkFormSearchJump();
		} else {
			checkNewInfoSearchJump();
		}
		scrollResultTop();
	}

	function dispProductCompare() {
		if (compForm.length > 1) {
			var params = getUrlParams();
			var url = 'compare.page?kisyu=';
			url = url + kisyu;
			for ( var i = 0; i < compForm.length; i++) {
				url = url + '&formNm=' + encodeURIComponent(compForm[i]);
			}
			url = url + '&main=' + encodeURIComponent(compForm[0]);

			if (array_key_exists("preview", params)) {
				url = url + '&preview=' + params['preview'];
			}

			if (array_key_exists("word", params)) {
				url = url + "&word=" + params["word"];
			}

			if (array_key_exists("category", params)) {
				url = url + "&category=" + params["category"];
			}

			if (array_key_exists("id", params)) {
				url = url + "&id=" + params["id"];
			}

			if (array_key_exists("lang", params)) {
				url = url + "&lang=" + params["lang"];
			}

			url = url + "&popup=" + 1;

			return url;
		}
	}

	// 比較表示設定（チェックボックス）
	function checkComp() {
		$('#search_result input[type="checkbox"][name="comp"]').each(function() {
			if (searchArrayIndex(compForm, $(this).val()) != -1) {
				$(this).prop('checked', true);
			}
		});
		enableCheckButton();
	}

	// 用途で探すの▼表示
	function checklistBox() {
		if ($('.narrow_condition_list').children().length < 1) {
			$('.narrow_condition').css('background-image', 'none');
		}
	}

	function setCheckState(obj) {
		if (obj.prop('checked')) {
			if (compForm.length >= 10) {
				obj.prop('checked', false);
				return;
			} else if (compForm.length >= 2) {
				$(".spec_select_head_btn").html('<a class="popup" href=' + dispProductCompare() + '>' + specSearchLabels.compareSpec + '</a>');
			} else {
				$(".spec_select_head_btn").html('<span>'+ specSearchLabels.compareSpec + '</span>');
			}
			if (searchArrayIndex(compForm, obj.val()) == -1 && !obj.hasClass('noneCheak')) {
				// チェックボックスのない製品（仕様なし）は比較チェックができないようにする
				compForm.push(obj.val());
			}

		} else {
			var index = searchArrayIndex(compForm, obj.val());
			if (index != -1) {
				compForm.splice(index, 1);
			}
		}
		enableCheckButton();
	}

	function searchArrayIndex(array, search) {
		var ret = -1;
		if (Array.prototype.indexOf) {
			ret = array.indexOf(search);
		} else {
			for ( var i = 0; i < array.length; i++) {
				if (array[i] == search) {
					ret = i;
					break;
				}
			}
		}
		return ret;
	}

	// [仕様比較]ボタンの活性化
	function enableCheckButton() {
		if (compForm.length < 2) {
			$(".spec_select_head_btn").html('<span>'+ specSearchLabels.compareSpec + '</span>');
		} else {
			$(".spec_select_head_btn").html('<a class="popup" href=' + dispProductCompare() + '>' + specSearchLabels.compareSpec + '</a>');
		}
	}

	function checkSelectResume(lastSelect) {
		var lastLang = "";
		if (array_key_exists('lang', lastSelect)) {
			lastLang = lastSelect['lang'];
		}
		if (lastLang == "") {
			lastLang = "1";
		}

		var paramLang = lang;
		if (paramLang == "") {
			paramLang = "1";
		}

		if (array_key_exists('kisyu', lastSelect) && lastSelect['kisyu'] == kisyu
				&& lastLang == paramLang && array_key_exists('search', lastSelect)
				&& lastSelect['search'] == search
				&& array_key_exists('word', lastSelect)
				&& lastSelect['word'] == word) {
			return true;
		}
		return false;
	}

	function getSelectArray(name) {
		var ret = new Array();
		$('form[name="search"] input[name=' + name + ']:checked').each(
				function() {
					ret.push($(this).prop("index"));
				});
		return ret;
	}

	function makeNewMem() {
		selMem = new Array();
		$('form[name="search"] input[name^="K-"]').each(function() {
			selMem[$(this).prop("name")] = getSelectArray($(this).prop("name"));
		});
	}

	function checkSelectChange(name) {
		var ret = false;
		if (array_key_exists(name, selMem)) {
			// 一時保存領域とセレクトボックス状態比較
			var last = selMem[name];
			var current = getSelectArray(name);
			if (last.length == current.length) {
				for ( var i = 0; i < last.length; i++) {
					if (searchArrayIndex(current, last[i]) == -1) {
						ret = true;
						break;
					}
				}
			} else {
				ret = true;
			}
			if (ret == true) {
				selMem[name] = current;
			}
			last = null;
			current = null;
		} else {
			ret = true;
			selMem[name] = getSelectArray(name);
		}

		return ret;
	}

	function scrollResultTop() {
		var p = $("#search_result").offset().top;
		$(window).scrollTop(p);
	}

	// 新着検索
	function checkNewInfoSearch() {
		list = getNewInfoSearchResult();
	}

	// 新着情報取得
	function getNewInfoSearchResult() {
		var result = "";
		var params = getUrlParams();
		var requestStr = "SearchServlet.page?" + "menu=" + params["menu"] + "&kisyu=" + params["kisyu"] + "&page=" + currentPage;

		requestStr = requestStr + "&N=1";

		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}

		if (array_key_exists("word", params)) {
			requestStr = requestStr + "&word=" + params["word"];
		}

		if (array_key_exists("category", params)) {
			requestStr = requestStr + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			requestStr = requestStr + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		// ajax は一旦コメントアウトし、画面を再描画する
		window.location.href = requestStr;

		return result;
	}

	// 詳細からの戻り
	function checkNewInfoSearchJump() {
		checkNewInfoSearch();
	}

	function compare(kisyu, formNm) {
		// about:blankとしてOpen
		var target = 'ATMARK';
		window.open("", target, "width=825,height=500,resizable=yes,location=no,scrollbars=yes");

		// formを生成
		var form = document.createElement("form");
		form.action = '../faspec/compare.page';
		form.target = target;
		form.method = 'post';

		// input-hidden生成と設定
		var qs = [{type:'hidden',name:'formNm',value:formNm},{type:'hidden',name:'kisyu',value:kisyu},{type:'hidden',name:'popup',value:'1'},{type:'hidden',name:'typename',value:'1'}];
		for(var i = 0; i < qs.length; i++) {
			var ol = qs[i];
			var input = document.createElement("input");
			for(var p in ol) {
				input.setAttribute(p, ol[p]);
			}
			form.appendChild(input);
		}

		// formをbodyに追加して、サブミットする。その後、formを削除
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(form);
		form.submit();
		body.removeChild(form);
	}

	//***************************************************************************
	//*********************************** 追加 ***********************************
	//***************************************************************************
	var search = '';
	var word = '';
	var kisyu = '';
	var cfMode = '0';
	var lastSend = '';
	var currentPage = 1;
	var compForm;

	var timer = null;
	var scrollObj = null;

	var referrerCookie = "";

	function initScrollCtl() {
		$(".data_table").each(function () {
			var divId = $(this).attr('id');
			if (divId == null) {
				return;
			}
			var tableNo = divId.substring(divId.indexOf('_'));
			var floatId = '#fs' + tableNo;
			var scrollWidth = '128';
			var scrollWidthMax = '1280';

			// スクロール対象の横幅が表示領域より大きいか判定
			if (isDispScrollBar('#' + divId)) {
				viewFloatScroll('#h' + tableNo);
				scrollButtonEnable(tableNo);
			}

			// 手動でスクロールさせた場合のコントロール表示制御
			scrollObj = $("#d" + tableNo);
			scrollObj.on('scroll', function () {
				scrollButtonEnable(tableNo);
			});

			// コントロール内ボタンのイベント登録
			$(floatId + ' .scroll_prev a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '-=' + scrollWidth
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_next a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '+=' + scrollWidth
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_first a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '0'
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_last a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: scrollWidthMax
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});

			// ウィンドウリサイズ時に横スクロールバー表示制御
			$(window).on('resize.scrollControl', function() {
				resizeWindow();

				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});

			// ページスクロール時にコントロール要素の表示制御
			$(window).on('scroll.scrollControl', function() {				
				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});
	}

	function scrollButtonEnable(tableNo) {
		var leftPos = $("#d" + tableNo).scrollLeft();
		var divWidth = $("#d" + tableNo).width();
		var leftPosEnd = Math.floor($("#d" + tableNo).children("table").width() - divWidth);

		if (leftPos > 0) {
			$("#fs" + tableNo + " ul li.scroll_prev a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_prev a.on_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
					"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_prev a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_prev a.on_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
					"none");
		}

		if (leftPos < leftPosEnd) {
			$("#fs" + tableNo + " ul li.scroll_next a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_next a.on_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_last a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_last a.on_button").css("display",
					"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_next a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_next a.on_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_last a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_last a.on_button").css("display",
					"none");
		}
	}

	function hideFloatScroll(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		$(floatId).css("display", "none");
	}

	//ウィンドウリサイズ対策
	function resizeWindow() {
		var timer = false;
		selectUA(3);
		$(window).on('resize', function() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				selectUA(3);
				setTimeout(function() {
					timer = false;
				}, 0);
			}, 200);
		});
	}

	function selectUA(size) {
		var ary1 = [];
		var ary2 = [];
		$('.table1').each(function(i) {
			ary1.push($(this).attr('id'));
		});
		$('.table2').each(function(i) {
			ary2.push($(this).attr('id'));
		});
		$.each(ary1, function(i) {
			makeRowHeight('#' + ary2[i], '#' + ary1[i], size);
		});
	}

	function isDispScrollBar(objId, key) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var divWidth = parseInt($(objId).css('width'));
		var tblWidth = parseInt($('#t2' + tableNo).css('width'));
		if ((tblWidth-divWidth) > 1) {
			return true;
		} else {
			return false;
		}
	}

	function viewFloatScroll(objId) {
		//データ無しの場合は、処理を抜ける
		if ($('.data_table').length==0) {
			return;
		}

		$(objId).parent().css("position", "relative");
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		var dataId = '#d' + tableNo;
		var offset = $(dataId).offset();
		var offsetTop = document.getElementById('d' + tableNo).offsetTop;
		var offsetParentTop = document.getElementById('d' + tableNo).offsetParent.offsetTop;
		var width = $(dataId).outerWidth();
		var height = $(objId).height();
		var dspPos = $(window).scrollTop();
		var winHeight = $(window).height();
		var setTop = offset.top + 100;
		// var setLeft = offset.left+width;
		var setLeft = $(dataId).offset().left;

		if (dspPos < offsetTop + offsetParentTop + height) {
			// if(dspPos + winHeight < offset.top + height + 25){
			/* 下に表示 */
			// setTop= winHeight-$('#floatscroll').height();
			/* 上に表示 */
			var position = "";
			if ((offsetTop + offsetParentTop) > (dspPos + $(floatId).height())) {
				// setTop = offset.top - dspPos - $(floatId).height();
				position = "absolute";
				setTop = offsetTop - $(floatId).outerHeight()
						+ parseInt($(floatId).css("border-bottom-width"));
				setLeft = $(objId).outerWidth() - 1;
			} else {
				setTop = 0;
				position = "fixed";
			}

			$(floatId).css("position", position);
			$(floatId).css("top", setTop);
			$(floatId).css("left", setLeft);
			$(floatId).outerWidth(width);
			$(floatId).css("display", "inline");
			$(floatId + " .scrolllink").css("margin", 0);
		} else {
			$(floatId).css("display", "none");
			;
		}
	}

	function makeRowHeight(objId1, objId2, msize) {
		var tr1 = $(objId1 + " tr");// 全行を取得
		var tr2 = $(objId2 + " tr");// 全行を取得
		var rspn = "rowspan";

		for ( var i = 0, l = tr1.length; i < l; i++) {
			var cells1 = tr1.eq(i).children();// 1行目から順にth、td問わず列を取得
			var cells2 = tr2.eq(i).children();// 1行目から順にth、td問わず列を取得

			if (msize > 0) {
				for ( var j = 0, m = cells1.length; j < m; j++) {
					if (cells1.eq(j).attr(rspn) == null || cells1.eq(j).attr(rspn) == "1") {
						cells1.eq(j).get(0).style.height = "auto";
					}
				}
				for ( var j = 0, m = cells2.length; j < m; j++) {
					if (cells2.eq(j).attr(rspn) == null || cells2.eq(j).attr(rspn) == "1") {
						cells2.eq(j).get(0).style.height = "auto";
					}
				}
			}

			var hmax1 = 0;
			for ( var j = 0, m = cells1.length; j < m; j++) {
				var nowh = 0;
				if (cells1.eq(j).attr(rspn) == null || cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height();//i行目j列の文字列を取得
				}
				if (hmax1 < nowh) {
					hmax1 = nowh;
				}
			}
			var hmax2 = 0;
			for ( var j = 0, m = cells2.length; j < m; j++) {
				var nowh = 0;
				if (cells2.eq(j).attr(rspn) == null	|| cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height();//i行目j列の文字列を取得
				}
				if (hmax2 < nowh) {
					hmax2 = nowh;
				}
			}

			var maxHeight = hmax1;
			if (hmax1 < hmax2) {
				maxHeight = hmax2;
			}
			maxHeight = Math.ceil(maxHeight);

			for ( var j = 0, m = cells1.length; j < m; j++) {
				if (cells1.eq(j).attr(rspn) == null	|| cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height(maxHeight);
				}
			}
			for ( var j = 0, m = cells2.length; j < m; j++) {
				if (cells2.eq(j).attr(rspn) == null || cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height(maxHeight);
				}
			}
		}
		dummyReplace();
	}

	//dummy表示文字列置換処理
	function dummyReplace() {
		// 要素内の文字列をnbsp
		$('td').each(function() {
			var txt = $(this).html();
			$(this).html(txt.replace(/!DUMMY!/g, '&nbsp;'));
		});
	}

	function loadScriptTooltip() {
		productTooltip();
	}

	/**
	 * product用ツールチップの設定
	 */
	function productTooltip() {
		var $body = $('body');
		var $tooltipArea = $('[data-js-product-tooltip]');
		var tooltipControlSelector = '[data-js-product-tooltip-control]';
		var $tooltipControlArea = $(tooltipControlSelector);
		var posTLclassName = 'is-lt';
		var posTCclassName = 'is-ct';
		var posTRclassName = 'is-rt';
		var posBLclassName = 'is-lb';
		var posBCclassName = 'is-cb';
		var posBRclassName = 'is-rb';
		var arrowMargin = 10;

		//-------------------------------------------------
		// Constructor
		//-------------------------------------------------
		(function() {
			if ($tooltipArea.length > 0) {
				_init();
			}
		})();

		//-------------------------------------------------
		// Private Methods
		//-------------------------------------------------
		/**
		 * _init()：初期化
		 * @private
		 */
		function _init() {
			var $tooltipTrigger = $tooltipArea.find('.melfa_tooltip_trigger');

			// 固定列は吹き出しの位置を固定
			$tooltipTrigger.each(function() {
				var $targetTrigger = $(this);
				var isContolArea =
					$targetTrigger.closest(tooltipControlSelector).length > 0
						? true
						: false;

				if (!isContolArea) {
					$targetTrigger.addClass(posTCclassName);
				}
			});

			// 動的生成エリアのためイベントdelegate
			// '[data-js-product-tooltip-control]'エリア内はツールチップの位置を調整
			$body.delegate('.melfa_tooltip_trigger', 'mouseover', function(e) {
				var $targetTrigger = $(e.currentTarget);
				var $targetWrapper = $targetTrigger.closest('.melfa_tooltip');
				var $targetContent = $targetWrapper.find('.melfa_tooltip_contents');
				var isContolArea =
					$targetTrigger.closest(tooltipControlSelector).length > 0
						? true
						: false;

				$targetContent.css('display','block');
				if (isContolArea) {
					_setPos($targetTrigger, $targetContent);
				}
			});

			$body.delegate('.melfa_tooltip_trigger', 'mouseout', function(e) {
				var $targetTrigger = $(e.currentTarget);
				var $targetWrapper = $targetTrigger.closest('.melfa_tooltip');
				var $targetContent = $targetWrapper.find('.melfa_tooltip_contents');

				$targetContent.css('display','none');
			});
		}

		/**
		 * _setPos()：ポジション調整
		 * @param {object} $targetTrigger 対象のトリガー
		 * @param {object} $targetContent 対象のコンテンツ
		 * @private
		 */
		function _setPos($targetTrigger, $targetContent) {
			var $tooltipArea = $('[data-js-product-tooltip]');
			var tooltipControlSelector = '[data-js-product-tooltip-control]';
			var $tooltipControlArea = $(tooltipControlSelector);

			var triggerWidth = $targetTrigger.outerWidth();
			var contentWidth = $targetContent.outerWidth();
			var contentHeight = $targetContent.outerHeight() + arrowMargin;

			var tooltipAreaBounds = $tooltipControlArea.get(0).getBoundingClientRect();
			var tooltipAreaTop = tooltipAreaBounds.top;
			var tooltipAreaLeft = tooltipAreaBounds.left;
			var tooltipAreaRight = tooltipAreaBounds.right;

			var triggerBounds = $targetTrigger.get(0).getBoundingClientRect();
			var triggerTop = triggerBounds.top;
			var triggerCenter = triggerBounds.left + Math.floor(triggerWidth / 2);

			var triggerClassTxt =
				posTLclassName +
				' ' +
				posTCclassName +
				' ' +
				posTRclassName +
				' ' +
				posBLclassName +
				' ' +
				posBCclassName +
				' ' +
				posBRclassName;

			$targetTrigger.removeClass(triggerClassTxt);

			var isTopPos = tooltipAreaTop > triggerTop - contentHeight ? false : true;

			// 右にはみ出る
			if (tooltipAreaRight < triggerCenter + contentWidth / 2) {
				if (isTopPos) {
					$targetTrigger.addClass(posTRclassName);
				} else {
					$targetTrigger.addClass(posBRclassName);
				}
				// 左にはみ出る
			} else if (tooltipAreaLeft > triggerCenter - contentWidth / 2) {
				if (isTopPos) {
					$targetTrigger.addClass(posTLclassName);
				} else {
					$targetTrigger.addClass(posBLclassName);
				}
				// センター
			} else {
				if (isTopPos) {
					$targetTrigger.addClass(posTCclassName);
				} else {
					$targetTrigger.addClass(posBCclassName);
				}
			}
		}
	}

	(function($) {
		'use strict';

		const $document = $(document);

		// ページ読み込み時に表組み高さ調整、横スクロールバー表示制御
		// jQuery3系では、document.ready内でのloadイベントが動作しない場合があるため、外部に分離
		$(window).on('load.scrollControl', function() {
			resizeWindow();

			$(".data_table").each(function () {
				var divId = $(this).attr('id');
				if (divId == null) {
					return;
				}
				var tableNo = divId.substring(divId.indexOf('_'));

				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});

		//===================================== document ready
		$(function() {
			// referrer cookie操作
			var hash_cookies = getHashCookies();

			if (array_key_exists('fa_search_url', hash_cookies) == true
					&& hash_cookies['fa_search_url'] != undefined) {
				referrerCookie = decodeURIComponent(hash_cookies['fa_search_url']);
			}

			// ページトップ
			$(".pagetop a").click(function() {
				window.scrollTo(0, 0);
				return false;
			});

			// 別画面でpopup
			$('#search_result').on('click', '.spec_select_head_btn', function(e) {
				e.preventDefault();
		
				const $clickBtn = $(e.target);
				if($clickBtn.attr('href')) {
					window.open($clickBtn.attr('href'), '', 'width=825,height=500,resizable=yes,location=no,scrollbars=yes');
				}
			});

			// パンくずナビ生成（旧ヘッダーから要素抽出）
			const $breadcrumb = $('.c-breadcrumb');
			const $breadcrumbList = $breadcrumb.find('.c-breadcrumb__list');
			const $breadcrumbBefore = $('.c-breadcrumb--before');
			if($breadcrumbBefore.length > 0) {
				const $searchPankuzuListItems = $breadcrumbBefore.find('#search_pankuzu li');
				const kisyuTopObject = {
					'name': $searchPankuzuListItems.eq(2).text()//,
					//'link': $searchPankuzuListItems.eq(2).find('a').attr('href')
				}
				const $breadcrumbListHTML = `
					<li class="c-breadcrumb__list-item"><a href="/fa/">${productsLabels.top}</a></li>
					<li class="c-breadcrumb__list-item"><a href="/fa/products/index.html">${productsLabels.products}</a></li>
					<li class="c-breadcrumb__list-item"><span>${kisyuTopObject.name}</span></li>
					<li class="c-breadcrumb__list-item"><span>${productsLabels.standard}</span></li>
				`;
				$breadcrumbList.html($breadcrumbListHTML);
				$breadcrumbBefore.remove();
			}

			//アコーディオン初期設定
			const $accordionWrapper = $('.js_accordion_wrapper');
			const $accordionTrigger = $accordionWrapper.find('.js_accordion_trigger');
			const $accordionContents = $accordionWrapper.find('.js_accordion_content');
			const accordionOutClickOnClass = 'js_accordion_outclick_on';

			if ($accordionTrigger.length > 0 && $.isFunction($.fn.customAccordion)) {
				$accordionTrigger.customAccordion({
					toggleContent: function() {
						return $(this).closest('.js_accordion_wrapper').find('.js_accordion_content');
					},
					duration: 'fast',
					easing: 'linear',
					triggerClass: {
						opened: 'opened',
						closed: 'closed'
					},
					endInit: function(options) {
						var $this = $(this);
						var $thisWrapper = $this.closest('.js_accordion_wrapper');
						var $thisContent = $thisWrapper.find('.js_accordion_content');
						var $thisCloseTrigger = $thisWrapper.find('.js_accordion_close');

						if ($this.hasClass(accordionOutClickOnClass)){
							//アコーディオンエリア内、及びトリガー押下では閉じないようにする
							$this.mousedown(function (e) {
								e.stopPropagation();
							});
							$thisContent.mousedown(function (e) {
								e.stopPropagation();
							});
						}

						if ($thisCloseTrigger.length > 0) {
							//閉じるボタン
							$thisCloseTrigger.click(function (e) {
								accrodionClose($thisContent);
							});
						}
					},
					beforeOpen: function(options) {
						$(this).closest('.js_accordion_wrapper').addClass('opened');
					},
					endOpen: function(options) {
						//トリガーに'js_accordion_outclick_on'クラスが付与されている場合は
						//ドキュメントクリックによる閉じる機能を有効にする
						if ($(this).hasClass(accordionOutClickOnClass)){
							$document.mousedown(function (e) {
								accrodionClose($accordionContents);
							});
						}
					},
					beforeClose: function(options) {
						$(this).closest('.js_accordion_wrapper').removeClass('opened');
						$document.unbind('mousedown', accrodionClose);
					}
				});
			}

			/**
			 * アコーディオンを閉じる
			 */
			function accrodionClose($targetContents) {
				$targetContents.customAccordionManual('close', {
					beforeClose: function(options) {
						$accordionTrigger.closest('.js_accordion_wrapper').removeClass('opened');
						$accordionTrigger.removeClass('opened');
					}
				});
			}
			
			//左ナビ初期化
			initProductTableNav();
			initSearch();
			
			initScrollCtl();
			loadScriptTooltip();
			
			// 初期表示時後の動作のためtrueにする
			refreshFlg = true;
		});

	})(window.jQuery3_6 || jQuery);

} else {
	// console.log('現行システム');

	//===================================== init var
	var $body = $('body');

	var sideNavSelector = 'div.l-grid__item:has(.product_table_nav)'; //左ナビ全体
	var tableFilterSelector = 'div.product_table_filter'; //フィルター全体のブロック要素
	var itemWrapperSelector = 'div.product_table_filter_item_wrapper'; //選択エリア
	var itemInputSelector = 'input.product_table_filter_switch'; //選択エリアのinput要素
	var itemInputTextSelector = 'span.product_table_filter_text'; //選択エリアのinput要素のテキスト
	var selectedSelector = 'div.product_table_filter_selected'; //選択済みエリア
	var triggerSelector = 'div.product_table_filter_trigger'; //開閉トリガ
	var triggerLabelSelector = 'a.product_table_filter_trigger_label'; //開閉トリガ内のテキストラベル
	var resetTriggerSelector = 'p.product_table_filter_reset'; //リセットボタン

	var filterHasChildClass = 'has_child';
	var itemBlockParentClass = 'parent';
	var itemBlockChildClass = 'child';
	var itemWrapperDefaultClass = 'default';
	var itemWrapperOpenedClass = 'opened';
	var selectedOpendClass = 'opened';
	var selectedItemClassHeadName = 'selected_item_';
	var triggerOpenedClass = 'close';
	var triggerClosedClass = 'open';
	var triggerOpenedLabelText = '閉じる';
	var triggerDefaltLabelText = 'すべて表示';
	var triggerSelectedLabelText = '条件変更';

	var currentNavIndex = null;

	var search = '';
	var word = '';
	var kisyu = '';
	var cfMode = '0';
	var lastSend = '';
	var currentPage = 1;
	var compForm;
	var sortKey = ''; // 並び替えキー
	var sortOrder = ''; // 並び替え順
	var refreshFlg = true; // 検索結果一覧を更新するかどうか
	var categoryChangeFlg = false; // カテゴリを変更したかどうか
	var referrerCookie = "";
	var loadCnt = 0; // tooltipのjs呼び出しカウント
	var ptnL = '0'; // 形名指定用特殊文字


	//関数群------------------------------------------------
	/**
	 * [仕様から探す]ページの左ナビ初期化
	 */
	function initProductTableNav() {
		var $productTableNav = $(sideNavSelector).find('div.product_table_nav');
		var $productTableFilterItemBlock = $productTableNav.find('dd.product_table_filter_item_block');

		currentNavIndex = null;

		$productTableFilterItemBlock.each(function (blockIndex) {
			var $targetBlock = $(this);
			var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
			var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
			var $targetItemInput = $targetItemWrapper.find(itemInputSelector);
			var $targetSelected = $targetBlock.find(selectedSelector);
			var $targetSelectedUl = $targetSelected.find('ul');
			var $targetTrigger = $targetBlock.find(triggerSelector);
			var $resetTrigger = $targetBlock.find(resetTriggerSelector).children('a');

			//デフォルトで開いているブロックがあればカレントに設定
			if ($targetItemWrapper.hasClass(itemWrapperOpenedClass) && $targetTrigger.hasClass(triggerOpenedClass)) {
				currentNavIndex = blockIndex;
				$body.bind('mousedown', ItemBlockClose);
			}

			//デフォルトで選択済みエリアが開いていたら
			if ($targetSelected.hasClass(selectedOpendClass)) {
				//選択済みラベルをチェックボックスへ反映
				$targetSelectedUl.find('li').each(function () {
					var $targetLi = $(this);
					var targetInputIndex = $targetLi.prop('class').replace(selectedItemClassHeadName, '');
					$targetItemWrapper.find(itemInputSelector).eq(targetInputIndex).prop('checked', true);
				});
				//選択済み項目の削除イベント初期化
				selectedItemEventInit($targetBlock);
			}

			//開閉トリガのクリックイベント
			$targetTrigger.click(function(e) {
				//他が開いていたら閉じる
				if (currentNavIndex !== blockIndex) ItemBlockClose();

				if (!$targetItemWrapper.hasClass(itemWrapperOpenedClass)) {
					currentNavIndex = blockIndex;
					ItemBlockOpen();
				} else {
					ItemBlockClose();
				}

				e.preventDefault();
				return false;
			});

			//選択エリアのクリックイベント
			$targetItemWrapper.click(function(e) {
				//他が開いていたら閉じる
				if (currentNavIndex !== blockIndex) ItemBlockClose();
				//ターゲットのブロックが閉じていたら開く
				if (!$targetItemWrapper.hasClass(itemWrapperOpenedClass)) {
					currentNavIndex = blockIndex;
					ItemBlockOpen();
				}
			});

			//選択エリア内のクリックイベントでは閉じないようにする
			$targetBlock.bind('mousedown', function(e) {
				e.stopPropagation();
			});

			//チェックボックス、ラジオボタンイベント
			$targetItemInput.each(function (inputIndex) {
				var $targetInput = $(this);

				$targetInput.click(function(e) {
					//ラジオボタンの場合は選択済みエリアをリセット
					if ($targetInput.prop('type') === 'radio') {
						$targetSelectedUl.empty();
					}

					//チェック状態を選択済みエリアに反映
					if($targetInput.prop('checked')) {
						var selectedText = $targetInput.next(itemInputTextSelector).text();
						$targetSelectedUl.append('<li class="' + selectedItemClassHeadName + inputIndex + '">' + selectedText + '<a class="delete" href="#">削除</a></li>');
					} else {
						$targetSelectedUl.find('.' + selectedItemClassHeadName + inputIndex).remove();
					}

					//親分類
					if ($targetBlock.hasClass(itemBlockParentClass)) {
						//チェックが入っている場合
						if ($targetItemInput.filter(':checked').length > 0) {
							//子分類を表示
							if (!$targetTableFilter.hasClass(filterHasChildClass)){
								$targetTableFilter.addClass(filterHasChildClass);
							}
						} else {
							//子分類を非表示
							if ($targetTableFilter.hasClass(filterHasChildClass)){
								$targetTableFilter.removeClass(filterHasChildClass);
							}
						}
					}

					// 画面更新
					if (refreshFlg == true) {
						selectChange();
					}
				});
			});

			//リセットボタン
			$resetTrigger.click(function(e) {
				$targetItemInput.prop("checked", false);
				$targetSelectedUl.find('li').remove();
				//親分類の場合は子を非表示
				if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
					$targetTableFilter.removeClass(filterHasChildClass);
				}
				e.preventDefault();

				// 画面更新
				if (refreshFlg == true) {
					selectChange();
				}

				return false;
			});

		});

		/**
		 * 絞り込みエリアを開く
		 */
		function ItemBlockOpen() {
			if (currentNavIndex !== null) {
				var $targetBlock = $productTableFilterItemBlock.eq(currentNavIndex);
				var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
				var $targetSelected = $targetBlock.find(selectedSelector);
				var $targetTrigger = $targetBlock.find(triggerSelector);
				var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

				//チェックボックスエリアを開く
				$targetItemWrapper.removeClass(itemWrapperDefaultClass).addClass(itemWrapperOpenedClass);
				//選択済みエリアを閉じる
				$targetSelected.removeClass(selectedOpendClass);
				//トリガーを開いた状態に変更
				$targetTriggerLabel.text(triggerOpenedLabelText);
				$targetTrigger.removeClass(triggerClosedClass).addClass(triggerOpenedClass);
				//エリア外クリックで閉じる
				$body.bind('mousedown', ItemBlockClose);
			}

		}

		/**
		 * 絞り込みエリアを閉じる
		 */
		function ItemBlockClose() {
			if (currentNavIndex !== null) {
				var $targetBlock = $productTableFilterItemBlock.eq(currentNavIndex);
				var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
				var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
				var $targetItemInput = $targetItemWrapper.find(itemInputSelector);
				var $targetSelected = $targetBlock.find(selectedSelector);
				var $targetSelectedUl = $targetSelected.find('ul');
				var $targetTrigger = $targetBlock.find(triggerSelector);
				var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

				//チェックボックスエリアを閉じる
				$targetItemWrapper.removeClass(itemWrapperOpenedClass);

				//チェックボックス、又はラジオボタンにチェックが入っている場合
				if ($targetItemInput.filter(':checked').length > 0) {
					//選択済みエリアのリスト要素の並べ替え
					$targetSelectedUl.html(
						$targetSelectedUl.find('li').sort(function(a, b) {
							return parseInt($(a).prop('class').replace(selectedItemClassHeadName, ''), 10) - parseInt($(b).prop('class').replace(selectedItemClassHeadName, ''), 10);
						})
					);

					//選択済み項目の削除イベント初期化
					selectedItemEventInit($targetBlock);

					//選択済みエリアを開く
					$targetSelected.addClass(selectedOpendClass);
					//トリガのラベルを選択済みの状態に変更
					$targetTriggerLabel.text(triggerSelectedLabelText);

				//チェックボックス、又はラジオボタンにチェックが入っていない場合
				} else {
					//チェックボックスエリア・及びトリガをデフォルトの状態にする
					$targetItemWrapper.addClass(itemWrapperDefaultClass);
					$targetTriggerLabel.text(triggerDefaltLabelText);

					//親子関係がある場合は子を非表示
					if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
						$targetTableFilter.removeClass(filterHasChildClass);
					}
				}
				//トリガを閉じた状態に変更
				$targetTrigger.removeClass(triggerOpenedClass).addClass(triggerClosedClass);
				//エリア外クリックイベント解除
				$body.unbind('mousedown', ItemBlockClose);

				currentNavIndex = null;
			}
		}

		/**
		 * 選択済みエリアの削除イベント初期化
		 */
		function selectedItemEventInit($targetBlock) {
			var $targetTableFilter = $targetBlock.closest(tableFilterSelector);
			var $targetItemWrapper = $targetBlock.find(itemWrapperSelector);
			var $targetSelected = $targetBlock.find(selectedSelector);
			var $targetSelectedUl = $targetSelected.find('ul');
			var $targetTrigger = $targetBlock.find(triggerSelector);
			var $targetTriggerLabel = $targetTrigger.find(triggerLabelSelector);

			$targetSelectedUl.find('li').each(function () {
				var $targetLi = $(this);

				$targetLi.find('a').click(function(e) {
					//対象のチェックボックスのチェックを外す
					var targetInputIndex = $targetLi.prop('class').replace(selectedItemClassHeadName, '');
					$targetItemWrapper.find(itemInputSelector).eq(targetInputIndex).prop('checked', false);
					//選択済み項目を削除
					$targetLi.remove();
					//全て削除されたらチェックボックスエリアをデフォルトの状態にする
					if ($targetSelectedUl.find('li').length < 1 ){
						$targetSelected.removeClass(selectedOpendClass);
						$targetItemWrapper.addClass(itemWrapperDefaultClass);
						$targetTriggerLabel.text(triggerDefaltLabelText);

						//親子関係がある場合は子を非表示
						if ($targetBlock.hasClass(itemBlockParentClass) && $targetTableFilter.hasClass(filterHasChildClass)){
							$targetTableFilter.removeClass(filterHasChildClass);
						}
					}
					e.preventDefault();

					// 画面更新
					if (refreshFlg == true) {
						selectChange();
					}

					return false;
				});
			});
		}
	}

	// 検索結果表示
	// クエリから呼び出しを判定し、表示無内容を決定する
	function searchSpec() {
		// クエリ取得
		var prm = getUrlParams();
		var selectSearch = prm["search"];
		var selectWord = prm["word"];

		// クエリ:search=Lかつwordが設定されている場合は、形名検索結果の表示
		if (null != selectSearch && null != selectWord) {
			if ("L" == selectSearch && ptnL == '0') {
				ptnL = '1';
				// 形名検索結果を取得する
				checkFormSearchParm(selectWord);
			} else {
				// 検索結果を取得する
				getSearchResult();
			}
		} else {
			// 検索結果を取得する
			getSearchResult();
		}
	}

	// リストボックス検索表示設定
	function listboxSearch(html) {
		// 検索結果の書き込み
		$('#search_result').html(html);
		// 画面幅がsmallであれば表示文言を変更
		if(MEL_SETTINGS.helper.getMediaMode() === 'small') {
			var $specSelectHeadNote = $('#search_result').find('.spec_select_head_note');
			var tempNoteText = $specSelectHeadNote.eq(0).text();
			$specSelectHeadNote.text(tempNoteText.replace('10', '3'));
		}
		
		checkComp();

		// 比較チェックボックスクリック
		$('a', '#search_result').click(saveSelectState);
		$('#search_result input[type="checkbox"][name="comp"]').click(function() {
			setCheckState($(this));
		});

		// 検索モード設定：リストボックス使用
		cfMode = '0';
		lastSend = '';
		$("#SearchString").val("");
	}

	// 検索結果一覧をAjaxで取得する
	function getSearchResult() {
		var requestStr = makeRequestStr();
		$.ajax({
			url: "./asearch.do",
			cache : false,
			data:requestStr,
			success: function(retData) {
				listboxSearch(retData);
				initScrollCtl();
				resizeWindow();
				loadScriptTooltip();

				saveSelectState();

			},
			error: function(retData) {
			}
		});
	}

	function makeRequestStr() {
		var params = getUrlParams();
		var str = "";
		var radio = "";
		var bType = $('form[name="search"] input[name="B"]').prop('type');
		if (bType == 'radio') {
			radio = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			radio = $('form[name="search"] input[name="B"]').val();
		}

		if (typeof bType === "undefined") {
			str = str + "kisyu=" + encodeURIComponent(kisyu) + "&page="
			+ encodeURIComponent(currentPage);
		}
		else {
			str = str + "kisyu=" + encodeURIComponent(kisyu) + "&page="
					+ encodeURIComponent(currentPage) + "&B="
					+ encodeURIComponent(radio);
		}

		$('form[name="search"] input[name^="K-"]:checked').each(
			function() {
				str = str + "&" + $(this).prop("name") + "="
						+ encodeURIComponent($(this).val());
			}
		);

		$('form[name="search"] input[name^="TGKK"]:checked').each(
				function() {
					str = str + "&" + $(this).prop("name") + "="
							+ encodeURIComponent($(this).val());
				}
			);

		// 形名指定表示後または製品カテゴリ変更後は、search,wordを無視する
		if (ptnL == '1' || categoryChangeFlg == true) {
			chkSearch = "";
			chkWord = "";
		}

		// 並び替えキー・並び替え順
		if (sortKey != undefined && sortKey != '' && sortKey != '指定なし') {
			str = str + "&sortKey=" + encodeURIComponent(sortKey);
			if (sortOrder != '') {
				str = str + "&sortOrder=" + encodeURIComponent(sortOrder);
			}
		}

		if (array_key_exists("preview", params)) {
			str = str + "&preview=" + params["preview"];
		}

		if (array_key_exists("word", params)) {
			str = str + "&word=" + params["word"];
		}

		if (array_key_exists("category", params)) {
			str = str + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			str = str + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			str = str + "&lang=" + params["lang"];
		}

		return str;
	}

	// 形名検索(URL)
	function checkFormSearchParm(fn) {
		$("#SearchString").val(fn);
		checkFormSearch();
	}

	// 形名検索
	function checkFormSearch() {
		val1 = $("#SearchString").val();
		if (val1 == "") {
			$('#search_result').children().remove();
			$("#search_con_hit_count").html("<span>&nbsp</span>");
			$("#search_con_hit_count_form").html('<span>&nbsp</span>');
			$("#search_result").append("<p>1文字以上入力して検索してください。</p>");
			lastSend = '';
			return;
		}

		if (lastSend != val1) {
			clearCondition("2");

			compForm.length = 0;
			formSearch(val1);
		}
	}

	// 形名検索表示設定
	function formSearch(val1) {
		if (val1 != "") {
			list = getFormSearchResult(val1);
		}
	}

	function checkFormSearchJump() {
		formSearch(lastSend);
	}

	function makeSelectSaveString() {
		var ret = new Array;
		ret.push('kisyu=');
		ret.push(encodeURIComponent(kisyu));
		ret.push(' lang=');
		ret.push(encodeURIComponent(lang));
		ret.push(' search=');
		ret.push(encodeURIComponent(search));
		ret.push(' word=');
		ret.push(encodeURIComponent(word));
		ret.push(' cf=');
		ret.push(encodeURIComponent(cfMode));
		ret.push(' count=');
		ret.push(encodeURIComponent(currentPage));
		if (cfMode == 1 && lastSend != '') {
			ret.push(' L=');
			ret.push(encodeURIComponent(lastSend));
		} else if (cfMode == 2) {
			ret.push(' N=');
			ret.push(encodeURIComponent('1'));
		} else {
			ret.push(' L=');
			ret.push(encodeURIComponent($('#SearchString').val()));
		}
		var radio = '';
		var bType = $('form[name="search"] input[name="B"]').prop('type');
		if (bType == 'radio') {
			radio = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			radio = $('form[name="search"] input[name="B"]').val();
		}
		ret.push(' B=');
		ret.push(encodeURIComponent(radio));

		var condition = new Array;
		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			var name = $(this).prop('name');
			if (condition[name] == undefined) {
				condition[name] = encodeURIComponent($(this).prop('value'));
			} else {
				condition[name] += ' ' + encodeURIComponent($(this).prop('value'));
			}
		});
		$('form[name="search"] input[name^="TGKK"]:checked').each(function() {
			var name = $(this).prop('name');
			if (condition[name] == undefined) {
				condition[name] = encodeURIComponent($(this).prop('value'));
			} else {
				condition[name] += ' ' + encodeURIComponent($(this).prop('value'));
			}
		});
		for (cond in condition) {
			ret.push(' ' + cond + '=');
			ret.push(encodeURIComponent(condition[cond]));
		}

		var check = new Array;
		for ( var i = 0; i < compForm.length; i++) {
			if (i > 0) {
				check.push(' ');
			}
			check.push(encodeURIComponent(compForm[i]));
		}
		ret.push(" C=");
		ret.push(encodeURIComponent(check.join("")));

		if (sortKey != undefined && sortKey != '指定なし') {
			ret.push(' sortKey=' + encodeURIComponent(sortKey));
			if (sortOrder != undefined) {
				ret.push(' sortOrder=' + encodeURIComponent(sortOrder));
			}
		}

		return ret.join("");
	}

	function saveSelectState() {
		var path = location.pathname;
		var SEP = "__SEP__";
		var params = document.location.search.substring(1).split("&");
		var cookieValue = new Array;
		if (params.length) {
			for ( var i = 0; i < params.length; i++) {
				var valp =params[i].split("=");
				if (valp[0]=="word") {
					cookieValue.push('word=' +encodeURI($('form[name="search"] input[name="B"]:checked').val()));
				}else{
				cookieValue.push(params[i]);
				}

				if (i < params.length - 1) {
					cookieValue.push(SEP);
				}
			}
		} else {
			cookieValue.push(document.location.search.substring(1));
		}
		document.cookie = "fa_search_url=" + encodeURIComponent(path + "##" + cookieValue.join("")) + "; path=/fa/products/faspec; Secure";
		var save = makeSelectSaveString();
		document.cookie = 'fa_stand_select=' + encodeURIComponent(save) + "; Secure";
	}

	function saveSelectStateBack() {
		var save = makeSelectSaveString();

		$('input[name=state_save]').val(save);
	}

	// URLのクエリを取得する
	function getUrlParams() {
		var result = new Object();
		var temp_params = window.location.search.substring(1).split('&');
		for ( var i = 0; i < temp_params.length; i++) {
			var param = temp_params[i].split('=');
			result[param[0]] = param[1];
		}
		return result;
	}

	function getFormSearchResult(str) {
		var result = "";
		var params = getUrlParams();
		var requestStr = "kisyu=" + params["kisyu"] + "&page=" + currentPage;

		requestStr = requestStr + "&L=" + encodeURI(str);

		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}

		if (array_key_exists("word", params)) {
			requestStr = requestStr + "&word=" + params["word"];
		}

		if (array_key_exists("category", params)) {
			requestStr = requestStr + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			requestStr = requestStr + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		$.ajax({
			url: "./asearch.do",
			cache : false,
			data:requestStr,
			success: function(retData) {
				$('#search_result').html(retData);
				checkComp();

				if (str != "") {
					cfMode = '1';
					$('a', '#search_result').click(saveSelectState);
				}
				lastSend = str;

				$('#search_result input[type="checkbox"][name="comp"]').click(function() {
					setCheckState($(this));
				});

				initScrollCtl();
				loadScriptTooltip();
			},
			error: function(retData) {
			}
		});

		return result;
	}

	function initSearch() {
		var param = getParam($(document).prop('location').search);
		lang = "";

		if (array_key_exists('search', param))
			search = param['search'];
		if (array_key_exists('word', param))
			word = param['word'];
		if (array_key_exists('kisyu', param))
			kisyu = param['kisyu'];
		if (array_key_exists('lang', param))
			lang = param['lang'];
		compForm = new Array();

		var resume = false;
		if (checkReferrer() == true || $('input[name=state_save]').prop('checked')) {
			var lastSelect = getLastSelect();
			if (checkSelectResume(lastSelect)) {
				setLastSelect(lastSelect);
				resume = true;
			}
		}
		if (resume == false) {
			if ($('form[name="search"] input[name="B"]').prop('type') == "radio" &&
				$('form[name="search"] input[name="B"]:checked').length == 0) {
				// 製品カテゴリの指定がない場合は一番上のものを選択する
				$('form[name="search"] input[name="B"]').eq(0).prop("checked", true);
			}

			// URLパラメータにてK-XXの条件を指定している場合の対象条件クリック処理（初期表示のみ）
			var condType = search.split('@@');
			var condValue = word.split('@@');
			var arrayCondIdx = new Array();
			var iCount = 0;

			for (var i = 0; i < condType.length; i++) {
				if (condType[i].match(/K-[0-9][0-9]/)) {
					kCondIdx = i;
					arrayCondIdx[iCount] = i;
					iCount++;
				}
			}
			if (arrayCondIdx.length > 0) {
				// 条件クリックによる検索結果一覧の更新を無効にする
				refreshFlg = false;

				for (var i = 0 ; i < arrayCondIdx.length ; i++) {

					// 左メニューの条件選択
					$('form[name="search"] .product_table_filter').each(function() {
						// クリック対象の条件かどうか
						var condition = $(this).find('.product_table_filter_switch').prop('name');
						if (condition != condType[arrayCondIdx[i]]) {
							// 対象のK-XXでない場合は次の条件へ
							return true;
						}

						// [すべて表示]をクリック
						$(this).find('.product_table_filter_trigger.open').trigger('click');

						$($(this).find('.product_table_filter_switch')).each(function(){
							if (this.value == condValue[arrayCondIdx[i]]) {
								if (!$(this).prop('checked')) {
									this.click();
								}
								return false;
							}
						});

						// [閉じる]をクリック
						$(this).find('.product_table_filter_trigger.close').trigger('click');
					});

				}

				// 条件クリックによる検索結果一覧の更新を有効にする
				refreshFlg = true;
			}
		}

		makeNewMem();

		if (cfMode == '0') {
			searchSpec();
		} else if (cfMode == '1') {
			checkFormSearchJump();
		} else {
			checkNewInfoSearchJump();
		}

		// [製品カテゴリ]変更時イベント
		$('form[name="search"] input[name="B"]').change(function() {
			$("#SearchString").val("");
			$("p.filter_data_content_label").text($('form[name="search"] input[name="B"]:checked').val());
			lastSend = '';
			search = 'B';
			word = $('form[name="search"] input[name="B"]:checked').val();
			sortKey = '';
			sortOrder = '';
			categoryChangeFlg = true; // カテゴリを変更
			reloadCondition("0");
		});

		$('form[name="search"]').submit(function() {
			return false;
		});

		$("#SearchString").keypress(
				function(ev) {
					if ((ev.which && ev.which === 13)
							|| (ev.keyCode && ev.keyCode === 13)) {
						currentPage = 1;
						checkFormSearch();
						return false;
					} else {
						return true;
					}
				});

		$('input[name=state_save]').prop('checked', true);

		setOptionAttr();

		// 選択されている[製品カテゴリ]を表示
		$("p.filter_data_content_label").text($('form[name="search"] input[name="B"]:checked').val());

		saveSelectState();

		document.cookie = 'fa_search_url=; Secure';

	}

	function selectChange() {
		setOptionAttr();

		currentPage = 1;
		compForm.length = 0;
		searchSpec();
	}

	//左メニューの条件の更新
	function setOptionAttr() {
		if (typeof (datas) == 'undefined') {
			return;
		}

		var langWk = lang;
		if (langWk == "") {
			langWk = "1";
		}

		if (!array_key_exists(langWk, datas)) {
			return;
		}

		var langData = datas[langWk];

		var bType = $('form[name="search"] input[name="B"]').prop('type');
		var category = "";
		if (bType == 'radio') {
			category = $('form[name="search"] input[name="B"]:checked').val();
		} else if (bType == 'hidden') {
			category = $('form[name="search"] input[name="B"]').val();
		}

		if (!array_key_exists(category, langData)) {
			return;
		}

		var selData = langData[category];
		var selectArr = [];
		var selectArrStr = [];
		var cond = [];
		var checkAllCnt = 0;
		var checkCnt = 0;


		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			checkAllCnt++;
		});

		// 検索条件押下
		$('form[name="search"] input[name^="K-"]:checked').each(function() {
			var name = $(this).prop('name');
			selectArrStr[name] += "," + $(this).val();

			// チェック数カウント
			checkCnt++;

			if (checkAllCnt > 0 && checkAllCnt === checkCnt) {
				for (var i in selectArrStr) {
					selectArr[i] = selectArrStr[i].replace("undefined,", "");
				}

				for (var i in selectArr) {
					selectArr[i] = selectArr[i].split(",");
				}

				cond = getSettingList(selData, selectArr);
			}
		});

		// 対象製品が存在しない且つチェックが入っていない条件項目は非活性にする
		$('form[name="search"] input[name^="K-"]').each(function() {
			var name = $(this).prop('name');
			$(this).removeAttr('disabled');
			var str = "@@" + $(this).val() + "@@";
			var checked = $(this).prop('checked');
			if (!checked) {
				if (name in cond && cond[name].indexOf(str) == -1) {
					$(this).prop('disabled', 'disabled');
				}
			}
		});
	}

	function keywordSelect(obj, keywordArr, select) {
		// 子要素を順番にチェックし、選択項目以外で一致した場合trueを返す
		var properties = Object.getOwnPropertyNames(obj);
		var keywordCnt = 0;
		var judgeCnt = 0;
		for (var cnt in keywordArr) {
			keywordCnt++;
		}
		// 選択項目の場合は自身の分を減らす
		if (keywordArr[select]) {
			keywordCnt--;
		}
		for (var name in keywordArr) {
			if (name !== select) {
				for (var property in properties) {
					var child = obj[properties[property]];
					for (var selectNum in keywordArr[name]) {
						if (child === keywordArr[name][selectNum] && properties[property] == name) {
							judgeCnt++;
						}
						if (judgeCnt === keywordCnt) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	// 子要素を順番にチェックし、対象の項目名を返す
	function getConditionArray(list, conditionList) {
		var retArray = [];

		for (name in conditionList) {
			var ret = [];
			var sort = [];
			var retStr = "";
			for (var i in list) {
				ret.push(list[i][name]);
			}

			// 空欄を削除
			ret = ret.filter(function(e){return e !== undefined;});

			// 重複を削除
			sort = ret.filter(function (x, i, self) {
				return self.indexOf(x) === i;
			});

			retStr = "@@" + sort.join('@@@@') + "@@";

			if (retStr === "@@@@") {
				retStr = "";
			}

			retArray[name] = retStr;
		}
		return retArray;
	}

	// 項目名を返す
	function getPreList(list) {
		var ret = [];
		var listCnt = 0;

		for (var cnt in list) {
			listCnt++;
		}

		for (var i = 0; i < listCnt; i++) {
			for (var name in list[i]) {
				ret[name] = "";
			}
		}

		return ret;
	}

	function getSettingList(list, searchArr) {
		// 検索条件が選択されている場合
		if (searchArr) {
			var conditionListArray = [];
			var conditionList = [];

			// 空の項目一覧を作成
			preListArray = getPreList(list);

			// キーワード項目の一覧を作成
			conditionListAll = getConditionArray(list, preListArray);

			for (var select in preListArray) {
				var filteredSelectListArray = [];
				list.forEach(function (obj) {
					var isSelectMatch = keywordSelect(obj, searchArr, select);
					if (isSelectMatch) {
						filteredSelectListArray.push(obj);
					}
				});
				conditionListArray[select] = filteredSelectListArray;
			}

			for (var selectName in conditionListArray) {
				var args = Array.prototype.slice.call(conditionListArray[selectName]);
				var len = args.length;
				var retStr = "";

				for(var i = 0; i < len ; i++ ){
					var arg = args[i];
					if (arg.hasOwnProperty(selectName) && retStr.indexOf("@@" + arg[selectName] + "@@") == -1) {
						retStr += "@@" + arg[selectName] + "@@";
					}
				}
				conditionList[selectName] = retStr;
				if (conditionList[selectName] === "" && searchArr[selectName]) {
					conditionList[selectName] = conditionListAll[selectName];
				}
			}

			ret = conditionList;

			return ret;
		} else {
			return list;
		}
	}

	function array_key_exists(key, search) {
		if (!search
				|| (search.constructor !== Array && search.constructor !== Object)) {
			return false;
		}

		return key in search;
	}

	function getLastSelect() {
		var ret = new Array();
		var hash_cookies = getHashCookies();

		if (array_key_exists('fa_stand_select', hash_cookies) == true) {
			var str = decodeURIComponent(hash_cookies['fa_stand_select']);
			var array_select = str.split(" ");
			for ( var i = 0; i < array_select.length; i++) {
				var tmp = array_select[i].split("=");
				ret[tmp[0]] = decodeURIComponent(tmp[1]);
			}
		}

		return ret;
	}

	function getHashCookies() {
		var ret = new Array();
		var full_cookie_data = document.cookie;
		var array_cookies = full_cookie_data.split(";");
		for ( var i = 0; i < array_cookies.length; i++) {
			array_cookies[i] = array_cookies[i].replace(/^ +| +$/, '');
			var tmp = array_cookies[i].split("=");
			ret[tmp[0]] = tmp[1];
		}

		return ret;
	}

	function getLastSelectBack() {
		var ret = new Array();

		var str = $('input[name=state_save]').val();
		var array_select = str.split(" ");
		for ( var i = 0; i < array_select.length; i++) {
			var tmp = array_select[i].split("=");
			ret[tmp[0]] = decodeURIComponent(tmp[1]);
		}

		return ret;
	}

	function setLastSelect(lastSelect) {
		if (array_key_exists('cf', lastSelect)
				&& lastSelect['cf'].match(/^[012]$/) != null) {
			cfMode = lastSelect['cf'];
		}

		if (array_key_exists('count', lastSelect)
				&& lastSelect['count'].match(/^[0-9]+$/)) {
			currentPage = Number(lastSelect['count']);
		}

		if (array_key_exists('L', lastSelect)) {
			$("#SearchString").val(lastSelect['L']);
			if (cfMode == '1') {
				lastSend = lastSelect['L'];
			}
		}
		if (array_key_exists('N', lastSelect)) {
			if (cfMode == '2') {
				lastSend = lastSelect['N'];
			}
		}

		if (array_key_exists('B', lastSelect)
				&& $('form[name="search"] input[name="B"]').prop('type') == 'radio') {
			$('form[name="search"] input[name="B"]').val([ lastSelect['B'] ]);
			var html = getConditionHtml();
			if (html != "") {
				$(sideNavSelector).html(html);
				initProductTableNav();
			}
		}

		// 左メニューの条件選択
		refreshFlg = false; // 条件クリックによる検索結果一覧の更新を無効にする
		$('form[name="search"] .product_table_filter').each(function() {
			// [すべて表示]をクリック
			$(this).find('.product_table_filter_trigger.open').trigger('click');

			// 条件を選択
			var condition = $(this).find('.product_table_filter_switch').prop('name');
			if (lastSelect[condition] != undefined) {
				var list = lastSelect[condition].split(' ');
				$($(this).find('.product_table_filter_switch')).each(function(){
					for (var i = 0; i < list.length; i++) {
						if (decodeURIComponent(list[i]) == this.value) {
							if (!$(this).prop('checked')) {
								this.click();
							}
							break;
						}
					}
				});
			}

			// [閉じる]をクリック
			$(this).find('.product_table_filter_trigger.close').trigger('click');
		});
		refreshFlg = true; // 条件クリックによる検索結果一覧の更新を有効にする

		if (array_key_exists('C', lastSelect)) {
			var tmp = lastSelect['C'].split(' ');
			for ( var i = 0; i < tmp.length; i++) {
				if (tmp[i] != "") {
					compForm.push(decodeURIComponent(tmp[i]));
				}
			}
		}

		// 並び替え項目
		if (array_key_exists('sortKey', lastSelect)) {
			sortKey = lastSelect['sortKey'];
			if (array_key_exists('sortOrder', lastSelect)) {
				sortOrder = lastSelect['sortOrder'];
			}
		}
	}

	function getParam(locationSearch) {

		if ((locationSearch != null) && (locationSearch.length > 1)) {
			var query = locationSearch.substring(1);

			var parameters = query.split('&');

			var result = new Object();
			for ( var i = 0; i < parameters.length; i++) {
				var element = parameters[i].split('=');

				var paramName = decodeURIComponent(element[0]);
				var paramValue = decodeURIComponent(element[1]);

				result[paramName] = decodeURIComponent(paramValue);
			}

			return result;
		}

		return null;
	}

	function checkReferrer() {
		var current = document.location.href.replace(/^https?:\/\/[^\/]*\//, "");
		var referrer;
		if (document.referrer != "") {
			referrer = document.referrer.replace(/^https?:\/\/[^\/]*\//, "");
		} else {
			referrer = referrerCookie.replace(/^https?:\/\/[^\/]*\//, "");
		}

		var temp = current.split('?');
		current = temp[0];

		temp = referrer.split('?');
		referrer = temp[0];

		var file = referrer.substring(referrer.lastIndexOf('/') + 1);
		if (!file.match(/^(detail|point|device|download|compare|search).do$/)) {
			return false;
		}

		return true;
	}

	function reloadCondition(mode) {
		var html = getConditionHtml();
		if (html != "") {
			$(sideNavSelector).html(html);
			initProductTableNav();
			currentPage = 1;
			if (mode == "1") {
				$('#search_result').html('');
			} else if (mode == "2") {
			} else {
				searchSpec();
			}

			makeNewMem();
		}
	}

	function getConditionHtml() {
		var result = "";
		// create HTTP Object
		var xmlhttp = new XMLHttpRequest();
		var params = getUrlParams();
		var radio = $('form[name="search"] input[name="B"]:checked').val();
		var requestStr = "kisyu=" + params["kisyu"] + "&radio=";
		if (typeof(radio) != "undefined") {
			requestStr += encodeURI(radio);
		}
		requestStr += "&search=" + encodeURI(search) + "&word=" + encodeURI(word);
		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}
		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		// 通信をOPEN
		xmlhttp.open("POST", "./acondition.do", false);
		xmlhttp.setRequestHeader("Content-Type",
				"application/x-www-form-urlencoded");
		xmlhttp.send(requestStr);
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				result = xmlhttp.responseText;
			} else {
				// 通信エラー
			}
		}
		return result;
	}

	function clearCondition(mode) {
		if (mode == "2") {
			reloadCondition("2");
		} else {
			if ($('form[name="search"] input[name="B"]')[0]) {
				$('form[name="search"] input[name="B"]').eq(0).prop("checked", true);
				var reloadMode = "1";
				if (mode != "1") {
					$("#SearchString").val("");
					reloadMode = "0";
				}
				reloadCondition(reloadMode);
			} else {
				$('form[name="search"] input[name^="K-"]').each(function() {
					$(this).prop("selectedIndex", "0");
				});
				reloadCondition("0");
			}
		}
	}

	//比較チェックボックスのチェックを全て外す
	function compareProdClear() {
		compForm.length = 0;
		$('#search_result input[type="checkbox"][name="comp"]').prop("checked", false);
		enableCheckButton();
	}

	// 疑似結合表示
	function setListBorder() {
		$(".comb_top").each(function() {
			$(this).css("border-top", "none");
		});

		$('.comb_bottom').each(function() {
			$(this).css("border-bottom", "none");
		});
	}

	function jumpResultPage(param) {
		currentPage = param;

		if (cfMode == '0') {
			searchSpec();
		} else if (cfMode == '1') {
			checkFormSearchJump();
		} else {
			checkNewInfoSearchJump();
		}
		scrollResultTop();
	}

	function dispProductCompare() {
		if (compForm.length > 1) {
			var params = getUrlParams();
			saveSelectState();
			var url = 'compare.do?kisyu=';
			url = url + kisyu;
			for ( var i = 0; i < compForm.length; i++) {
				url = url + '&formNm=' + encodeURIComponent(compForm[i]);
			}
			url = url + '&main=' + encodeURIComponent(compForm[0]);

			if (array_key_exists("preview", params)) {
				url = url + '&preview=' + params['preview'];
			}

			if (array_key_exists("word", params)) {
				url = url + "&word=" + params["word"];
			}

			if (array_key_exists("category", params)) {
				url = url + "&category=" + params["category"];
			}

			if (array_key_exists("id", params)) {
				url = url + "&id=" + params["id"];
			}

			if (array_key_exists("lang", params)) {
				url = url + "&lang=" + params["lang"];
			}

			url = url + "&popup=" + 1;

			return url;
		}
	}

	// 比較表示設定（チェックボックス）
	function checkComp() {
		$('#search_result input[type="checkbox"][name="comp"]').each(function() {
			if (searchArrayIndex(compForm, $(this).val()) != -1) {
				$(this).prop('checked', true);
			}
		});
		enableCheckButton();
	}

	// 用途で探すの▼表示
	function checklistBox() {
		if ($('.narrow_condition_list').children().length < 1) {
			$('.narrow_condition').css('background-image', 'none');
		}
	}

	function setCheckState(obj) {
		if (obj.prop('checked')) {
			var checkedBoxNumber = MEL_SETTINGS.helper.getMediaMode() === 'small' ? 3 : 10;
			if (compForm.length >= checkedBoxNumber) {
				obj.prop('checked', false);
				return;
			}
			if (searchArrayIndex(compForm, obj.val()) == -1 && !obj.hasClass('noneCheak')) {
				// チェックボックスのない製品（仕様なし）は比較チェックができないようにする
				compForm.push(obj.val());
			}

		} else {
			var index = searchArrayIndex(compForm, obj.val());
			if (index != -1) {
				compForm.splice(index, 1);
			}
		}
		enableCheckButton();
	}

	function searchArrayIndex(array, search) {
		var ret = -1;
		if (Array.prototype.indexOf) {
			ret = array.indexOf(search);
		} else {
			for ( var i = 0; i < array.length; i++) {
				if (array[i] == search) {
					ret = i;
					break;
				}
			}
		}
		return ret;
	}

	// [仕様比較]ボタンの活性化
	function enableCheckButton() {
		if (compForm.length < 2) {
			$(".spec_select_head_btn").html('<span>'+ specSearchLabels.compareSpec + '</span>');
		} else {
			$(".spec_select_head_btn").html('<a class="popup" href=' + dispProductCompare() + '>' + specSearchLabels.compareSpec + '</a>');
		}
	}

	function checkSelectResume(lastSelect) {
		var lastLang = "";
		if (array_key_exists('lang', lastSelect)) {
			lastLang = lastSelect['lang'];
		}
		if (lastLang == "") {
			lastLang = "1";
		}

		var paramLang = lang;
		if (paramLang == "") {
			paramLang = "1";
		}

		if (array_key_exists('kisyu', lastSelect) && lastSelect['kisyu'] == kisyu
				&& lastLang == paramLang && array_key_exists('search', lastSelect)
				&& lastSelect['search'] == search
				&& array_key_exists('word', lastSelect)
				&& lastSelect['word'] == word) {
			return true;
		}
		return false;
	}

	function getSelectArray(name) {
		var ret = new Array();
		$('form[name="search"] input[name=' + name + ']:checked').each(
				function() {
					ret.push($(this).prop("index"));
				});
		return ret;
	}

	function makeNewMem() {
		selMem = new Array();
		$('form[name="search"] input[name^="K-"]').each(function() {
			selMem[$(this).prop("name")] = getSelectArray($(this).prop("name"));
		});
	}

	function checkSelectChange(name) {
		var ret = false;
		if (array_key_exists(name, selMem)) {
			// 一時保存領域とセレクトボックス状態比較
			var last = selMem[name];
			var current = getSelectArray(name);
			if (last.length == current.length) {
				for ( var i = 0; i < last.length; i++) {
					if (searchArrayIndex(current, last[i]) == -1) {
						ret = true;
						break;
					}
				}
			} else {
				ret = true;
			}
			if (ret == true) {
				selMem[name] = current;
			}
			last = null;
			current = null;
		} else {
			ret = true;
			selMem[name] = getSelectArray(name);
		}

		return ret;
	}

	function scrollResultTop() {
		var p = $("#search_result").offset().top;
		$(window).scrollTop(p);
	}

	// 新着検索
	function checkNewInfoSearch() {
		list = getNewInfoSearchResult();
	}

	// 新着情報取得
	function getNewInfoSearchResult() {
		var result = "";
		var params = getUrlParams();
		var requestStr = "kisyu=" + params["kisyu"] + "&page=" + currentPage;

		requestStr = requestStr + "&N=1";

		if (array_key_exists("preview", params)) {
			requestStr = requestStr + "&preview=" + params["preview"];
		}

		if (array_key_exists("word", params)) {
			requestStr = requestStr + "&word=" + params["word"];
		}

		if (array_key_exists("category", params)) {
			requestStr = requestStr + "&category=" + params["category"];
		}

		if (array_key_exists("id", params)) {
			requestStr = requestStr + "&id=" + params["id"];
		}

		if (array_key_exists("lang", params)) {
			requestStr = requestStr + "&lang=" + params["lang"];
		}

		$.ajax({
			url: "./asearch.do",
			cache : false,
			data:requestStr,
			success: function(retData) {
				$('#search_result').html(retData);
				checkComp();
				loadScriptTooltip();

				// 新着を保存
				cfMode = '2';
				saveSelectState();

				$('#search_result input[type="checkbox"][name="comp"]').click(function() {
					setCheckState($(this));
				});
			},
			error: function(retData) {
			}
		});
		return result;
	}

	// 詳細からの戻り
	function checkNewInfoSearchJump() {
		checkNewInfoSearch();
	}

	function compare(kisyu, formNm) {
		// about:blankとしてOpen
		var target = 'ATMARK';
		window.open("", target, "width=825,height=500,resizable=yes,location=no,scrollbars=yes");

		// formを生成
		var form = document.createElement("form");
		form.action = '../faspec/compare.do';
		form.target = target;
		form.method = 'post';

		// input-hidden生成と設定
		var qs = [{type:'hidden',name:'formNm',value:formNm},{type:'hidden',name:'kisyu',value:kisyu},{type:'hidden',name:'popup',value:'1'},{type:'hidden',name:'typename',value:'1'}];
		for(var i = 0; i < qs.length; i++) {
			var ol = qs[i];
			var input = document.createElement("input");
			for(var p in ol) {
				input.setAttribute(p, ol[p]);
			}
			form.appendChild(input);
		}

		// formをbodyに追加して、サブミットする。その後、formを削除
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(form);
		form.submit();
		body.removeChild(form);
	}

	//***************************************************************************
	//*********************************** 追加 ***********************************
	//***************************************************************************
	var search = '';
	var word = '';
	var kisyu = '';
	var cfMode = '0';
	var lastSend = '';
	var currentPage = 1;
	var compForm;

	var timer = null;
	var scrollObj = null;

	var referrerCookie = "";

	function initScrollCtl() {
		$(".data_table").each(function () {
			var divId = $(this).attr('id');
			if (divId == null) {
				return;
			}
			var tableNo = divId.substring(divId.indexOf('_'));
			var floatId = '#fs' + tableNo;
			var scrollWidth = '128';
			var scrollWidthMax = '1280';

			// スクロール対象の横幅が表示領域より大きいか判定
			if (isDispScrollBar('#' + divId)) {
				viewFloatScroll('#h' + tableNo);
				scrollButtonEnable(tableNo);
			}

			// 手動でスクロールさせた場合のコントロール表示制御
			scrollObj = $("#d" + tableNo);
			scrollObj.on('scroll', function () {
				scrollButtonEnable(tableNo);
			});

			// コントロール内ボタンのイベント登録
			$(floatId + ' .scroll_prev a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '-=' + scrollWidth
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_next a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '+=' + scrollWidth
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_first a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: '0'
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});
			$(floatId + ' .scroll_last a').on('click', function () {
				scrollObj = $("#d" + tableNo);
				scrollObj.animate({
					scrollLeft: scrollWidthMax
				}, 200, 'swing', function() {
					scrollButtonEnable(tableNo);
				});
			});

			// ウィンドウリサイズ時に横スクロールバー表示制御
			$(window).on('load.scrollControl resize.scrollControl', function() {
				resizeWindow();

				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});

			// ページスクロール時にコントロール要素の表示制御
			$(window).on('scroll.scrollControl', function() {				
				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});
	}

	function scrollButtonEnable(tableNo) {
		var leftPos = $("#d" + tableNo).scrollLeft();
		var divWidth = $("#d" + tableNo).width();
		var leftPosEnd = Math.floor($("#d" + tableNo).children("table").width() - divWidth);

		if (leftPos > 0) {
			$("#fs" + tableNo + " ul li.scroll_prev a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_prev a.on_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
					"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_prev a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_prev a.on_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
					"none");
		}

		if (leftPos < leftPosEnd) {
			$("#fs" + tableNo + " ul li.scroll_next a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_next a.on_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_last a.off_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_last a.on_button").css("display",
					"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_next a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_next a.on_button").css("display",
					"none");
			$("#fs" + tableNo + " ul li.scroll_last a.off_button").css("display",
					"block");
			$("#fs" + tableNo + " ul li.scroll_last a.on_button").css("display",
					"none");
		}
	}

	function hideFloatScroll(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		$(floatId).css("display", "none");
	}

	//ウィンドウリサイズ対策
	function resizeWindow() {
		var timer = false;
		selectUA(3);
		$(window).on('resize', function() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				selectUA(3);
				setTimeout(function() {
					timer = false;
				}, 0);
			}, 200);
		});
	}

	function selectUA(size) {
		var ary1 = [];
		var ary2 = [];
		$('.table1').each(function(i) {
			ary1.push($(this).attr('id'));
		});
		$('.table2').each(function(i) {
			ary2.push($(this).attr('id'));
		});

		$.each(ary1, function(i) {
			makeRowHeight('#' + ary2[i], '#' + ary1[i], size);
		});
	}

	function isDispScrollBar(objId, key) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var divWidth = parseInt($(objId).css('width'));
		var tblWidth = parseInt($('#t2' + tableNo).css('width'));
		if ((tblWidth-divWidth) > 1) {
			return true;
		} else {
			return false;
		}
	}

	function viewFloatScroll(objId) {
		//データ無しの場合は、処理を抜ける
		if ($('.data_table').length == 0) {
			return;
		}

		$(objId).parent().css("position", "relative");
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		var dataId = '#d' + tableNo;
		var offset = $(dataId).offset();
		var offsetTop = document.getElementById('d' + tableNo).offsetTop;
		var offsetParentTop = document.getElementById('d' + tableNo).offsetParent.offsetTop;
		var width = $(dataId).outerWidth();
		var height = $(objId).height();
		var dspPos = $(window).scrollTop();
		var winHeight = $(window).height();
		var setTop = offset.top + 100;
		var setLeft = $(dataId).offset().left;

		if (dspPos < offsetTop + offsetParentTop + height) {
			var position = "";
			if ((offsetTop + offsetParentTop) > (dspPos + $(floatId).height())) {
				// setTop = offset.top - dspPos - $(floatId).height();
				position = "absolute";
				setTop = offsetTop - $(floatId).outerHeight()
						+ parseInt($(floatId).css("border-bottom-width"));
				setLeft = $(objId).outerWidth() - 1;
			} else {
				setTop = 0;
				position = "fixed";
			}

			$(floatId).css("position", position);
			$(floatId).css("top", setTop);
			$(floatId).css("left", setLeft);
			$(floatId).outerWidth(width);
			$(floatId).css("display", "inline");
			$(floatId + " .scrolllink").css("margin", 0);
		} else {
			$(floatId).css("display", "none");
			;
		}
	}

	function makeRowHeight(objId1, objId2, msize) {
		var tr1 = $(objId1 + " tr");// 全行を取得
		var tr2 = $(objId2 + " tr");// 全行を取得
		var rspn = "rowspan";

		for ( var i = 0, l = tr1.length; i < l; i++) {
			var cells1 = tr1.eq(i).children();// 1行目から順にth、td問わず列を取得
			var cells2 = tr2.eq(i).children();// 1行目から順にth、td問わず列を取得

			if (msize > 0) {
				for ( var j = 0, m = cells1.length; j < m; j++) {
					if (cells1.eq(j).attr(rspn) == null
							|| cells1.eq(j).attr(rspn) == "1") {
						cells1.eq(j).get(0).style.height = "auto";
					}
				}
				for ( var j = 0, m = cells2.length; j < m; j++) {
					if (cells2.eq(j).attr(rspn) == null
							|| cells2.eq(j).attr(rspn) == "1") {
						cells2.eq(j).get(0).style.height = "auto";
					}
				}
			}

			var hmax1 = 0;
			for ( var j = 0, m = cells1.length; j < m; j++) {
				var nowh = 0;
				if (cells1.eq(j).attr(rspn) == null
						|| cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height();// i行目j列の文字列を取得
				}
				if (hmax1 < nowh) {
					hmax1 = nowh;
				}
			}
			var hmax2 = 0;
			for ( var j = 0, m = cells2.length; j < m; j++) {
				var nowh = 0;
				if (cells2.eq(j).attr(rspn) == null
						|| cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height();// i行目j列の文字列を取得
				}
				if (hmax2 < nowh) {
					hmax2 = nowh;
				}
			}

			var maxHeight = hmax1;
			if (hmax1 < hmax2) {
				maxHeight = hmax2;
			}
			maxHeight = Math.ceil(maxHeight);

			for ( var j = 0, m = cells1.length; j < m; j++) {
				if (cells1.eq(j).attr(rspn) == null
						|| cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height(maxHeight);
				}
			}
			for ( var j = 0, m = cells2.length; j < m; j++) {
				if (cells2.eq(j).attr(rspn) == null
						|| cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height(maxHeight);
				}
			}
		}

		for ( var i = 0; i < tr1.length; i++) {
			var cells1 = tr1.eq(i).children();// 1行目から順にth、td問わず列を取得
			var cells2 = tr2.eq(i).children();// 1行目から順にth、td問わず列を取得
			var hmax1 = getMaxHeight(cells1, rspn);
			var hmax2 = getMaxHeight(cells2, rspn);
			var before = 0;
			var add = msize;
			if (msize > 0) {
				before = setMaxHeight(cells1, cells2, hmax1, hmax2, add, rspn);
				hmax1 = getMaxHeight(cells1, rspn);
				hmax2 = getMaxHeight(cells2, rspn);
			}
			if (add < 1) {
				add = 1;
			}
			for ( var cnt = 0; cnt < 20 && hmax1 != hmax2; cnt++) {
				before = setMaxHeight(cells1, cells2, before, 0, add, rspn);
				hmax1 = getMaxHeight(cells1, rspn);
				hmax2 = getMaxHeight(cells2, rspn);
			}
		}
		dummyReplace();
	}

	function getMaxHeight(cells, rspn) {
		var hmax = 0;
		for ( var j = 0, m = cells.length; j < m; j++) {
			var nowh = 0;
			if (cells.eq(j).attr(rspn) == null || cells.eq(j).attr(rspn) == "1") {
				nowh = cells.eq(j).height();// i行目j列の文字列を取得
			}
			if (hmax < nowh) {
				hmax = nowh;
			}
		}
		return hmax;
	}

	function setMaxHeight(cells1, cells2, hmax1, hmax2, msize, rspn) {
		var maxHeight = hmax1;
		if (hmax1 < hmax2) {
			maxHeight = hmax2;
		}
		maxHeight = Math.ceil(maxHeight) + msize;
		for ( var j = 0, m = cells1.length; j < m; j++) {
			if (cells1.eq(j).attr(rspn) == null || cells1.eq(j).attr(rspn) == "1") {
				cells1.eq(j).height(maxHeight);
			}
			if (cells2.eq(j).attr(rspn) == null || cells2.eq(j).attr(rspn) == "1") {
				cells2.eq(j).height(maxHeight);
			}
		}
		return maxHeight;
	}

	//dummy表示文字列置換処理
	function dummyReplace() {
		// 要素内の文字列をnbsp
		$('td').each(function() {
			var txt = $(this).html();
			$(this).html(txt.replace(/!DUMMY!/g, '&nbsp;'));
		});
	}

	function loadScriptTooltip() {
		productTooltip();
	}

	/**
	 * product用ツールチップの設定
	 */
	function productTooltip() {
		var $body = $('body');
		var $tooltipArea = $('[data-js-product-tooltip]');
		var tooltipControlSelector = '[data-js-product-tooltip-control]';
		var $tooltipControlArea = $(tooltipControlSelector);
		var posTLclassName = 'is-lt';
		var posTCclassName = 'is-ct';
		var posTRclassName = 'is-rt';
		var posBLclassName = 'is-lb';
		var posBCclassName = 'is-cb';
		var posBRclassName = 'is-rb';
		var arrowMargin = 10;

		//-------------------------------------------------
		// Constructor
		//-------------------------------------------------
		(function() {
			if ($tooltipArea.length > 0) {
				_init();
			}
		})();

		//-------------------------------------------------
		// Private Methods
		//-------------------------------------------------
		/**
		 * _init()：初期化
		 * @private
		 */
		function _init() {
			var $tooltipTrigger = $tooltipArea.find('.melfa_tooltip_trigger');

			// 固定列は吹き出しの位置を固定
			$tooltipTrigger.each(function() {
				var $targetTrigger = $(this);
				var isContolArea =
					$targetTrigger.closest(tooltipControlSelector).length > 0
						? true
						: false;

				if (!isContolArea) {
					$targetTrigger.addClass(posTCclassName);
				}
			});

			// 動的生成エリアのためイベントdelegate
			// '[data-js-product-tooltip-control]'エリア内はツールチップの位置を調整
			$body.delegate('.melfa_tooltip_trigger', 'mouseover', function(e) {
				var $targetTrigger = $(e.currentTarget);
				var $targetWrapper = $targetTrigger.closest('.melfa_tooltip');
				var $targetContent = $targetWrapper.find('.melfa_tooltip_contents');
				var isContolArea =
					$targetTrigger.closest(tooltipControlSelector).length > 0
						? true
						: false;

				$targetContent.fadeIn(200);
				if (isContolArea) {
					_setPos($targetTrigger, $targetContent);
				}
			});

			$body.delegate('.melfa_tooltip_trigger', 'mouseout', function(e) {
				var $targetTrigger = $(e.currentTarget);
				var $targetWrapper = $targetTrigger.closest('.melfa_tooltip');
				var $targetContent = $targetWrapper.find('.melfa_tooltip_contents');

				$targetContent.fadeOut(200);
			});
		}

		/**
		 * _setPos()：ポジション調整
		 * @param {object} $targetTrigger 対象のトリガー
		 * @param {object} $targetContent 対象のコンテンツ
		 * @private
		 */
		function _setPos($targetTrigger, $targetContent) {
			var $tooltipArea = $('[data-js-product-tooltip]');
			var tooltipControlSelector = '[data-js-product-tooltip-control]';
			var $tooltipControlArea = $(tooltipControlSelector);

			var triggerWidth = $targetTrigger.outerWidth();
			var contentWidth = $targetContent.outerWidth();
			var contentHeight = $targetContent.outerHeight() + arrowMargin;

			var tooltipAreaBounds = $tooltipControlArea.get(0).getBoundingClientRect();
			var tooltipAreaTop = tooltipAreaBounds.top;
			var tooltipAreaLeft = tooltipAreaBounds.left;
			var tooltipAreaRight = tooltipAreaBounds.right;

			var triggerBounds = $targetTrigger.get(0).getBoundingClientRect();
			var triggerTop = triggerBounds.top;
			var triggerCenter = triggerBounds.left + Math.floor(triggerWidth / 2);

			var triggerClassTxt =
				posTLclassName +
				' ' +
				posTCclassName +
				' ' +
				posTRclassName +
				' ' +
				posBLclassName +
				' ' +
				posBCclassName +
				' ' +
				posBRclassName;

			$targetTrigger.removeClass(triggerClassTxt);

			var isTopPos = tooltipAreaTop > triggerTop - contentHeight ? false : true;

			// 右にはみ出る
			if (tooltipAreaRight < triggerCenter + contentWidth / 2) {
				if (isTopPos) {
					$targetTrigger.addClass(posTRclassName);
				} else {
					$targetTrigger.addClass(posBRclassName);
				}
				// 左にはみ出る
			} else if (tooltipAreaLeft > triggerCenter - contentWidth / 2) {
				if (isTopPos) {
					$targetTrigger.addClass(posTLclassName);
				} else {
					$targetTrigger.addClass(posBLclassName);
				}
				// センター
			} else {
				if (isTopPos) {
					$targetTrigger.addClass(posTCclassName);
				} else {
					$targetTrigger.addClass(posBCclassName);
				}
			}
		}
	}

	(function($) {
		'use strict';

		const $document = $(document);

		//===================================== document ready
		$(function() {
			// referrer cookie操作
			var hash_cookies = getHashCookies();

			if (array_key_exists('fa_search_url', hash_cookies) == true
					&& hash_cookies['fa_search_url'] != undefined) {
				referrerCookie = decodeURIComponent(hash_cookies['fa_search_url']);
			}

			// 別画面でpopup
			$('#search_result').on('click', '.spec_select_head_btn', function(e) {
				e.preventDefault();

				const $clickBtn = $(e.target);
				if($clickBtn.attr('href')) {
					window.open($clickBtn.attr('href'), '', 'width=825,height=500,resizable=yes,location=no,scrollbars=yes');
				}
			});

			// パンくずナビ生成（旧ヘッダーから要素抽出）
			const $breadcrumb = $('.c-breadcrumb');
			const $breadcrumbList = $breadcrumb.find('.c-breadcrumb__list');
			const $breadcrumbBefore = $('.c-breadcrumb--before');
			if($breadcrumbBefore.length > 0) {
				const $searchPankuzuListItems = $breadcrumbBefore.find('#search_pankuzu li');
				const kisyuTopObject = {
					'name': $searchPankuzuListItems.eq(2).text()//,
					//'link': $searchPankuzuListItems.eq(2).find('a').attr('href')
				}
				const $breadcrumbListHTML = `
					<li class="c-breadcrumb__list-item"><a href="/fa/">${productsLabels.top}</a></li>
					<li class="c-breadcrumb__list-item"><a href="/fa/products/index.html">${productsLabels.products}</a></li>
					<li class="c-breadcrumb__list-item"><span>${kisyuTopObject.name}</span></li>
					<li class="c-breadcrumb__list-item"><span>${productsLabels.standard}</span></li>
				`;
				$breadcrumbList.html($breadcrumbListHTML);
				$breadcrumbBefore.remove();
			}

			//アコーディオン初期設定
			const $accordionWrapper = $('.js_accordion_wrapper');
			const $accordionTrigger = $accordionWrapper.find('.js_accordion_trigger');
			const $accordionContents = $accordionWrapper.find('.js_accordion_content');
			const accordionOutClickOnClass = 'js_accordion_outclick_on';

			if ($accordionTrigger.length > 0 && $.isFunction($.fn.customAccordion)) {
				$accordionTrigger.customAccordion({
					toggleContent: function() {
						return $(this).closest('.js_accordion_wrapper').find('.js_accordion_content');
					},
					duration: 'fast',
					easing: 'linear',
					triggerClass: {
						opened: 'opened',
						closed: 'closed'
					},
					endInit: function(options) {
						var $this = $(this);
						var $thisWrapper = $this.closest('.js_accordion_wrapper');
						var $thisContent = $thisWrapper.find('.js_accordion_content');
						var $thisCloseTrigger = $thisWrapper.find('.js_accordion_close');

						if ($this.hasClass(accordionOutClickOnClass)){
							//アコーディオンエリア内、及びトリガー押下では閉じないようにする
							$this.mousedown(function (e) {
								e.stopPropagation();
							});
							$thisContent.mousedown(function (e) {
								e.stopPropagation();
							});
						}

						if ($thisCloseTrigger.length > 0) {
							//閉じるボタン
							$thisCloseTrigger.click(function (e) {
								accrodionClose($thisContent);
							});
						}
					},
					beforeOpen: function(options) {
						$(this).closest('.js_accordion_wrapper').addClass('opened');
					},
					endOpen: function(options) {
						//トリガーに'js_accordion_outclick_on'クラスが付与されている場合は
						//ドキュメントクリックによる閉じる機能を有効にする
						if ($(this).hasClass(accordionOutClickOnClass)){
							$document.mousedown(function (e) {
								accrodionClose($accordionContents);
							});
						}
					},
					beforeClose: function(options) {
						$(this).closest('.js_accordion_wrapper').removeClass('opened');
						$document.unbind('mousedown', accrodionClose);
					}
				});
			}

			/**
			 * アコーディオンを閉じる
			 */
			function accrodionClose($targetContents) {
				$targetContents.customAccordionManual('close', {
					beforeClose: function(options) {
						$accordionTrigger.closest('.js_accordion_wrapper').removeClass('opened');
						$accordionTrigger.removeClass('opened');
					}
				});
			}

			//左ナビ初期化
			initProductTableNav();
			initSearch();
		});
	})(window.jQuery3_6 || jQuery);
}