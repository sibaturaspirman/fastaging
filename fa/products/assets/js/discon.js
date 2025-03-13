/**
 * @fileOverview discon.js
 */

(function($) {
	'use strict';

	//===================================== document ready
	$(function() {
		loadScriptTooltip();
		setBorderComb();
		imgSizeChange();

		// パンくずナビ生成（旧ヘッダーから要素抽出）
		const $breadcrumb = $('.c-breadcrumb');
		const $breadcrumbList = $breadcrumb.find('.c-breadcrumb__list');
		const $breadcrumbBefore = $('.c-breadcrumb--before');
		if($breadcrumbBefore.length > 0) {
			const $searchPankuzuListItems = $breadcrumbBefore.find('#search_pankuzu li');
			const kisyuTopObject = {
				'name': $searchPankuzuListItems.eq(3).find('a').text(),
				'link': $searchPankuzuListItems.eq(3).find('a').attr('href')
			}
			const $breadcrumbListHTML = `
				<li class="c-breadcrumb__list-item"><a href="/fa/">${productsLabels.top}</a></li>
				<li class="c-breadcrumb__list-item"><a href="/fa/products/index.html">${productsLabels.products}</a></li>
				<li class="c-breadcrumb__list-item"><a href="${kisyuTopObject.link}">${kisyuTopObject.name}</a></li>
				<li class="c-breadcrumb__list-item"><span>${productsLabels.discon}</span></li>
			`;
			$breadcrumbList.html($breadcrumbListHTML);
			$breadcrumbBefore.remove();
		}

		saveSelectState();
	});
})(window.jQuery3_6 || jQuery);


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

function saveSelectState() {
	var path = location.pathname;
	var SEP = "__SEP__";
	var params = document.location.search.substring(1).split("&");
	var cookieValue = new Array;
	if (params.length) {
		for ( var i = 0; i < params.length; i++) {
			cookieValue.push(params[i]);
			if (i < params.length - 1) {
				cookieValue.push(SEP);
			}
		}
	} else {
		cookieValue.push(document.location.search.substring(1));
	}
	document.cookie = "fa_search_url=" + encodeURIComponent(path + "##" + cookieValue.join("")) + "; path=/fa/products/faspec; Secure";
}

/**
 * クラス指定されたテーブル項目の結合（罫線を消す）
 */
function setBorderComb() {
	$('.lcomb').each(function() {
		$(this).css('border-left', 'none');
	});
	$('.tcomb').each(function() {
		$(this).css('border-top', 'none');
	});
	$('td').each(function() {
		var rowCnt = $(this).parent("tr").parent("thead,tbody")
				.parent("table")[0].rows.length;
		var rowIndex = $(this).parent("tr")[0].rowIndex;
		var cellIndex = this.cellIndex;
		if (rowCnt > rowIndex + 1) {
			var obj = $(this).parent("tr")
					.parent("thead,tbody").parent("table")[0].rows[rowIndex + 1].cells[cellIndex];
			if (obj.className.indexOf("tcomb") != -1) {
				$(this).css('border-bottom', 'none');
			}
		}
	});
}

function loadScriptTooltip() {
	productTooltip();
}

function imgSizeChange() {

	//縦横サイズの閾値
  	const maxWidth = 350;
  	const maxHeight = 200;
  	
  	//表内データ 一覧情報
  	$('.table_full tbody tr td').children('img').each(function() {

		//画像サイズを取得
		var imgWidth = $(this)[0].naturalWidth;
		var imgHeight = $(this)[0].naturalHeight;
		var filePath = $(this).attr("src");

		//閾値を超えていればサイズ指定
		if( imgWidth > maxWidth || imgHeight > maxHeight ){
		
			//比率を合わせる
			while(imgWidth > maxWidth || imgHeight > maxHeight){
				if (imgHeight > maxHeight){
					imgWidth = (maxHeight / imgHeight) * imgWidth;
					imgHeight = maxHeight;
				}
				if (imgWidth > maxWidth){
					imgHeight = (maxWidth / imgWidth) * imgHeight;
					imgWidth = maxWidth;
				}
			}
			
			$(this).attr('width', imgWidth);
			$(this).attr('height', imgHeight);
			$(this).wrap('<p><a href="javascript:tablePicture(\'' + filePath + "\')\"></a></p>");
			var parent = $(this).parent().parent();
			parent.after('<p><a href="javascript:tablePicture(\'' + filePath + "\')\"><img class=\"icon\" src=\"/fa/shared/common/img/icon/icon_zoom_txt.svg\" width=\"40\" height=\"12\" alt=\"Zoom\"></img></a></p>");
			parent.parent().children('p').wrapAll('<div class="outlineimg"></div>');
		}
	});
}

