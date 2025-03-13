/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 三菱電機 FAサイト 機種選定
 MELSEC-A/AnSシリーズ -> MELSEC iQ-R マイグレーションツール スクリプト
 
 Version: 1.0.0 多言語対応
 Update: 2021-03-21

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

// 変数初期化
var timestamp = parseInt(new Date() / 1000);
var language = "JA";
var messages = [];
var pattern = [];
var Q_Units = [];
var R_Units = [];
var selectedPattern = [];
var selectedIndex = 0;
var seletedUnit = "";
var seletedQProduct = "";
var maxInputForm = 99;
var maxQuantity = 10;

// 外部JSONファイルパス
var messageJSON = "./database/message.json";
var databaseJSON = "./database/database.json";

// 起動時の初期化処理
$(function() {
	// 選択候補ポップアップは非表示
	$('#Q2R-Migration').hide();
	$('#popup').hide();
	$('#comment').hide();
	$('#datatable').hide();
	$('#PrintArea').hide();
	$('#PrintDocLinkArea').hide();
	$('#ImageArea').hide();
	$('#modalWindow').hide();
	
	// クリアボタンのイベント
	$('#clearBtn').click(function(){
		$('#popup').hide();
		$('#comment').hide();
		$('#commentText').empty();
		$('#candidate').empty();
		
		// 入力フォームと選定結果をリセット
		resetInputForm();
	});
			
	// ローディングメッセージ表示
	$("#message").html('<p><strong>Loading...</strong></p>');
	$("#message").show();
	setTimeout(new function(){
		// UIメッセージ取得
		loadMessageData(messageJSON + "?" + timestamp);
	}, 500);
});

// UIメッセージのJSONファイル読込
function loadMessageData(_url)
{
	$.getJSON(_url).done(function(_data, _textStatus, _jqXHR)
	{
		/* XMLファイルの読み込み完了イベントハンドラ */
		if (_data != null)
		{
			// UIメッセージの取得
			try {
				// UIメッセージ（配列）データを取得
				language = _data.Language;
				messages = _data.Messages;
				
				// アップグレードパターン取得
				loadMigrationData(databaseJSON + "?" + timestamp);
			} catch (e) {
				// エラー処理
				faild(e.message);
			}
		}
		else
		{
			// エラー処理
			faild("Error code #2");
		}
	}).fail(function(_data, _textStatus, _errorThrown)
	{
		// エラー処理
		faild("Error code #1");
		//faild(_textStatus + "/" + _errorThrown + "\n" + JSON.stringify(_data));
	});
}

// 移行パターンのJSONファイル読込
function loadMigrationData(_url)
{
	$.getJSON(_url).done(function(_data, _textStatus, _jqXHR)
	{
		/* XMLファイルの読み込み完了イベントハンドラ */
		if (_data != null)
		{
			try {
				// 移行パターン（配列）データを取得
				pattern = _data.Upgrade;
				
				// QシリーズとiQ-Rシリーズのユニット分類を取得
				Q_Units = _data.Q_Units;
				R_Units = _data.R_Units;
				
				// 入力フォームを初期化
				createInputForm();
				
				// 選定画面を表示
				$('#Q2R-Migration').show();
			} catch (e) {
				// エラー処理
				faild(e.message);
			}

			$("#message").hide();
		}
		else
		{
			// エラー処理
			faild("Error code #4");
		}
	}).fail(function(_data, _textStatus, _errorThrown)
	{
		// エラー処理
		faild("Error code #3");
		//faild(_textStatus + "/" + _errorThrown + "\n" + JSON.stringify(_data));
	});
}

// 指定INDEX番号（0～）のUIメッセージを返す
function getMessage(_index) {
	var _message = "none";
	if (!isNaN(_index) && _index >= 0 && _index < messages.length) {
		try {
			_message = textFormat(messages[_index]);
		} catch(e) {
			//
		}
	}
	
	return _message;
}

