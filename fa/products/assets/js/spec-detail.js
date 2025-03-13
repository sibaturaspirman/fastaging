/**
 * @fileOverview spec-deteil.js
 */

// 新システムに移行済みの機種ページか判定
const isDotPage = document.location.href.indexOf('.page') !== -1;

// 言語対応
const specSearchLabels = {};
if (document.documentElement.lang.indexOf('ja') !== -1) {
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

if (isDotPage) {
	// console.log('新システム');

	(function ($) {
		'use strict';

		// ページ読み込み時に横スクロールコントロールの表示制御
		// jQuery3系では、document.ready内でのloadイベントが動作しない場合があるため、外部に分離
		$(window).on('load.scrollControl', function() {
			$(".dataTable").each(function () {
				var divId = $(this).attr('id');
				if (divId == null) {
					return;
				}
				var tableNo = divId.substring(divId.indexOf('_'));

				// スクロール対象の横幅が表示領域より大きいか判定
				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});

		//===================================== document ready
		$(function () {
			selectUA(0);
			initScrollCtl();
			setBorderComb();
			resizeWindow();
			loadScriptTooltip();
			setBorderCombSpec();
			imgSizeChange();

			// パンくずナビ生成（旧ヘッダーから要素抽出）
			const $breadcrumb = $('.c-breadcrumb');
			const $breadcrumbList = $breadcrumb.find('.c-breadcrumb__list');
			const $breadcrumbBefore = $('.c-breadcrumb--before');
			if ($breadcrumbBefore.length > 0) {
				const $searchPankuzuListItems = $breadcrumbBefore.find('#search_pankuzu li');
				const kisyuTopObject = {
					'name': $searchPankuzuListItems.eq(3).find('a').text(),
					'link': $searchPankuzuListItems.eq(3).find('a').attr('href')
				}
				const kisyuSpecObject = {
					'name': $searchPankuzuListItems.eq(5).find('a').text(),
					'link': $searchPankuzuListItems.eq(5).find('a').attr('href')
				}
				const productModelObject = {
					'name': $searchPankuzuListItems.last().text()
				}
				const $breadcrumbListHTML = `
					<li class="c-breadcrumb__list-item"><a href="/fa/">${productsLabels.top}</a></li>
					<li class="c-breadcrumb__list-item"><a href="/fa/products/index.html">${productsLabels.products}</a></li>
					<li class="c-breadcrumb__list-item"><a href="${kisyuTopObject.link}">${kisyuTopObject.name}</a></li>
					<li class="c-breadcrumb__list-item"><a href="${kisyuSpecObject.link}">${productsLabels.spec}</a></li>
					<li class="c-breadcrumb__list-item"><span>${productModelObject.name}</span></li>
					`;
				$breadcrumbList.html($breadcrumbListHTML);
				$breadcrumbBefore.remove();
			}
		});
	})(window.jQuery3_6 || jQuery);

	var referrerCookie = "";
	var scrollObj = null;
	var timer = null;
	var compForm;
	var mainForm;

	function imgSizeChange() {

		//縦横サイズの閾値
		const maxWidth = 350;
		const maxHeight = 200;

		//表内データ 一覧情報
		$('table > tbody > tr > td img').each(function () {

			//画像サイズを取得
			var imgWidth = $(this)[0].naturalWidth;
			var imgHeight = $(this)[0].naturalHeight;
			var filePath = $(this).attr("src");

			//一覧情報 閾値を超えていればサイズ指定
			if (imgWidth > maxWidth || imgHeight > maxHeight) {

				//比率を合わせる
				while (imgWidth > maxWidth || imgHeight > maxHeight) {
					if (imgHeight > maxHeight) {
						imgWidth = (maxHeight / imgHeight) * imgWidth;
						imgHeight = maxHeight;
					}
					if (imgWidth > maxWidth) {
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
			//表示状態にする
			$(this).css('visibility', 'visible');
		});
		selectUA(3);
	}

	//現行MTC系のスクリプトのまねっこ
	function JS_ZugaAutoSize(a_objImg, a_ViewWidth) {
		var nImageWidth = a_objImg.width;
		var nImageHeight = a_objImg.height;
		var nImageAspectH = nImageWidth / nImageHeight;
		var nImageAspectW = nImageHeight / nImageWidth;

		if (nImageWidth == 0 || nImageHeight == 0) {
			a_objImg.width = a_ViewWidth;
			return;
		}
		a_objImg.width = a_ViewWidth;
		a_objImg.height = parseInt(a_ViewWidth * nImageAspectW, 10);
	}

	// 表内画像拡大
	function tableImg() {
		$(window).on('load', function () {
			$(".tableimg").hover(function () {
				$(this).stop().animate({
					width: (500)
				}, "normal", "swing");
			}, function () {
				$(this).stop().animate({
					width: (100)
				}, "normal", "swing");
			});
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
		new_window.document.write("Specification information Image window Mitsubishi Electric F.A.");
		new_window.document.write("</title>");
		new_window.document.write("<style type=\"text/css\">");
		new_window.document.write("<!--");
		new_window.document.write("div { height:20px; text-align:center;}");
		new_window.document.write("div a{ text-decoration:none; color:#ffffff;}");
		new_window.document.write("-->");
		new_window.document.write("</style>");
		new_window.document.write("<script type=\"text/javascript\">");
		new_window.document.write("window.onload=function(){document.title=\"");
		new_window.document.write("Specification information Image window Mitsubishi Electric F.A.");
		new_window.document.write("\"};");
		new_window.document.write("</script>");
		new_window.document.write("</head>");
		new_window.document.write("<body style=margin:0;padding:0;border:0;>");
		new_window.document.write("<img src=" + img.src
			//			+ " width=100% alt='拡大画像' title='拡大画像' />");
			+ " alt='Extended image' title='Extended image' />");
		new_window.document.write("<div>");
		new_window.document
			.write("<a href=\"#\" onClick=\"window.close(); return false;\">");
		new_window.document
			.write("<img src=\"/fa/shared/img/module/bt_close_bunrui.gif\" width=\"58\" height=\"18\" alt=\"Close\" title='Close' />\n");
		new_window.document.write("</div>");
		new_window.document.write("<" + "/body>");
		new_window.document.write("<" + "/html>");
		new_window.document.close();
	}

	// 画像拡大
	function subPicture(src, lp2, lp3) {
		// 画像サイズを取得
		var img = new Image();
		var userAgent = window.navigator.userAgent.toLowerCase();
		if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) { // IEの場合
			src = escape(src)
			src = decodeURI(src);
			lp2 = escape(lp2)
			lp2 = decodeURI(lp2);
			lp3 = escape(lp3)
			lp3 = decodeURI(lp3);
		}
		src = encodeURI(src);
		img.src = src;
		var viewH = img.height + 10;
		var windowTitle = "";
		if (lp3 = "") {
			windowTitle = "Products Image window " + lp2 + " Mitsubishi Electric F.A.";
		} else {
			windowTitle = "Image window " + lp3 + " Search for products " + lp2 + " Mitsubishi Electric F.A.";
		}

		var new_window;
		new_window = window.open("", "_blank", "width=" + img.width + ",height="
			+ viewH + ",menubar=no, toolbar=no, resizable=yes, scrollbars=yes");
		new_window.document.open();
		new_window.document.write("<html><head><title>");
		new_window.document.write(windowTitle);
		new_window.document.write("</title>");
		new_window.document.write("<style type=\"text/css\">");
		new_window.document.write("<!--");
		new_window.document.write("div { height:20px; text-align:center;}");
		new_window.document.write("div a{ text-decoration:none; color:#ffffff;}");
		new_window.document.write("-->");
		new_window.document.write("</style>");
		new_window.document.write("<script type=\"text/javascript\">");
		new_window.document.write("window.onload=function(){document.title=\"");
		new_window.document.write(windowTitle);
		new_window.document.write("\"};");
		new_window.document.write("</script>");
		new_window.document.write("</head>");
		new_window.document.write("<body style=margin:0;padding:0;border:0;>");
		new_window.document.write("<img src=" + src
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

	function setDivWidth() {
		$('div.dataTable').each(function () {
			if ($(this).width() > $(this).children("table").width()) {
				$(this).width($(this).children("table").width() + 2);
				$(this).removeClass("dataTable");
				$(this).addClass("dataTable2");
			}
		});
	}

	function scrollButtonEnable(tableNo) {
		var leftPos = $("#d" + tableNo).scrollLeft();
		var divWidth = $("#d" + tableNo).width();
		var leftPosEnd = Math.floor($("#d" + tableNo).children("table").width() - divWidth);

		if (leftPos > 0) {
			$("#fs" + tableNo + " ul li.scroll_back a.off_button").css("display",
				"none");
			$("#fs" + tableNo + " ul li.scroll_back a.on_button").css("display",
				"block");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
				"none");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
				"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_back a.off_button").css("display",
				"block");
			$("#fs" + tableNo + " ul li.scroll_back a.on_button").css("display",
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

	function viewFloatScroll(objId) {
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

	function hideFloatScroll(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		$(floatId).css("display", "none");
	}

	// ウィンドウリサイズ対策
	function resizeWindow() {
		var timer = false;
		$(window).on('resize', function () {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function () {
				selectUA(3);
				setTimeout(function () {
					timer = false;
				}, 0);
			}, 200);
		});
	}

	function setBorderComb() {
		$('.lcomb').each(function () {
			$(this).css('border-left', 'none');
			$(this).prev().css('border-right', 'none');
		});
		$('.deviceTable .tcomb').each(function () {
			$(this).css('border-top', 'none');
		});
		$('.deviceTable td').each(function () {
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

	// URLのクエリを取得する
	function getUrlParams() {
		var result = new Object();
		var temp_params = window.location.search.substring(1).split('&');
		for (var i = 0; i < temp_params.length; i++) {
			var param = temp_params[i].split('=');
			result[param[0]] = param[1];
		}
		return result;
	}

	function isDispScrollBar(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var divWidth = parseInt($(objId).css('width'));
		var tblWidth = parseInt($('#t2' + tableNo).css('width'));
		if ((tblWidth - divWidth) > 1) {
			return true;
		} else {
			return false;
		}
	}

	function initScrollCtl() {
		$(".dataTable").each(function () {
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
			$(floatId + ' .scroll_back a').on('click', function () {
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
			$(window).on('scroll.scrollControl resize.scrollControl', function() {				
				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});
	}

	function dummyReplace() {
		// 要素内の文字列をnbsp
		$('td').each(function () {
			var txt = $(this).html();
			$(this).html(txt.replace(/!DUMMY!/g, '&nbsp;'));
		});
	}

	function setMaxHeight(cells1, cells2, hmax1, hmax2, msize, rspn) {
		var maxHeight = hmax1;
		if (hmax1 < hmax2) {
			maxHeight = hmax2;
		}
		maxHeight = Math.ceil(maxHeight) + msize;
		for (var j = 0, m = cells1.length; j < m; j++) {
			if (cells1.eq(j).attr(rspn) == null || cells1.eq(j).attr(rspn) == "1") {
				cells1.eq(j).height(maxHeight);
			}
		}
		for (var j = 0, m = cells2.length; j < m; j++) {
			if (cells2.eq(j).attr(rspn) == null || cells2.eq(j).attr(rspn) == "1") {
				cells2.eq(j).height(maxHeight);
			}
		}
		return maxHeight;
	}

	function getMaxHeight(cells, rspn) {
		var hmax = 0;
		for (var j = 0, m = cells.length; j < m; j++) {
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

	function makeRowHeight(objId1, objId2, msize) {
		var tr1 = $(objId1 + " tr");// 全行を取得
		var tr2 = $(objId2 + " tr");// 全行を取得
		var rspn = "rowspan";

		for (var i = 0, l = tr1.length; i < l; i++) {
			var cells1 = tr1.eq(i).children();// 1行目から順にth、td問わず列を取得
			var cells2 = tr2.eq(i).children();// 1行目から順にth、td問わず列を取得

			if (msize > 0) {
				for (var j = 0, m = cells1.length; j < m; j++) {
					if (cells1.eq(j).attr(rspn) == null
						|| cells1.eq(j).attr(rspn) == "1") {
						cells1.eq(j).get(0).style.height = "auto";
					}
				}
				for (var j = 0, m = cells2.length; j < m; j++) {
					if (cells2.eq(j).attr(rspn) == null
						|| cells2.eq(j).attr(rspn) == "1") {
						cells2.eq(j).get(0).style.height = "auto";
					}
				}
			}

			var hmax1 = 0;
			for (var j = 0, m = cells1.length; j < m; j++) {
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
			for (var j = 0, m = cells2.length; j < m; j++) {
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

			for (var j = 0, m = cells1.length; j < m; j++) {
				if (cells1.eq(j).attr(rspn) == null
					|| cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height(maxHeight);
				}
			}
			for (var j = 0, m = cells2.length; j < m; j++) {
				if (cells2.eq(j).attr(rspn) == null
					|| cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height(maxHeight);
				}
			}
		}

		for (var i = 0; i < tr1.length; i++) {
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
			for (var cnt = 0; cnt < 20 && hmax1 != hmax2; cnt++) {
				before = setMaxHeight(cells1, cells2, before, 0, add, rspn);

				hmax1 = getMaxHeight(cells1, rspn);
				hmax2 = getMaxHeight(cells2, rspn);
			}
		}

		dummyReplace();
	}

	function selectUA(size) {
		var ary1 = [];
		var ary2 = [];
		$('.table1').each(function (i) {
			ary1.push($(this).attr('id'));
		});
		$('.table2').each(function (i) {
			ary2.push($(this).attr('id'));
		});

		$.each(ary1, function (i) {
			makeRowHeight('#' + ary2[i], '#' + ary1[i], size);
		});
	}

	function array_key_exists(key, search) {
		if (!search
			|| (search.constructor !== Array && search.constructor !== Object)) {
			return false;
		}

		return key in search;
	}

	function getHashCookies() {
		var ret = new Array();
		var full_cookie_data = document.cookie;
		var array_cookies = full_cookie_data.split(";");
		for (var i = 0; i < array_cookies.length; i++) {
			array_cookies[i] = array_cookies[i].replace(/^ +| +$/, '');
			var tmp = array_cookies[i].split("=");
			ret[tmp[0]] = tmp[1];
		}

		return ret;
	}

	// 代替製品比較URL取得
	function getProductCompareURL() {
		var url = '';
		if (compForm.length >= 1) {
			var params = getUrlParams();
			url += 'compare.page?kisyu=' + params['kisyu'];
			for (var i = 0; i < compForm.length; i++) {
				url += '&formNm=' + encodeURIComponent(compForm[i]);
			}
			url += '&main=' + encodeURIComponent(compForm[0]);

			if (array_key_exists('preview', params)) {
				url += '&preview=' + params['preview'];
			}

			if (array_key_exists('word', params)) {
				url += '&word=' + params['word'];
			}

			if (array_key_exists('category', params)) {
				url += '&category=' + params['category'];
			}

			if (array_key_exists('id', params)) {
				url += '&id=' + params['id'];
			}

			if (array_key_exists('lang', params)) {
				url += '&lang=' + params['lang'];
			}

			url += '&popup=1'; // ポップアップで表示
		}
		return url;
	}

	// 共通制御
	$(function () {
		// referrer cookie操作
		var hash_cookies = getHashCookies();

		if (array_key_exists('fa_search_url', hash_cookies) == true
			&& hash_cookies['fa_search_url'] != undefined) {
			referrerCookie = decodeURIComponent(hash_cookies['fa_search_url']);
		}

		// ページトップ
		$(".pagetop a").click(function () {
			window.scrollTo(0, 0);
			return false;
		});

		// 別画面でpopup
		$('.popup').on('click', function () {
			var target_id = this.id;
			pop_window = window.open(this.href, target_id, "width=825,height=500,resizable=yes,location=no,scrollbars=yes");
			return false;
		});
	});

	// 比較チェックボックス
	$(function () {
		// 比較対象初期化
		var params = getUrlParams();
		var initFormNm = '';
		if (array_key_exists('formNm', params)) {
			initFormNm = params['formNm'];
		}
		compForm = [initFormNm];

		// 比較チェックボックス変更時の処理
		$('ul.comp').find('li').find('label').find('input[type="checkbox"]').change(function () {
			if ($(this).prop('checked') == true) {
				// チェックされた場合
				compForm.push($(this).val());
			} else {
				// チェックが外された場合
				compForm.splice($.inArray($(this).val(), compForm), 1);
			}

			if (compForm.length > 1) {
				// 1つ以上の代替機種にチェックされている場合(比較ボタン活性化)
				//var tag = '';
				//tag += '<a class="popup" href="';
				//tag += getProductCompareURL();
				//tag += '"><span>代替機種と仕様を比較</span></a>';

				var params = getUrlParams();
				var dataIdentifier = compForm[0];
				for (var i = 1; i < compForm.length; i++) {
					dataIdentifier += '%40%40' + compForm[i];
				}

				var tag = '';
				tag += '<a class="bullet_sprite_link" href="#"  onclick="compare(\'';
				tag += params['kisyu'];
				tag += '\',\'';
				tag += dataIdentifier;
				tag += '\')"><span>Compare replacement models and specifications</span></a>';

				$('ul.comp').find('li').find('p.btn').html(tag);
			} else {
				// チェックされていない場合(比較ボタン非活性化)
				$('ul.comp').find('li').find('p.btn').html('<span><span>Compare replacement models and specifications</span></span>');
			}
		});

	});

	function openParentWindow(argUrl, retry) {
		if (!window.opener || window.opener.closed) { // check parent window
			window.open(argUrl, "world"); // if parent window do not exist, open in new window
			window.close();
		}
		else {
			// if parent window exists, open in parent window
			try {
				// on retry try to set .location.href instead of using .open()
				if (retry) {
					window.opener.location.href = argUrl; // IE9
				} else {
					window.opener.open(argUrl, '_top');   // IE8 and all other browsers
				}
				window.close();
			} catch (e) {
				// on error retry once
				if (!retry) {
					openParentWindow(argUrl, true);
				}
			}
		}
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
		var qs = [{ type: 'hidden', name: 'formNm', value: formNm }, { type: 'hidden', name: 'kisyu', value: kisyu }, { type: 'hidden', name: 'popup', value: '1' }, { type: 'hidden', name: 'typename', value: '1' }];
		for (var i = 0; i < qs.length; i++) {
			var ol = qs[i];
			var input = document.createElement("input");
			for (var p in ol) {
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

	function loadScriptTooltip() {
		productTooltip();

	}

	/**
	* product用ツールチップの設定
	*/
	function productTooltip() {
		var $tooltipArea = $('[data-js-product-tooltip], .basic_outline');
		var tooltipControlSelector = '[data-js-product-tooltip-control], .basic_outline_detail';
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
				var $outlineWrapper = $targetTrigger.closest('.basic_outline');
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
				var $outlineWrapper = $targetTrigger.closest('.basic_outline');
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
			var tooltipControlSelector = '[data-js-product-tooltip-control], .basic_outline_detail';
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

	/**
	* クラス指定されたテーブル項目の結合（罫線を透明にする）
	*/
	function setBorderCombSpec() {

		//製品詳細(仕様)
		$('.table1 td')
			.each(
				function () {
					var rowCnt = $(this).parent("tr").parent("thead,tbody")
						.parent("table")[0].rows.length;
					var rowIndex = $(this).parent("tr")[0].rowIndex;
					var cellIndex = this.cellIndex;
					if (rowCnt > rowIndex + 1) {
						var obj = $(this).parent("tr")
							.parent("thead,tbody").parent("table")[0].rows[rowIndex + 1].cells[0];

						var currentCells = $(this).parent("tr")
							.parent("thead,tbody").parent("table")[0].rows[rowIndex].cells.length;

						if ((cellIndex == currentCells - 1) || (cellIndex == 0 && currentCells == 1)) {
							if (typeof obj !== 'undefined') {
								if (obj.className.indexOf("tcomb") != -1) {
									$(this).css('border-bottom-color', 'transparent');
								}
							}
						}
					}
				});

		//製品比較
		$('.js_full_width th')
			.each(
				function () {
					var rowCnt = $(this).parent("tr").parent("thead,tbody")
						.parent("table")[0].rows.length;
					var rowIndex = $(this).parent("tr")[0].rowIndex;
					var cellIndex = this.cellIndex;
					if (rowCnt > rowIndex + 1) {
						var obj = $(this).parent("tr")
							.parent("thead,tbody").parent("table")[0].rows[rowIndex].cells[0];

						if (typeof obj !== 'undefined') {
							if (obj.className.indexOf("tcomb") != -1) {
								$(this).css('border-top-color', 'transparent');
							}
						}
					}
				});
	}

} else {
	// console.log('現行システム');

	(function ($) {
		'use strict';

		//===================================== document ready
		$(function () {
			selectUA(0);
			initScrollCtl();
			setBorderComb();
			resizeWindow();

			// パンくずナビ生成（旧ヘッダーから要素抽出）
			const $breadcrumb = $('.c-breadcrumb');
			const $breadcrumbList = $breadcrumb.find('.c-breadcrumb__list');
			const $breadcrumbBefore = $('.c-breadcrumb--before');
			if ($breadcrumbBefore.length > 0) {
				const $searchPankuzuListItems = $breadcrumbBefore.find('#search_pankuzu li');
				const kisyuTopObject = {
					'name': $searchPankuzuListItems.eq(3).find('a').text(),
					'link': $searchPankuzuListItems.eq(3).find('a').attr('href')
				}
				const kisyuSpecObject = {
					'name': $searchPankuzuListItems.eq(5).find('a').text(),
					'link': $searchPankuzuListItems.eq(5).find('a').attr('href')
				}
				const productModelObject = {
					'name': $searchPankuzuListItems.last().text()
				}
				const $breadcrumbListHTML = `
					<li class="c-breadcrumb__list-item"><a href="/fa/">${productsLabels.top}</a></li>
					<li class="c-breadcrumb__list-item"><a href="/fa/products/index.html">${productsLabels.products}</a></li>
					<li class="c-breadcrumb__list-item"><a href="${kisyuTopObject.link}">${kisyuTopObject.name}</a></li>
					<li class="c-breadcrumb__list-item"><a href="${kisyuSpecObject.link}">${productsLabels.spec}</a></li>
					<li class="c-breadcrumb__list-item"><span>${productModelObject.name}</span></li>
					`;
				$breadcrumbList.html($breadcrumbListHTML);
				$breadcrumbBefore.remove();
			}
		});
	})(window.jQuery3_6 || jQuery);

	var referrerCookie = "";
	var scrollObj = null;
	var timer = null;
	var compForm;
	var mainForm;

	//現行MTC系のスクリプトのまねっこ
	function JS_ZugaAutoSize(a_objImg, a_ViewWidth) {
		var nImageWidth = a_objImg.width;
		var nImageHeight = a_objImg.height;
		var nImageAspectH = nImageWidth / nImageHeight;
		var nImageAspectW = nImageHeight / nImageWidth;

		if (nImageWidth == 0 || nImageHeight == 0) {
			a_objImg.width = a_ViewWidth;
			return;
		}
		a_objImg.width = a_ViewWidth;
		a_objImg.height = parseInt(a_ViewWidth * nImageAspectW, 10);
	}

	// 表内画像拡大
	function tableImg() {
		$(window).on('load', function () {
			$(".tableimg").hover(function () {
				$(this).stop().animate({
					width: (500)
				}, "normal", "swing");
			}, function () {
				$(this).stop().animate({
					width: (100)
				}, "normal", "swing");
			});
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
		new_window.document.write("仕様情報 画像ウィンドウ｜三菱電機 FA");
		new_window.document.write("</title>");
		new_window.document.write("<style type=\"text/css\">");
		new_window.document.write("<!--");
		new_window.document.write("div { height:20px; text-align:center;}");
		new_window.document.write("div a{ text-decoration:none; color:#ffffff;}");
		new_window.document.write("-->");
		new_window.document.write("</style>");
		new_window.document.write("<script type=\"text/javascript\">");
		new_window.document.write("window.onload=function(){document.title=\"");
		new_window.document.write("仕様情報 画像ウィンドウ｜三菱電機 FA");
		new_window.document.write("\"};");
		new_window.document.write("</script>");
		new_window.document.write("</head>");
		new_window.document.write("<body style=margin:0;padding:0;border:0;>");
		new_window.document.write("<img src=" + src
			//			+ " width=100% alt='拡大画像' title='拡大画像' />");
			+ " alt='拡大画像' title='拡大画像' />");
		new_window.document.write("<div>");
		new_window.document
			.write("<a href=\"#\" onClick=\"window.close(); return false;\">");
		new_window.document
			.write("<img src=\"/fa/shared/img/module/bt_close_bunrui.gif\" width=\"58\" height=\"18\" alt=\"閉じる\" title='閉じる' />\n");
		new_window.document.write("</div>");
		new_window.document.write("<" + "/body>");
		new_window.document.write("<" + "/html>");
		new_window.document.close();
	}

	// 画像拡大
	function subPicture(src, lp2, lp3) {
		// 画像サイズを取得
		var img = new Image();
		img.src = src;
		var viewH = img.height + 10;
		var windowTitle = "";
		if (lp3 = "") {
			windowTitle = "製品情報 画像ウィンドウ" + lp2 + "｜三菱電機 FA";
		} else {
			windowTitle = "画像ウィンドウ " + lp3 + " 製品検索 " + lp2 + "｜三菱電機 FA";
		}

		var new_window;
		new_window = window.open("", "_blank", "width=" + img.width + ",height="
			+ viewH + ",menubar=no, toolbar=no, resizable=yes, scrollbars=yes");
		new_window.document.open();
		new_window.document.write("<html><head><title>");
		new_window.document.write(windowTitle);
		new_window.document.write("</title>");
		new_window.document.write("<style type=\"text/css\">");
		new_window.document.write("<!--");
		new_window.document.write("div { height:20px; text-align:center;}");
		new_window.document.write("div a{ text-decoration:none; color:#ffffff;}");
		new_window.document.write("-->");
		new_window.document.write("</style>");
		new_window.document.write("<script type=\"text/javascript\">");
		new_window.document.write("window.onload=function(){document.title=\"");
		new_window.document.write(windowTitle);
		new_window.document.write("\"};");
		new_window.document.write("</script>");
		new_window.document.write("</head>");
		new_window.document.write("<body style=margin:0;padding:0;border:0;>");
		new_window.document.write("<img src=" + src
			+ " alt='拡大画像' title='拡大画像' />");
		new_window.document.write("<div>");
		new_window.document
			.write("<a href=\"#\" onClick=\"window.close(); return false;\">");
		new_window.document
			.write("<img src=\"/fa/shared/img/module/bt_close_bunrui.gif\" width=\"58\" height=\"18\" alt=\"閉じる\" title='閉じる' />\n");
		new_window.document.write("</div>");
		new_window.document.write("<" + "/body>");
		new_window.document.write("<" + "/html>");
		new_window.document.close();
	}

	function setDivWidth() {
		$('div.dataTable').each(function () {
			if ($(this).width() > $(this).children("table").width()) {
				$(this).width($(this).children("table").width() + 2);
				$(this).removeClass("dataTable");
				$(this).addClass("dataTable2");
			}
		});
	}

	function scrollButtonEnable(tableNo) {
		var leftPos = $("#d" + tableNo).scrollLeft();
		var divWidth = $("#d" + tableNo).width();
		var leftPosEnd = Math.floor($("#d" + tableNo).children("table").width() - divWidth);

		if (leftPos > 0) {
			$("#fs" + tableNo + " ul li.scroll_back a.off_button").css("display",
				"none");
			$("#fs" + tableNo + " ul li.scroll_back a.on_button").css("display",
				"block");
			$("#fs" + tableNo + " ul li.scroll_first a.off_button").css("display",
				"none");
			$("#fs" + tableNo + " ul li.scroll_first a.on_button").css("display",
				"block");
		} else {
			$("#fs" + tableNo + " ul li.scroll_back a.off_button").css("display",
				"block");
			$("#fs" + tableNo + " ul li.scroll_back a.on_button").css("display",
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

	function viewFloatScroll(objId) {
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

	function hideFloatScroll(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var floatId = '#fs' + tableNo;
		$(floatId).css("display", "none");
	}

	// ウィンドウリサイズ対策
	function resizeWindow() {
		var timer = false;
		$(window).on('resize', function () {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function () {
				selectUA(3);
				setTimeout(function () {
					timer = false;
				}, 0);
			}, 200);
		});
	}

	function setBorderComb() {
		$('.lcomb').each(function () {
			$(this).css('border-left', 'none');
			$(this).prev().css('border-right', 'none');
		});
		$('.deviceTable .tcomb').each(function () {
			$(this).css('border-top', 'none');
		});
		$('.deviceTable td')
			.each(
				function () {
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

	// URLのクエリを取得する
	function getUrlParams() {
		var result = new Object();
		var temp_params = window.location.search.substring(1).split('&');
		for (var i = 0; i < temp_params.length; i++) {
			var param = temp_params[i].split('=');
			result[param[0]] = param[1];
		}
		return result;
	}

	function isDispScrollBar(objId) {
		var tableNo = objId.substring(objId.indexOf('_'));
		var divWidth = parseInt($(objId).css('width'));
		var tblWidth = parseInt($('#t2' + tableNo).css('width'));
		if ((tblWidth - divWidth) > 1) {
			return true;
		} else {
			return false;
		}
	}

	function initScrollCtl() {
		$(".dataTable").each(function () {
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
			$(floatId + ' .scroll_back a').on('click', function () {
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
			$(window).on('scroll.scrollControl resize.scrollControl', function() {				
				if (isDispScrollBar('#' + divId)) {
					viewFloatScroll('#h' + tableNo);
					scrollButtonEnable(tableNo);
				} else {
					hideFloatScroll('#h' + tableNo);
				}
			});
		});
	}

	function dummyReplace() {
		// 要素内の文字列をnbsp
		$('td').each(function () {
			var txt = $(this).html();
			$(this).html(txt.replace(/!DUMMY!/g, '&nbsp;'));
		});
	}

	function setMaxHeight(cells1, cells2, hmax1, hmax2, msize, rspn) {
		var maxHeight = hmax1;
		if (hmax1 < hmax2) {
			maxHeight = hmax2;
		}
		maxHeight = Math.ceil(maxHeight) + msize;
		for (var j = 0, m = cells1.length; j < m; j++) {
			if (cells1.eq(j).attr(rspn) == null || cells1.eq(j).attr(rspn) == "1") {
				cells1.eq(j).height(maxHeight);
			}
		}
		for (var j = 0, m = cells2.length; j < m; j++) {
			if (cells2.eq(j).attr(rspn) == null || cells2.eq(j).attr(rspn) == "1") {
				cells2.eq(j).height(maxHeight);
			}
		}
		return maxHeight;
	}

	function getMaxHeight(cells, rspn) {
		var hmax = 0;
		for (var j = 0, m = cells.length; j < m; j++) {
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

	function makeRowHeight(objId1, objId2, msize) {
		var tr1 = $(objId1 + " tr");// 全行を取得
		var tr2 = $(objId2 + " tr");// 全行を取得
		var rspn = "rowspan";

		for (var i = 0, l = tr1.length; i < l; i++) {
			var cells1 = tr1.eq(i).children();// 1行目から順にth、td問わず列を取得
			var cells2 = tr2.eq(i).children();// 1行目から順にth、td問わず列を取得

			if (msize > 0) {
				for (var j = 0, m = cells1.length; j < m; j++) {
					if (cells1.eq(j).attr(rspn) == null
						|| cells1.eq(j).attr(rspn) == "1") {
						cells1.eq(j).get(0).style.height = "auto";
					}
				}
				for (var j = 0, m = cells2.length; j < m; j++) {
					if (cells2.eq(j).attr(rspn) == null
						|| cells2.eq(j).attr(rspn) == "1") {
						cells2.eq(j).get(0).style.height = "auto";
					}
				}
			}

			var hmax1 = 0;
			for (var j = 0, m = cells1.length; j < m; j++) {
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
			for (var j = 0, m = cells2.length; j < m; j++) {
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

			for (var j = 0, m = cells1.length; j < m; j++) {
				if (cells1.eq(j).attr(rspn) == null
					|| cells1.eq(j).attr(rspn) == "1") {
					nowh = cells1.eq(j).height(maxHeight);
				}
			}
			for (var j = 0, m = cells2.length; j < m; j++) {
				if (cells2.eq(j).attr(rspn) == null
					|| cells2.eq(j).attr(rspn) == "1") {
					nowh = cells2.eq(j).height(maxHeight);
				}
			}
		}

		for (var i = 0; i < tr1.length; i++) {
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
			for (var cnt = 0; cnt < 20 && hmax1 != hmax2; cnt++) {
				before = setMaxHeight(cells1, cells2, before, 0, add, rspn);

				hmax1 = getMaxHeight(cells1, rspn);
				hmax2 = getMaxHeight(cells2, rspn);
			}
		}

		dummyReplace();
	}

	function selectUA(size) {
		var ary1 = [];
		var ary2 = [];
		$('.table1').each(function (i) {
			ary1.push($(this).attr('id'));
		});
		$('.table2').each(function (i) {
			ary2.push($(this).attr('id'));
		});

		$.each(ary1, function (i) {
			makeRowHeight('#' + ary2[i], '#' + ary1[i], size);
		});
	}

	function array_key_exists(key, search) {
		if (!search
			|| (search.constructor !== Array && search.constructor !== Object)) {
			return false;
		}

		return key in search;
	}

	function getHashCookies() {
		var ret = new Array();
		var full_cookie_data = document.cookie;
		var array_cookies = full_cookie_data.split(";");
		for (var i = 0; i < array_cookies.length; i++) {
			array_cookies[i] = array_cookies[i].replace(/^ +| +$/, '');
			var tmp = array_cookies[i].split("=");
			ret[tmp[0]] = tmp[1];
		}

		return ret;
	}

	// 代替製品比較URL取得
	function getProductCompareURL() {
		var url = '';
		if (compForm.length >= 1) {
			var params = getUrlParams();
			url += 'compare.do?kisyu=' + params['kisyu'];
			for (var i = 0; i < compForm.length; i++) {
				url += '&formNm=' + encodeURIComponent(compForm[i]);
			}
			url += '&main=' + encodeURIComponent(compForm[0]);

			if (array_key_exists('preview', params)) {
				url += '&preview=' + params['preview'];
			}

			if (array_key_exists('word', params)) {
				url += '&word=' + params['word'];
			}

			if (array_key_exists('category', params)) {
				url += '&category=' + params['category'];
			}

			if (array_key_exists('id', params)) {
				url += '&id=' + params['id'];
			}

			if (array_key_exists('lang', params)) {
				url += '&lang=' + params['lang'];
			}

			url += '&popup=1'; // ポップアップで表示
		}
		return url;
	}

	// 共通制御
	$(function () {
		// referrer cookie操作
		var hash_cookies = getHashCookies();

		if (array_key_exists('fa_search_url', hash_cookies) == true
			&& hash_cookies['fa_search_url'] != undefined) {
			referrerCookie = decodeURIComponent(hash_cookies['fa_search_url']);
		}

		// 別画面でpopup
		$('.popup').on('click', function () {
			var target_id = this.id;
			pop_window = window.open(this.href, target_id, "width=825,height=500,resizable=yes,location=no,scrollbars=yes");
			return false;
		});
	});

	// 比較チェックボックス
	$(function () {
		// 比較対象初期化
		var params = getUrlParams();
		var initFormNm = '';
		if (array_key_exists('formNm', params)) {
			initFormNm = params['formNm'];
		}
		compForm = [initFormNm];

		// 比較チェックボックス変更時の処理
		$('ul.comp').find('li').find('label').find('input[type="checkbox"]').change(function () {
			if ($(this).prop('checked') == true) {
				// チェックされた場合
				compForm.push($(this).val());
			} else {
				// チェックが外された場合
				compForm.splice($.inArray($(this).val(), compForm), 1);
			}

			if (compForm.length > 1) {
				var params = getUrlParams();
				var dataIdentifier = compForm[0];
				for (var i = 1; i < compForm.length; i++) {
					dataIdentifier += '%40%40' + compForm[i];
				}

				var tag = '';
				tag += '<a class="bullet_sprite_link" href="#"  onclick="compare(\'';
				tag += params['kisyu'];
				tag += '\',\'';
				tag += dataIdentifier;
				tag += '\')"><span>代替機種と仕様を比較</span></a>';

				$('ul.comp').find('li').find('p.btn').html(tag);
			} else {
				// チェックされていない場合(比較ボタン非活性化)
				$('ul.comp').find('li').find('p.btn').html('<span><span>代替機種と仕様を比較</span></span>');
			}
		});

	});

	function openParentWindow(argUrl, retry) {
		if (!window.opener || window.opener.closed) { // check parent window
			window.open(argUrl, "world"); // if parent window do not exist, open in new window
			window.close();
		}
		else {
			// if parent window exists, open in parent window
			try {
				// on retry try to set .location.href instead of using .open()
				if (retry) {
					window.opener.location.href = argUrl; // IE9
				} else {
					window.opener.open(argUrl, '_top');   // IE8 and all other browsers
				}
				window.close();
			} catch (e) {
				// on error retry once
				if (!retry) {
					openParentWindow(argUrl, true);
				}
			}
		}
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
		var qs = [{ type: 'hidden', name: 'formNm', value: formNm }, { type: 'hidden', name: 'kisyu', value: kisyu }, { type: 'hidden', name: 'popup', value: '1' }, { type: 'hidden', name: 'typename', value: '1' }];
		for (var i = 0; i < qs.length; i++) {
			var ol = qs[i];
			var input = document.createElement("input");
			for (var p in ol) {
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
}