// 画像拡大
function tablePicture(src) {
	// 画像サイズを取得
	var img = new Image();
	img.src = src;
	var viewH = img.height + 10;

	var new_window;
	new_window = window.open("", "_blank", "width=" + img.width + ",height="
			+ viewH + ",menubar=no, toolbar=no, resizable=yes, scrollbars=yes");
	new_window.document.open();
	new_window.document.write("<html><head><title>");
	new_window.document.write("Discontinued Image window｜Mitsubishi Electric FA");
	new_window.document.write("</title>");
	new_window.document.write("<style type=\"text/css\">");
	new_window.document.write("<!--");
	new_window.document.write("div { height:20px; text-align:center;}");
	new_window.document.write("div a{ text-decoration:none; color:#ffffff;}");
	new_window.document.write("-->");
	new_window.document.write("</style>");
	new_window.document.write("<script type=\"text/javascript\">");
	new_window.document.write("window.onload=function(){document.title=\"");
	new_window.document.write("Discontinued Image window｜Mitsubishi Electric FA");
	new_window.document.write("\"};");
	new_window.document.write("</script>");
	new_window.document.write("</head>");
	new_window.document.write("<body style=margin:0;padding:0;border:0;>");
	new_window.document.write("<img src=" + img.src
			+ " alt='Extended image' title='Extended image' />");
	new_window.document.write("<div>");
	new_window.document
			.write("<a href=\"#\" onClick=\"window.close(); return false;\">");
	new_window.document
			.write("<img src=\"/fa/shared/img/module/btn_close.gif\" width=\"58\" height=\"18\" alt=\"Close\" title='Close' />\n");
	new_window.document.write("</div>");
	new_window.document.write("<" + "/body>");
	new_window.document.write("<" + "/html>");
	new_window.document.close();
}

/**
* product用ツールチップの設定
*/
function productTooltip() {
	var $tooltipArea = $('[data-js-product-tooltip], .melfa_table');
	var tooltipControlSelector = '[data-js-product-tooltip-control], .table_full';
	var $tooltipControlArea = $(tooltipControlSelector);
	var posTLclassName = 'is-lt';
	var posTCclassName = 'is-ct';
	var posTRclassName = 'is-rt';
	var posBLclassName = 'is-lb';
	var posBCclassName = 'is-cb';
	var posBRclassName = 'is-rb';
	var arrowMargin = 10;
	var br = false;
	var agent = window.navigator.userAgent.toLowerCase();
	if (agent.indexOf("msie") != -1 || agent.indexOf("trident") != -1) {
		br = true;
	} else if (agent.indexOf("edg") != -1 || agent.indexOf("edge") != -1) {
		br = false;
	}

	//-------------------------------------------------
	// Constructor
	//-------------------------------------------------
	(function () {
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
		$tooltipTrigger.each(function () {
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
		$tooltipTrigger.on('mouseover', function (e) {
			var $targetTrigger = $(e.currentTarget);
			var $targetWrapper = $targetTrigger.closest('.melfa_tooltip');
			var $targetContent = $targetWrapper.find('.melfa_tooltip_contents');

			//吹き出しの新領域を追加
			var $targetHTML = $targetContent[0].innerHTML;
			var $outlineWrapper = $targetTrigger.closest('.melfa_table');
			$outlineWrapper.prepend('<div class="melfa_tooltip_contents">' + $targetHTML + '</div>');
			var $outlineContent = $outlineWrapper.children('.melfa_tooltip_contents');
			$outlineContent.css("display", "block");

			var isContolArea =
				$targetTrigger.closest(tooltipControlSelector).length > 0
					? true
					: false;

			if (isContolArea) {
				_setPos($targetTrigger, $outlineContent);
			}
		});

		$tooltipTrigger.on('mouseout', function (e) {
			var $targetTrigger = $(e.currentTarget);
			var $outlineWrapper = $targetTrigger.closest('.melfa_table');
			var $outlineContent = $outlineWrapper.children('.melfa_tooltip_contents');
			$outlineContent.remove();
		});
	}

	/**
	* _setPos()：ポジション調整
	* @param {object} $targetTrigger 対象のトリガー
	* @param {object} $targetContent 対象のコンテンツ
	* @private
	*/
	function _setPos($targetTrigger, $targetContent) {
		var tooltipControlSelector = '[data-js-product-tooltip-control], .table_full';
		var $tooltipControlArea = $(tooltipControlSelector);

		var triggerWidth = $targetTrigger.outerWidth();
		var contentWidth = $targetContent.outerWidth();
		var contentHeight = $targetContent.outerHeight() + arrowMargin;

		var tooltipAreaBounds = $tooltipControlArea.get(0).getBoundingClientRect();
		var tooltipAreaTop = tooltipAreaBounds.top;
		var tooltipAreaBot = tooltipAreaBounds.bottom;
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

		var isTopPos;
		if (br) {
			isTopPos = tooltipAreaTop + 102 > triggerTop - contentHeight ? false : true;
		} else {
			isTopPos = tooltipAreaTop + 70 > triggerTop - contentHeight ? false : true;
		}


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
				$targetTrigger.addClass(posTRclassName);
				$targetContent.width(triggerCenter - tooltipAreaLeft - 30);

				if (br) {
					tmpTopPos = tooltipAreaTop + 102 > triggerTop - contentHeight ? false : true;
					if (!(tmpTopPos)) {
						do {
							$targetContent.css('font-size', '-=1%');
							tmptHeight = $targetContent.outerHeight() + arrowMargin;
							tmpTopPos = tooltipAreaTop + 102 > triggerTop - tmptHeight ? false : true;
						} while (!(tmpTopPos));
					}
				} else {
					$targetContent.css('font-size', '10px');
					var size = 100;
				}
			}

			$targetContent.offset({ top: $targetTrigger.offset().top - $targetContent.outerHeight() - arrowMargin, left: $targetTrigger.offset().left - 0.5 * $targetContent.outerWidth() + 0.5 * arrowMargin });
		}
	}
}