// 入力フォームを初期化
function createInputForm() {
	// UIの初期化
	$('#mainTitle').html(getMessage(1));		// 本ツールのメインタイトル
	$('#mainSummary').html(getMessage(2));		// 本ツールの概要文章
	
	// Qシリーズ選択
	$('#subtitle1').text(getMessage(3));		// Qシリーズ選択テーブル見出し
	$('.no').text(getMessage(46));				// Qシリーズ選択テーブル列1（No.）
	$('.unit1').text(getMessage(5));			// Qシリーズ選択テーブル列2（ユニット）
	$('.type_name').text(getMessage(6));		// Qシリーズ選択テーブル列3（形名）
	$('.quantity').text(getMessage(7));			// Qシリーズ選択テーブル列4（数量）
	
	// iQ-Rシリーズ選定結果
	$('#subtitle2').text(getMessage(4));		// iQ-Rシリーズ選定結果テーブル見出し
	$('.unit2').text(getMessage(5));			// iQ-Rシリーズ選定結果テーブル列1（ユニット）
	$('.type_name2').text(getMessage(6));		// iQ-Rシリーズ選定結果テーブル列2（形名）
	$('.quantity2').text(getMessage(7));		// iQ-Rシリーズ選定結果テーブル列3（数量）
	$('.more_detail').html(getMessage(14));		// iQ-Rシリーズ選定結果テーブル列4（詳細情報）
	
	// 選定画面ボタン
	$('#clearBtn').val(getMessage(10));				// 「入力内容のクリア」ボタン名称
	$('#candidatBtn').val(getMessage(11));			// 「構成リスト表示」ボタン名称
	
	// 注意事項ダイアログ
	$('#commentTitle').text(getMessage(15));		// 注意事項ダイアログのタイトル
	$('#closeCommentBtn').text(getMessage(17));		// 注意事項ダイアログの閉じるボタン名称
	
	// 形名候補ダイアログ
	$('#candidateTitle').text(getMessage(18));		// 形名候補ダイアログのタイトル
	$('#candidate').text(getMessage(19));			// 形名候補テーブル列1（形名候補）
	$('#choice').text(getMessage(20));				// 形名候補テーブル列2（選択）
	
	// 構成リストダイアログ
	$('#configListTitle').text(getMessage(21));		// 構成リストのタイトル
	$('#configListSummary').html(getMessage(22));	// 構成リストの概要文章
	$('.printText').text(getMessage(23));			// 構成リストの印刷ボタン名称
	$('.clipText').text(getMessage(24));			// 構成リストのクリップボードコピーボタン名称
	$('#closeDatatableBtn').text(getMessage(35));	// 構成リストの閉じるボタン名称
	
	// 構成リストヘッダ行（価格関連の列は日本語のみ表示）
	var _tr = $('<tr>');
	_tr.append('<th class="col-0">' + getMessage(46) + '</th>');
	_tr.append('<th class="col-1">' + getMessage(27) + '</th>');
	_tr.append('<th class="col-2">' + getMessage(28) + '</th>');
	if (language == "JA") _tr.append('<th class="col-3">' + getMessage(29) + '</th>');
	_tr.append('<th class="col-4">' + getMessage(30) + '</th>');
	if (language == "JA") _tr.append('<th class="col-5">' + getMessage(31) + '</th>');
	_tr.append('<th class="col-6">' + getMessage(32) + '</th>');
	if (language == "JA") _tr.append('<th class="col-7">' + getMessage(33) + '</th>');
	_tr.append('<th class="col-8">' + getMessage(34) + '</th>');
	$('#ConfigListHead').append(_tr);
	
	// Qシリーズ選択項目をクリア
	$('#input').empty();
	
	// Qシリーズ選択項目を初期化
	var _tabindex = 1;
	for (var _index = 1; _index <= maxInputForm; _index++) {
		// 行の作成
		var _tr = $('<tr>');
		_tr.addClass((isOdd(_index)) ? "odd" : "even");
		
		// 行番号
		_tr.append($('<td id="No-' + _index + '" class="no">').text(_index));
		
		// ユニット大分類の抽出と選択肢の設定
		var _unit = $('<select id="Q-Unit-' + _index + '" onChange="unitChange(this);" size="1" tabindex="' + (_tabindex++) + '"></select>');
		_unit.append('<option id="unit-null" value="-" selected>' + getMessage(8) + '</option>');
		for (var _row = 0; _row < Q_Units.length; _row++) {
			var _unitItem = Q_Units[_row];
			_unit.append('<option id="unit-' + _unitItem.ID + '" value="' + _unitItem.ID +'">' + textFormat(_unitItem.Label) + '</option>');
		}
		_tr.append($('<td class="unit1">').append(_unit));
		
		// Q形名を設定
		var _Q_Product = $('<select id="Q-Product-' + _index + '" size="1" tabindex="' + (_tabindex++) + '" onChange="productChange(this);" ></select>');
		_Q_Product.append('<option value="-" selected>' + getMessage(9) + '</option>');
		_tr.append($('<td class="type_name">').append(_Q_Product));
		
		// 装着台数の選択肢を設定
		var _quantity = $('<select id="Q-Quantity-' + _index + '" size="1" tabindex="' + (_tabindex++) + '" onChange="quantityChange(this);" ></select>');
		for (var quantity = 1; quantity <= maxQuantity; quantity++) {
			var option = $('<option value="' + quantity +'">' + quantity + '</option>');
			if (quantity == 1) option.attr("selected");
			_quantity.append(option);
		}
		_tr.append($('<td class="quantity">').append(_quantity));
		
		// 選定後のiQ-R形名を表示するセルを初期化
		_tr.append($('<td id="Arrow-' + _index + '" class="arrow">').html('<img class="arrowImg" src="images/arrow.png" width="20" />'));
		_tr.append($('<td id="R-Unit-' + _index + '" class="unit2">').html("&#8212;"));
		_tr.append($('<td id="R-Product-' + _index + '" class="type_name2">').html("&#8212;"));
		_tr.append($('<td id="R-Quantity-' + _index + '" class="quantity2">').html("&#8212;"));
		_tr.append($('<td id="R-Detail-' + _index + '" class="more_detail">').html("&#8212;"));
		
		// TBODYに行を追加
		$('#input').append(_tr);
	}
}

// 入力フォームと選定結果をリセット
function resetInputForm() {
	// 入力フォームをリセット
	for (var _index = 1; _index <= maxInputForm; _index++) {
		// Qユニット
		$('#Q-Unit-' + _index + ' option').removeAttr('selected');
		$('#Q-Unit-' + _index + ' option[value="-"]').attr('selected', 'selected');
		
		// Q形名
		$('#Q-Product-' + _index).empty();
		$('#Q-Product-' + _index).append($('<option value="-" selected>' + getMessage(9) + '</option>'));
		
		// Q数量
		$('#Q-Quantity-' + _index + ' option').removeAttr('selected');
		$('#Q-Quantity-' + _index + ' option[value="-"]').attr('selected', 'selected');
	}
	
	// 選定結果をリセット
	selectedPattern = [];
	resultsDraw(selectedPattern);
}

// Qシリーズ分類（ユニット）フォームの選択イベント
function unitChange(_evt) {
	// 形名候補ポップアップとコメントを非表示
	$('#popup').hide();	
	$('#comment').hide();
	$('#candidate').empty();
	
	// 選択した分類を取得
	seletedUnit = $(_evt).find('option:selected').val();
	
	// 対象のQ形名選択のプルダウンをクリア
	selectedIndex = Number($(_evt).attr('id').split("-")[2]);
	var _Q_ProductComb = $('#Q-Product-' + selectedIndex);
	_Q_ProductComb.empty();
	
	// 選定結果をクリアして再描画
	removePattern(selectedIndex);
	resultsDraw(selectedPattern);
	
	// Q形名リストを選択した分類に絞り込んでQ形名選択のプルダウンに登録
	_Q_ProductComb.append($('<option value="-" selected>' + getMessage(9) + '</option>'));
	if (seletedUnit != "-") {
		var _options = [];
		for (var _row = 0; _row < pattern.length; _row++) {
			if (pattern[_row].Unit == seletedUnit && seletedUnit != "-") {
				// Q形名の絞込み設定
				var _Q_Product = pattern[_row].Q_Product;
				if (duplicateCheck(_options, _Q_Product)) {
					_options.push(_Q_Product);
				}
			}
		}
		
		for (var _index = 0; _index < _options.length; _index++) {
			_Q_ProductComb.append($('<option value="' + _options[_index] +'">' + _options[_index] + '</option>'));
		}
	}
}

// Qシリーズ数量フォームのイベント（選定結果の数量更新）
function quantityChange(_evt) {
	// 形名候補ポップアップとコメントを非表示
	$('#popup').hide();	
	$('#comment').hide();
	
	// 選択した数量を取得
	selectedIndex = Number($(_evt).attr('id').split("-")[2]);
	var _quantityComb = $('#Q-Quantity-' + selectedIndex);
	var _quantity = Number(_quantityComb.find('option:selected').val());
	
	// 選択済みのQ形名を取得
	var _productComb = $('#Q-Product-' + selectedIndex);
	seletedQProduct = _productComb.find('option:selected').val();
	
	// Q形名が未選択の場合は終了
	if (seletedQProduct === "-") return;
	
	// 一致する選定結果の数量を更新
	for (var _index = 0; _index < selectedPattern.length; _index++) {
		if (selectedPattern[_index].inputIndex == selectedIndex) {
			selectedPattern[_index].quantity = selectedPattern[_index].pattern.R_Qty * _quantity;
		}
	}
	
	// 選定結果を再描画
	resultsDraw(selectedPattern);
}

// Qシリーズ形名フォームの選択イベント
function productChange(_evt) {
	// 形名候補ポップアップとコメントを非表示
	$('#popup').hide();	
	$('#comment').hide();
	
	// 選択したQ形名を取得
	selectedIndex = Number($(_evt).attr('id').split("-")[2]);
	var _productComb = $('#Q-Product-' + selectedIndex);
	seletedQProduct = _productComb.find('option:selected').val();
	
	// Q形名が未選択の場合は選定結果をクリアして再描画して終了
	if (seletedQProduct === "-") {
		removePattern(selectedIndex);
		resultsDraw(selectedPattern);
		return;
	}
	
	// 選択した数量取得
	var _quantityComb = $('#Q-Quantity-' + selectedIndex);
	var _quantity = Number(_quantityComb.find('option:selected').val());
	
	// R形名の選択候補リストをクリア
	var _count = 0;
	var _candidate = $('#candidate');
	_candidate.empty();
	
	// R形名候補の設定
	var _upgradeId = null;
	if (seletedQProduct !== "-") {
		var _comment = "";
		for (var _row = 0; _row < pattern.length; _row++) {
			var _id = pattern[_row].ID;
			var _set = pattern[_row].Set;
			var _Q_Product = pattern[_row].Q_Product;
			var _R_Product = pattern[_row].R_Product;
			var _R_Enabled = pattern[_row].R_Enabled;
			var _comment = pattern[_row].Comment;
			
			if (_set != "0" && _R_Enabled && _Q_Product == seletedQProduct) {
				_count++;
				_upgradeId = _id;
				
				// 数量に置換え台数を積算する
				_quantity = _quantity * pattern[_row].R_Qty;
                
                var title = (_Q_Product == "A1SCPUC24-R2") ? "Proposed Serial communication model" : "Proposed MELSEC iQ-R Series model";
				$('#candidateTitle').html(title);
				
				// 候補一覧に追加
				var _tr = $('<tr>');
				_tr.addClass((isOdd(_count)) ? "odd" : "even");
				
				// 日本語の場合のみ製品仕様ページへのリンクを付ける
				if (language == "JA") {
					_tr.append($('<td class="sub candidate"><a href="javascript:void(0)" onclick="popupDetail(\'' + _R_Product + '\'); return false;">' + _R_Product + '</a></td>'));
				} else {
					_tr.append($('<td class="sub candidate">' + _R_Product + '</td>'));
				}
				
				_tr.append($('<td class="sub choice"><input type="button" value="' + getMessage(20) + '" onclick="addUpgradeItem(' + selectedIndex + ',' + _upgradeId + ',' + _quantity + ');" /></td>'));
								
				if (_comment != "") {
					_tr.append($('<td class="sub more_detail"><a href="javascript:void(0)" onclick="popupComment(' + _upgradeId + ');return false;"><img class="info" src="images/info.png" width="24" height="25" /></a></td>'));
				} else {
					_tr.append($('<td class="sub more_detail">&#8212;</td>'));
				}
				
				_candidate.append(_tr);
			} else if (_set != "0" && !_R_Enabled && _Q_Product == seletedQProduct) {
				// エラーメッセージ用のコメント取得
				_upgradeId = _id;
				_quantity = 0;
			}
		}
		
		if (_count == 0) {
			// アップグレード対象が0件の場合は選定エラーを表示する
			addUpgradeItem(selectedIndex, _upgradeId, _quantity);
		} else if (_count == 1) {
			// アップグレード対象が1件の場合は候補を表示せずに選定結果に反映
			addUpgradeItem(selectedIndex, _upgradeId, _quantity);
		} else {
			// アップグレード対象が2件以上の場合は候補を表示する
			$('#popup').show();	
			$('#modalWindow').show();
		}
	} else {
		alert(getMessage(39));
	}
}

// R形名候補の選択イベント（選定結果の描画）
function addUpgradeItem(_inputIndex, _id, _quantity) {
	// 選択候補ポップアップ非表示
	$('#popup').hide();	
	$('#comment').hide();
	$('#modalWindow').hide();
	
	// 既存の選定パターンから同じ入力インデックスが存在する場合は削除する
	removePattern(_inputIndex);
	
	// 追加する選定パターンの絞込み
	var _pattern = findPattern(_id);
	if (_pattern != null) {
		// 組み合わせパターンを取得
		var _setArr = _pattern.Set.split(",");
		
		// 組み合わせ数を取得
		var _setCount = 0;
		if (Number(_setArr[0]) == -1) {
			// 同一ユニット×1台以上の場合
			_setCount = 1;
		} else if (Number(_setArr[0]) >= 1) {
			// 異なるユニットの組み合わせ
			_setCount = _setArr.length + 1;
		}
		
		// 選定パターン追加
		selectedPattern.push(getSelectionItem(_inputIndex, _quantity, _setCount, _pattern));
		
		// 組み合わせパターンが存在する場合は追加
		for (var _index = 0;_index < _setArr.length;_index++) {
			var _setIndex = Number(_setArr[_index]);
			if (_setIndex > 0) {
				var _setPattern = findPattern(_setIndex);
				if (_setPattern != null) {
					selectedPattern.push(getSelectionItem(_inputIndex, _quantity, 0, _setPattern));
				}
			}
		}
	}
	
	// R選定パターンの昇順ソート（入力フォームのインデックス順にソート）
	selectedPattern.sort(function(a, b) {
		if (a.inputIndex < b.inputIndex) return -1;
		if (a.inputIndex > b.inputIndex) return 1;
		return 0;
	});
	
	// iQ-Rシリーズ選定結果を描画
	resultsDraw(selectedPattern);
}

// 選定結果を描画
function resultsDraw(_selectedPattern) {
	// iQ-Rシリーズ選定リストを描画
	if (_selectedPattern != null) {
		for (var _index = 1; _index <= maxInputForm; _index++) {
			var _items = findSelectedPattern(_selectedPattern, _index);
			if (_items.length > 0) {
				for (var _index2 = 0; _index2 < _items.length; _index2++) {
					var _item = _items[_index2];
					if (_index2 == 0) {
						// 入力行を更新
						updateRow(_index, _item);
						
						// 組み合わせ選定する形名が存在する場合
						if (_item.setCount > 1) {
							// 行結合
							setRowspan(_index, _item.setCount);
						} else {
							// 行結合を解除
							resetRowspan(_index);
						}
					} else {
						// 入力行（組み合わせ行）を更新
						updateRow(_index + '-' + _index2, _item);
					}
				}
			} else {
				// 入力行をクリア
				clearRow(_index);
			}
		}
	}
	
	// 選択候補クリア
	$('#candidate').empty();
}

// 入力行のデータを更新
function updateRow(_index, _item) {
	if (_item.pattern.R_Enabled) {
		// 列結合を解除
		resetColspan(_index);
	
		$('#R-Unit-' + _index).text(_item.unitLabel_R);
		$('#R-Product-' + _index).empty();
		
		// 日本語の場合のみ製品仕様ページへのリンクを付ける
		if (language == "JA") {
			$('#R-Product-' + _index).append($('<a href="javascript:void(0)" onclick="popupDetail(\'' + _item.pattern.R_Product + '\'); return false;">' + _item.pattern.R_Product + '</a>'));
		} else {
			$('#R-Product-' + _index).append(_item.pattern.R_Product);
		}
		
		$('#R-Quantity-' + _index).text(_item.quantity);
	} else {
		// 列結合
		$('#R-Unit-' + _index).text(getMessage(12));
		$('#R-Unit-' + _index).attr('colspan', 3);
		$('#R-Product-' + _index).remove();
		$('#R-Quantity-' + _index).remove();
	}
	
	$('#R-Detail-' + _index).empty();
	if (_item.pattern.Comment != "") {
		$('#R-Detail-' + _index).append($('<a href="javascript:void(0)" onclick="popupComment(' + _item.pattern.ID + ');return false;"><img class="info" src="images/info.png" width="24" height="25" /></a>'));
	} else {
		$('#R-Detail-' + _index).html("&#8212;");
	}
}

// 入力行の値をクリア
function clearRow(_index) {
	// 列結合を解除
	resetColspan(_index);
	
	// 行結合を解除
	resetRowspan(_index);
	
	// 入力行の値をクリアする
	$('#R-Unit-' + _index).html("&#8212;");
	$('#R-Product-' + _index).html("&#8212;");
	$('#R-Quantity-' + _index).html("&#8212;");
	$('#R-Detail-' + _index).empty();
	$('#R-Detail-' + _index).html("&#8212;");
}

// 行結合
function setRowspan(_index, _setCount) {
	// 結合先の行を追加
	for (var _span = 1;_span < _setCount;_span++) {
		var _parentRow = $('#R-Unit-' + _index).parent('tr');
		var _node = $('#input').children('#SetRowId-' + _index + '-' + _span);
		if (_node.length == 0) {
			var _newRow = $('<tr id="SetRowId-' + _index + '-' + _span + '" >');
			_newRow.append($('<td id="R-Unit-' + _index + '-' + _span + '" />'));
			_newRow.append($('<td id="R-Product-' + _index + '-' + _span + '" />'));
			_newRow.append($('<td id="R-Quantity-' + _index + '-' + _span + '" />'));
			_newRow.append($('<td id="R-Detail-' + _index + '-' + _span + '" />'));
			_newRow.addClass(_parentRow.attr('class'));
			_newRow.addClass('SetRow-' + _index);
			_parentRow.after(_newRow);
		}
	}
	
	// 結合元にrowspan属性を設定
	$('#No-' + _index).attr('rowspan', _setCount);
	$('#Q-Unit-' + _index).parent('td').attr('rowspan', _setCount);
	$('#Q-Product-' + _index).parent('td').attr('rowspan', _setCount);
	$('#Q-Quantity-' + _index).parent('td').attr('rowspan', _setCount);
	$('#Arrow-' + _index).attr('rowspan', _setCount);
}

// 行結合のリセット
function resetRowspan(_index) {
	// 結合元のrowspan属性を削除
	$('#No-' + _index).removeAttr('rowspan');
	$('#Q-Unit-' + _index).parent('td').removeAttr('rowspan');
	$('#Q-Product-' + _index).parent('td').removeAttr('rowspan');
	$('#Q-Quantity-' + _index).parent('td').removeAttr('rowspan');
	$('#Arrow-' + _index).removeAttr('rowspan');
	
	// 結合先の行を削除
	$('.SetRow-' + _index).remove();
}

// 列結合のリセット
function resetColspan(_index) {
	if (typeof $('#R-Unit-' + _index).attr('colspan') !== "undefined") {
		$('#R-Unit-' + _index).removeAttr('colspan');
		$('#R-Unit-' + _index).after($('<td id="R-Quantity-' + _index + '" class="quantity2">').text("-"));
		$('#R-Unit-' + _index).after($('<td id="R-Product-' + _index + '" class="type_name2">').text("-"));
	}
}

// 入力インデックスが一致する選定結果を検索・取得する
function findSelectedPattern(_selectedPattern, _inputIndex) {
	var _items = [];
	for (var _index = 0; _index < _selectedPattern.length; _index++) {
		if (_selectedPattern[_index].inputIndex == _inputIndex) {
			_items.push(_selectedPattern[_index]);
		}
	}
	
	return _items
}

// 選定パターンアイテムを取得する
function getSelectionItem(_inputIndex, _quantity, _setCount, _pattern) {
	var _item = {
		inputIndex:_inputIndex,
		unitLabel_Q:getUnitLabel_Q(_pattern.Unit),
		unitLabel_R:getUnitLabel_R(_pattern.R_Unit),
		quantity:_quantity,
		setCount:_setCount,
		pattern:_pattern
	};
		
	return _item;
}

// 選定パターンからID属性が一致するパターンを検索する
function findPattern(_id) {
	for (var _row = 0; _row < pattern.length; _row++) {
		if (pattern[_row].ID == _id) {
			return pattern[_row];
		}
	}
	
	return null;
}

// インデックスが一致する選定結果パターンを削除する
function removePattern(_inputIndex) {
	var _isLoop;
	do {
		_isLoop = false;
		for (var _index = 0; _index < selectedPattern.length; _index++) {
			if (selectedPattern[_index].inputIndex == _inputIndex) {
				selectedPattern.splice(_index, 1);
				_isLoop = true;
				break;
			}
		}
	} while (_isLoop == true);
}

// Qシリーズの分類IDから分類名を取得する
function getUnitLabel_Q(_id) {
	for (var _row = 0; _row < Q_Units.length; _row++) 
	{
		if (Q_Units[_row].ID == Number(_id)) return Q_Units[_row].Label;
	}
	
	return getMessage(44);
}

// iQ-Rシリーズの分類IDから分類名を取得する
function getUnitLabel_R(_id) {
	for (var _row = 0; _row < R_Units.length; _row++) 
	{
		if (R_Units[_row].ID == Number(_id)) return R_Units[_row].Label;
	}
	
	return getMessage(44);
}

// 選定上の注意事項を表示
function popupComment(_id) {
	for (var _row = 0; _row < pattern.length; _row++) {
		if (pattern[_row].ID == _id) {
			var _comment = "";
			
			if (pattern[_row].R_Enabled) {
				_comment += '<p>' + (getMessage(16).replace("{0}", '<span class="red">' + pattern[_row].Q_Product + '</span>').replace("{1}", '<span class="red">' + pattern[_row].R_Product + '</span>')) + '</p>';
			} else {
				_comment += '<p>' + (getMessage(45).replace("{0}", '<span class="red">' + pattern[_row].Q_Product + '</span>')) + '</p>';
			}
			
			_comment += "<hr>";
			_comment += "<ul>";
			
			if (pattern[_row].Comment != "") {
				var _lines = pattern[_row].Comment.split("|");
				for (var _index = 0; _index < _lines.length; _index++) {
					_comment += "<li>" + textFormat(_lines[_index]) + "</li>";
				}					
			} else {
				_comment += "<li>" + getMessage(40) + "</li>";
			}
			
			_comment += "</ul>";
			
			$('#commentText').html(_comment);
			
			$('#comment').show();
			$('#modalWindow').show();
			break;
		}
	}
}

// テキストの特殊文字をコードに置換え
function textFormat(_txt) {
	_txt = _txt.replace(/⇒/g, "&#8658;");
	_txt = _txt.replace(/→/g, "&#8594;");
	_txt = _txt.replace(/~/g, "&#x301c;");
	_txt = _txt.replace(/～/g, "&#x301c;");
	_txt = _txt.replace(/µ/g, "&#181;");
	_txt = _txt.replace(/×/g, "&#215;");
	_txt = _txt.replace(/■/g, "&#9632;");
	_txt = _txt.replace(/□/g, "&#9633;");
	_txt = _txt.replace(/―/g, "&#8212;");
	_txt = _txt.replace(/Ⓡ/g, "&#174;");
	_txt = _txt.replace(/™/g, "&#8482;");
	_txt = _txt.replace(/㎡/g, "m<sup>2</sup>");

	return _txt;
}

// 候補選択ポップアップを閉じる（候補選択のキャンセル）
function closePopup() {
	// 候補選択ポップアップとモーダル背景を消す
	$('#popup').hide();	
	$('#modalWindow').hide();
	
	// 候補選択テーブルをクリア
	$('#candidate').empty();
}

// コメントポップアップを閉じる
function closeComment() {
	// コメントポップアップを消す
	$('#comment').hide();
	
	// コメント内容をクリア
	$('#commentText').empty();
	
	// 候補選択ポップアップが開いている場合はモーダル背景を消さない
	if ($('#popup').css('display') == "none") $('#modalWindow').hide();
}

// 構成リストポップアップを閉じる
function closeDatatable() {
	// 構成リストポップアップとモーダル背景を消す
	$('#datatable').hide();
	$('#modalWindow').hide();
	
	// 構成リストテーブルをクリア
	$('#ConfigListBody').empty();
}

// Rシリーズ形名の詳細ページ（FAサイト）を表示する
function popupDetail(_product) {
	if (_product != "" && _product != null && typeof _product != "undefind") {
		//var url = "https://www.mitsubishielectric.co.jp/fa/products/faspec/point.do?kisyu=plcr&formNm=@&popup=1&ref=q2rmgr".replace("@", _product);
   		var url = "/fa/products/faspec/point.do?kisyu=plcr&formNm=@&popup=1&ref=q2rmgr".replace("@", _product);
				
		if (url && url.indexOf("formNm=@") == -1) {
			var win = window.open(url, "popup", "width=" + 850 + ",height=" + 600 + ",toolbar=no,location=yes,status=no,scrollbars=yes");
		}
	} else {
		alert(getMessage(41));	
	}
}

// 重複データのチェック（空値/NULL）
function duplicateCheck(_list, _data) {
	for (var _index = 0;_index < _list.length;_index++) {
		if(_list[_index] == _data || _list[_index] == "" || _list[_index] == null) return false;
	}
	return true
}

// エラーメッセージ表示
function faild(_errorInfo) {
	// エラーメッセージを取得
	var _message = getMessage(38);
	if (_message == "none") _message = "Failed to start Migration tool."; // デフォルトは英語メッセージ
	
	// エラーメッセージを描画
	$("#message").html('<p>' + _message + '<br>' + _errorInfo + '</p>');
	$("#message").show();
}

// 日本円金額表示フォーマット
function priceFormat(_price) {
	if (isNaN(Number(_price)) || Number(_price) == 0) return '&#8212;';
	if (Number(_price) == -1) return getMessage(43);
	return '&yen;' + Number(_price).toLocaleString();
}

// 日本円金額表示フォーマット CSV用
function priceFormatCSV(_price) {
	if (isNaN(Number(_price)) || Number(_price) == 0) return '―';
	if (Number(_price) == -1) return getMessage(43);
	return String(_price);
}

// 数量表示フォーマット
function quantityFormat(_quantity) {
	if (isNaN(Number(_quantity)) || Number(_quantity) == 0) return '&#8212;';
	return _quantity;
}

// 構成リストの表示
function openConfigListWindow() {
	if (selectedPattern != null && selectedPattern.length > 0) {
		$('#datatable').show();
		$('#modalWindow').show();
		loadListData();
	} else {
		alert(getMessage(13));	
	}
}

// 偶数 or 奇数 行の判断
function isOdd(_count) {
	return (_count % 2 != 0);	
}

//------------------------------------------------

// 変数宣言
var total = 0;
var dataTable = [];

// 親ウィンドウから選定パターンを読み込んで構成リストを描画
function loadListData()
{
	// 初期化
	total = 0;
	dataTable = [];
	$('#ConfigListBody').empty();
	
	// 親ウィンドウから選定パターン読込み
	var _data = selectedPattern;
	_data.sort(function(a, b) {
		if (Number(a.inputIndex) < Number(b.inputIndex)) return -1;
		if (Number(a.inputIndex) > Number(b.inputIndex)) return 1;
		return 0;
	});
	
	var _count = 0;
	if (_data != null && _data.length > 0) {
		for (var _row = 0; _row < _data.length; _row++) {
			try {
				// 小計計算
				var _subtotal = (_data[_row].pattern.R_Price * _data[_row].quantity);
				if (_subtotal < 0) _subtotal = 0; // オープン価格（-1）対策
				
				if (_data[_row].setCount != 0) _count++;
				
				// 構成リストの行データ生成
				var _rowData = {
					count:_count,
					col0:_data[_row].unitLabel_Q,
					col1:_data[_row].pattern.Q_Product,
					col2:_data[_row].pattern.Q_Price,
					col3:_data[_row].unitLabel_R,
					col4:_data[_row].pattern.R_Product,
					col5:_data[_row].pattern.R_Price,
					col6:_data[_row].quantity,
					col7:_subtotal,
					col8:_data[_row].pattern.Comment,
					setCount:_data[_row].setCount
				};
				
				// 行データの追加または更新
				var _index = getDuplicateRow(dataTable, _rowData);
				if (_index > -1) {
					// 重複行がある場合は数量と小計を更新
					dataTable[_index].col6 += _rowData.col6;	
					_subtotal = (dataTable[_index].col5 * dataTable[_index].col6);
					if (_subtotal < 0) _subtotal = 0; // オープン価格（-1）対策
					dataTable[_index].col7 = _subtotal;
				} else {
					// 重複行がない場合は行追加
					dataTable.push(_rowData);
				}				
			} catch(e) {
				alert(getMessage(42) + "\n" + e.message);
			}
		}
		
		// 構成リストの描画
		var _count = 0;
		for (var _row = 0; _row < dataTable.length; _row++) {
			// 行の描画
			if (dataTable[_row].setCount > 0) _count++;
			$('#ConfigListBody').append(getTableRow(dataTable[_row], isOdd(_count)));
			
			// 合計価格の計算
			total += dataTable[_row].col7;
			
			// 最終行に合計価格を描画（日本語のみ表示）
			if (language == "JA") {
				if (_row == dataTable.length - 1) {
					$('#ConfigListBody').append(getTableTotalRow(total));
				}
			}
		}
	} else {
		alert(getMessage(13));	
	}
}

// 重複行の検索
function getDuplicateRow(_dataTable, _rowData) {
	var _index = -1;
	for (var _row = 0; _row < _dataTable.length; _row++) {
		if (_dataTable[_row].col1 == _rowData.col1 && _dataTable[_row].col4 == _rowData.col4) {
			_index = _row;
			break;
		}
	}
	
	return _index;
}

// 構成リストテーブルの行を取得する
function getTableRow(_row, _isOdd) {
	// 行の作成
	var _tr = $('<tr>');
	if (_isOdd !== null) _tr.addClass((_isOdd) ? "odd" : "even");
	
	try {
		// No.
		if (_row.setCount == 1) {
			_tr.append($('<td class="col-0">').append(_row.count));
		} else if (_row.setCount > 1) {
			_tr.append($('<td class="col-0" rowspan="' + _row.setCount + '">').append(_row.count));
		}
		
		// Qシリーズユニット
		var _Q_Unit = textFormat(_row.col0);
		if (_row.setCount == 1) {
			_tr.append($('<td class="col-1">').append(_Q_Unit));
		} else if (_row.setCount > 1) {
			_tr.append($('<td class="col-1" rowspan="' + _row.setCount + '">').append(_Q_Unit));
		}
		
		if (_row.setCount == 1) {
			// Qシリーズ形名
			_tr.append($('<td class="col-2">').append(_row.col1));
			
			// Qシリーズ標準価格（日本語のみ表示）
			if (language == "JA") _tr.append($('<td class="col-3">').append(priceFormat(_row.col2)));
		} else if (_row.setCount > 1) {
			// Qシリーズ形名
			_tr.append($('<td class="col-2" rowspan="' + _row.setCount + '">').append(_row.col1));
			
			// Qシリーズ標準価格（日本語のみ表示）
			if (language == "JA") _tr.append($('<td class="col-3" rowspan="' + _row.setCount + '">').append(priceFormat(_row.col2)));
		}
		
		// iQ-Rシリーズ形名
		_tr.append($('<td class="col-4">').append(_row.col4));
		
		// iQ-Rシリーズ標準価格（日本語のみ表示）
		if (language == "JA") _tr.append($('<td class="col-5">').append(priceFormat(_row.col5)));
		
		// 数量
		_tr.append($('<td class="col-6">').append(quantityFormat(_row.col6)));
		
		// 小計（日本語のみ表示）
		if (language == "JA") _tr.append($('<td class="col-7">').append(priceFormat(_row.col7)));
		
		// 注意事項
		var _comment = textFormat(_row.col8).split("|").join("<br>");
		if (_comment == "") _comment = "&nbsp;"; // 注意事項が存在しない場合は空白コードを入れる
		_tr.append($('<td class="col-8">').append(_comment));
	} catch(e) {
		_tr = null;	
	}
	
	return _tr;
}

// 構成リストテーブルの合計価格を表示する最終行を取得する
function getTableTotalRow(_price) {
	// 行の作成
	_tr = $('<tr class="total">');
	
	try {
		// 空白
		_tr.append($('<td colspan="7">').append(getMessage(36)));
		
		// 合計価格
		_tr.append($('<td class="col-7">').append(priceFormat(_price)));
		
		// 注意事項
		_tr.append($('<td class="col-8">').append(""));
	} catch(e) {
		_tr = null;	
	}
	
	return _tr;
}

// 構成リストの印刷
function listPrinting() {
	// 印刷エリアをクリア
	$('#PrintArea').empty();
	$('#ImageArea').show();
	
	// 印刷対象の描画
	$('#PrintArea').append('<h1>' + getMessage(26) + '</h1>');
	
	// 構成リストの描画
	var _table = getPrintTable();
	$('#PrintArea').append(_table);
	
	var _maxHeight = 1200;
	var _isRowspanStart = false;
	var _isRowspanEnd = false;
	for (var _row = 0; _row < dataTable.length; _row++) {
		// 行の描画
		var _tr = getTableRow(dataTable[_row], null);	
		
		// テーブル、行の高さ取得
		$('#ImageArea').append(_table);
		var _tableHeight = _table.height();
		$('#ImageArea').empty();
		
		$('#ImageArea').append(_tr);
		var _trHeight = _tr.height();
		$('#ImageArea').empty();
			
		var _totalHeight = _tableHeight + _trHeight;
		// -----------------------
		
		// 結合行の開始位置と終了位置を判断
		if (dataTable[_row].setCount > 1) {
			_isRowspanStart = true;
		} else if (dataTable[_row].setCount == 1) {
			if (_isRowspanStart) {
				_isRowspanStart = false;
				_isRowspanEnd = true;
			}
		}
		
		// 改ページ設定
		if (_totalHeight > _maxHeight || (dataTable[_row].setCount > 1 && _row > 0) || _isRowspanEnd) {
			$('#PrintArea').append(_table);
			$('#PrintArea').append('<h1>' + getMessage(26) + '</h1>');
			_table = getPrintTable();
			_table.find('tbody').append(_tr);		
			_isRowspanEnd = false;
		} else {
			_table.find('tbody').append(_tr);
		}
	}
	
	// 最終行に合計価格を描画（日本語のみ表示）
	if (language == "JA") _table.find('tbody').append(getTableTotalRow(total));
	
	// 構成リストを印刷領域に描画
	$('#PrintArea').append(_table);
	
	// ヘッダ、フッタを非表示
	$('.header_new').hide();
	$('.footer_new').hide();
	
	// ツール本体を非表示
	if (language == "JA") {
		$('#melfa_main_area').hide();
	} else {
		$('#melfa_contents_1col').hide();
	}
	
	$('#ImageArea').hide();
	
	// 印刷エリアを表示
	$('#PrintArea').show();
	$('#PrintDocLinkArea').show();
	
	// 印刷
	self.focus();
	self.print();
	
	// ヘッダ、フッタを表示
	$('.header_new').show();
	$('.footer_new').show();
	
	// ツール本体を表示
	if (language == "JA") {
		$('#melfa_main_area').show();
	} else {
		$('#melfa_contents_1col').show();
	}
	
	// 印刷エリアを非表示
	$('#PrintArea').hide();
	$('#PrintDocLinkArea').hide();
}

// 印刷用構成リストを取得
function getPrintTable() {
	var _table = $('<table width="100%" class="PrintConfigList page-break" cellspacing="0">');
	var _thead = $('<thead class="PrintConfigListHead">');
	var _tbody = $('<tbody class="PrintConfigListBody">');
	var _thead_tr = $('<tr>');
	_thead_tr.append('<th class="col-0">' + getMessage(46) + '</th>');
	_thead_tr.append('<th class="col-1">' + getMessage(27) + '</th>');
	_thead_tr.append('<th class="col-2">' + getMessage(28) + '</th>');
	if (language == "JA") _thead_tr.append('<th class="col-3">' + getMessage(29) + '</th>');
	_thead_tr.append('<th class="col-4">' + getMessage(30) + '</th>');
	if (language == "JA") _thead_tr.append('<th class="col-5">' + getMessage(31) + '</th>');
	_thead_tr.append('<th class="col-6">' + getMessage(32) + '</th>');
	if (language == "JA") _thead_tr.append('<th class="col-7">' + getMessage(33) + '</th>');
	_thead_tr.append('<th class="col-8">' + getMessage(34) + '</th>');
	_thead.append(_thead_tr);
	_table.append(_thead);
	_table.append(_tbody);
	
	return _table;
}

// 構成リストのCSVデータ生成
function transportCSV() {
	var _csvData     = "";			// CSVデータ
	var _titleLine   = [];			// タイトル行
	var _topLine     = [];			// ヘッダ行
	var _blankLine   = [];			// 空白行
	var _pause       = '\"\t\"';	// 区切り
	var _startLine   = '\"';		// 行開始
	var _endLine     = '\"\n';		// 行終了
	var _totalPrice  = 0;			// 合計金額
	
	// 空白行
	_blankLine = (language == "JA") ? ["", "", "", "", "", "", "", "", ""] : ["", "", "", "", "", ""];

	// タイトル行追記
	_titleLine = (language == "JA") ? [getMessage(26), "", "", "", "", "", "", "", "", ""] : [getMessage(26), "", "", "", "", "", ""];
	_csvData = _startLine + _titleLine.join(_pause) + _endLine;
	
	// ヘッダ行追記
	if (language == "JA") {
		_topLine = [getMessage(46), getMessage(27), getMessage(28), getMessage(29), (getMessage(27).replace("Q", "iQ-R")), getMessage(30), getMessage(31), getMessage(32), getMessage(33), getMessage(34)];
	} else {
		_topLine = [getMessage(46), getMessage(27), getMessage(28), (getMessage(27).replace("Q", "iQ-R")), getMessage(30), getMessage(32), getMessage(34)];
	}
	
	// 各行を結合
	_csvData += _startLine + _topLine.join(_pause) + _endLine;
	
	// ボディ行追記
	for(var _lineNum = 0; _lineNum < dataTable.length; _lineNum++) {
		// 行データ取得
		var _listLine = dataTable[_lineNum];
		
		// CSV出力時の注意事項のダブルコーテーションと改行の対策
		var _precautions = _listLine.col8;
		_precautions = _precautions.replace(/&#8220;/g, "\"\"");
		_precautions = _precautions.replace(/&#8221;/g, "\"\"");
		_precautions = _precautions.split("|").join("\n");
		
		// 行データ生成
		var _data = [];
		if (language == "JA") {
			_data = [
				_listLine.count,
				_listLine.col0,
				_listLine.col1,
				priceFormatCSV(_listLine.col2),
				_listLine.col3,
				_listLine.col4,
				priceFormatCSV(_listLine.col5),
				_listLine.col6,
				priceFormatCSV(_listLine.col7),
				_precautions
			];
		} else {
			// 日本語以外の場合は価格関連の項目を含めない
			_data = [
				_listLine.count,
				_listLine.col0,
				_listLine.col1,
				_listLine.col3,
				_listLine.col4,
				_listLine.col6,
				_precautions
			];
		}

		// 行データ追記
		_csvData += _startLine + _data.join(_pause) + _endLine;
	}

	// 空行追記
	_csvData += _startLine + _blankLine.join(_pause) + _endLine;

	// 合計金額行の追記（日本語のみ追加）
	if (language == "JA") {
		var _priceLine   = ["", "", "", "", "", "", "", getMessage(36), total, ""];	
		_csvData += _startLine + _priceLine.join(_pause) + _endLine;
	}

	// クリップボードへCSVデータをコピーする
	clipboardCopy(_csvData);
	
	// 完了メッセージ
	alert(getMessage(25));
}

// クリップボードコピー
function clipboardCopy(_text) {
	// テキストエリアを用意して値をセット
	var _copyFrom = document.createElement("textarea");		
	_copyFrom.textContent = _text;
	
	// 最小サイズに設定
	var _style = _copyFrom.style;
	_style.height = "0";
	_style.width = "0";

	// bodyタグ要素の子要素にテキストエリア描画
	var _bodyElm = document.getElementsByTagName("body")[0];
	_bodyElm.appendChild(_copyFrom);

	// テキストエリアを選択
	_copyFrom.select();
	
	// コピーコマンドを実行
	var _retVal = document.execCommand('copy');
	
	// テキストエリアを削除
	_bodyElm.removeChild(_copyFrom);
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */