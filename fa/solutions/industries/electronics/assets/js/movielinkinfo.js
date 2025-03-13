$(function() {
	$('video').bind('contextmenu',function(e){
		return false;
	});
});

// 繝薙ョ繧ｪ繧ｪ繝悶ず繧ｧ繧ｯ繝�
var videoObj = null;


(function($){
	
	//===================================== document ready
	$(function() {
		try {
			$('a.js_video_fancybox_win').fancybox({
			  padding: '20px',
			  margin: '0',
			  scrolling: 'no',
			  overlayOpacity: 0.8,
			  overlayColor: '#000',
			  showCloseButton: false,
			  showNavArrows: false,
			});
			$('a.js_video_fancybox_win').click(function(e) {
			  var id = $(this).attr("id");
			  // ID縺御ｺ後▽蟄伜惠縺吶ｋ縺後∬��荳崎ｦ�ｼ医ヱ繝ｩ繝｡繝ｼ繧ｿ繧偵→繧翫◆縺�□縺代�縺溘ａ��
			  // ID縺ｮ縺�■縺ｮ"open1(or2)Video"繧帝勁縺�
			  var tmp = id.substring(10);
			  videoObj = document.getElementById("selectVideo" + tmp);
			  return false;
			});
			$('a.modal_video_close_btn').click(function(e) {
			  $.fancybox.close();
			  e.preventDefault();
			  if (videoObj != null) {
			    videoObj.pause();
			    videoObj = null;
			  }
			  return false;
			});
			$(document).bind('click touchend', function(event) {
			  if (!$(event.target).closest('#target').length) {
	    		if (videoObj != null) {
			      videoObj.pause();
			      videoObj = null;
			    }
			  }
			});
		} catch (e) {
			// 迴ｾ蝨ｨ縺薙％縺ｧ繧ｨ繝ｩ繝ｼ縺ｨ縺ｪ繧九ヱ繧ｿ繝ｼ繝ｳ縺ｯfancybox縺ｮlink譛ｪ險ｭ螳壹�蝣ｴ蜷医�縺ｿ
			// 荳願ｨ倥〒縺ゅｋ縺溘ａ迚ｹ縺ｫ繧ｨ繝ｩ繝ｼ縺ｨ縺ｪ縺｣縺溷�ｴ蜷医〒繧ゆｽ輔ｂ縺励↑縺�
		}
	});
})(jQuery);

//蜍慕判繝ｪ繝ｳ繧ｯ
var GET_MOVIE_LINK_INFO = "/fa/MovieSearchService/GetMovieLinkInfo.do?";
var MOVIE_NO = "movieNO1";
var MOVIE_KISYU_NO = "kisyuNO";
var POPUP_URL = "/fa/media/html/module_popup.html?"
//---------------------------------------------
//蠢懃ｭ嚢ML繝��繧ｿ繧貞､画焚縺ｫ譬ｼ邏阪＠縺ｾ縺�
//蠑墓焚 xmlData�壼ｿ懃ｭ嚢ML繝��繧ｿ
//---------------------------------------------
function xmlAnsInfo(xmlData) {
	if(xmlData.getElementsByTagName("KisyuName")[0] != null && xmlData.getElementsByTagName("KisyuName")[0].childNodes[0] != null){
		this.kisyuName = xmlData.getElementsByTagName("KisyuName")[0].childNodes[0].nodeValue; //KisyuName
	} else { this.kisyuName = "";}
	if(xmlData.getElementsByTagName("KisyuNameE")[0] != null && xmlData.getElementsByTagName("KisyuNameE")[0].childNodes[0] != null){
		this.kisyuNameE = xmlData.getElementsByTagName("KisyuNameE")[0].childNodes[0].nodeValue; //KisyuNameE
	} else { this.kisyuNameE = "";}
	if(xmlData.getElementsByTagName("KisyuCD")[0] != null && xmlData.getElementsByTagName("KisyuCD")[0].childNodes[0] != null){
		this.kisyuCD = xmlData.getElementsByTagName("KisyuCD")[0].childNodes[0].nodeValue; //KisyuCD
	} else { this.kisyuCD = "";}
	if(xmlData.getElementsByTagName("MvNumber")[0] != null && xmlData.getElementsByTagName("MvNumber")[0].childNodes[0] != null){
		this.mvNumber = xmlData.getElementsByTagName("MvNumber")[0].childNodes[0].nodeValue; //MvNumber
	} else { this.mvNumber = "";}
	if(xmlData.getElementsByTagName("Status")[0] != null && xmlData.getElementsByTagName("Status")[0].childNodes[0] != null){
		this.status = xmlData.getElementsByTagName("Status")[0].childNodes[0].nodeValue; //Status
	} else { this.status = "";}
	if(xmlData.getElementsByTagName("TagID")[0] != null && xmlData.getElementsByTagName("TagID")[0].childNodes[0] != null){
		this.tagID = xmlData.getElementsByTagName("TagID")[0].childNodes[0].nodeValue; //TagID
	} else { this.tagID = "";}
	if(xmlData.getElementsByTagName("TagName")[0] != null && xmlData.getElementsByTagName("TagName")[0].childNodes[0] != null){
		this.tagName = xmlData.getElementsByTagName("TagName")[0].childNodes[0].nodeValue; //TagName
	} else { this.tagName = "";}
	if(xmlData.getElementsByTagName("TagNameE")[0] != null && xmlData.getElementsByTagName("TagNameE")[0].childNodes[0] != null){
		this.tagNameE = xmlData.getElementsByTagName("TagNameE")[0].childNodes[0].nodeValue; //TagNameE
	} else { this.tagNameE = "";}
	if(xmlData.getElementsByTagName("TextColor")[0] != null && xmlData.getElementsByTagName("TextColor")[0].childNodes[0] != null){
		this.textColor = xmlData.getElementsByTagName("TextColor")[0].childNodes[0].nodeValue; //TextColor
	} else { this.textColor = "";}
	if(xmlData.getElementsByTagName("BgColor")[0] != null && xmlData.getElementsByTagName("BgColor")[0].childNodes[0] != null){
		this.bgColor = xmlData.getElementsByTagName("BgColor")[0].childNodes[0].nodeValue; //BgColor
	} else { this.bgColor = "";}
	if(xmlData.getElementsByTagName("PubFlg")[0] != null && xmlData.getElementsByTagName("PubFlg")[0].childNodes[0] != null){
		this.pubFlg = xmlData.getElementsByTagName("PubFlg")[0].childNodes[0].nodeValue; //PubFlg
	} else { this.pubFlg = "";}
	if(xmlData.getElementsByTagName("DocTitle")[0] != null && xmlData.getElementsByTagName("DocTitle")[0].childNodes[0] != null){
		this.docTitle = xmlData.getElementsByTagName("DocTitle")[0].childNodes[0].nodeValue; //DocTitle
	} else { this.docTitle = "";}
	if(xmlData.getElementsByTagName("LangId")[0] != null && xmlData.getElementsByTagName("LangId")[0].childNodes[0] != null){
		this.langId = xmlData.getElementsByTagName("LangId")[0].childNodes[0].nodeValue; //LangId
	} else { this.langId = "";}
	if(xmlData.getElementsByTagName("LangName")[0] != null && xmlData.getElementsByTagName("LangName")[0].childNodes[0] != null){
		this.langName = xmlData.getElementsByTagName("LangName")[0].childNodes[0].nodeValue; //LangName
	} else { this.langName = "";}
	if(xmlData.getElementsByTagName("LangNameE")[0] != null && xmlData.getElementsByTagName("LangNameE")[0].childNodes[0] != null){
		this.langNameE = xmlData.getElementsByTagName("LangNameE")[0].childNodes[0].nodeValue; //LangNameE
	} else { this.langNameE = "";}
	if(xmlData.getElementsByTagName("Supplement")[0] != null && xmlData.getElementsByTagName("Supplement")[0].childNodes[0] != null){
		this.supplement = xmlData.getElementsByTagName("Supplement")[0].childNodes[0].nodeValue; //Supplement
	} else { this.supplement = "";}
	if(xmlData.getElementsByTagName("MvTime")[0] != null && xmlData.getElementsByTagName("MvTime")[0].childNodes[0] != null){
		this.mvTime = xmlData.getElementsByTagName("MvTime")[0].childNodes[0].nodeValue; //MvTime
	} else { this.mvTime = "";}
	if(xmlData.getElementsByTagName("MvFile0")[0] != null && xmlData.getElementsByTagName("MvFile0")[0].childNodes[0] != null){
		this.mvFile0 = xmlData.getElementsByTagName("MvFile0")[0].childNodes[0].nodeValue; //MvFile0
	} else { this.mvFile0 = "";}
	if(xmlData.getElementsByTagName("MvFile1")[0] != null && xmlData.getElementsByTagName("MvFile1")[0].childNodes[0] != null){
		this.mvFile1 = xmlData.getElementsByTagName("MvFile1")[0].childNodes[0].nodeValue; //MvFile1
	} else { this.mvFile1 = "";}
	if(xmlData.getElementsByTagName("MvFile2")[0] != null && xmlData.getElementsByTagName("MvFile2")[0].childNodes[0] != null){
		this.mvFile2 = xmlData.getElementsByTagName("MvFile2")[0].childNodes[0].nodeValue; //MvFile2
	} else { this.mvFile2 = "";}
	if(xmlData.getElementsByTagName("ImgFile0")[0] != null && xmlData.getElementsByTagName("ImgFile0")[0].childNodes[0] != null){
		this.imgFile0 = xmlData.getElementsByTagName("ImgFile0")[0].childNodes[0].nodeValue; //ImgFile0
	} else { this.imgFile0 = "";}
	if(xmlData.getElementsByTagName("ImgFile1")[0] != null && xmlData.getElementsByTagName("ImgFile1")[0].childNodes[0] != null){
		this.imgFile1 = xmlData.getElementsByTagName("ImgFile1")[0].childNodes[0].nodeValue; //ImgFile1
	} else { this.imgFile1 = "";}
	if(xmlData.getElementsByTagName("MvFMember")[0] != null && xmlData.getElementsByTagName("MvFMember")[0].childNodes[0] != null){
		this.memberFlg = xmlData.getElementsByTagName("MvFMember")[0].childNodes[0].nodeValue; //MvFMember
	} else { this.memberFlg = "";}
	if(xmlData.getElementsByTagName("UpDate")[0] != null && xmlData.getElementsByTagName("UpDate")[0].childNodes[0] != null){
		this.upDate = xmlData.getElementsByTagName("UpDate")[0].childNodes[0].nodeValue; //UpDate
	} else { this.upDate = "";}
}
var modalCnt =0;
function createXmlHttpMovie(){
	if(window.XMLHttpRequest){
		// IE7莉･荳翫ヾAFARI縲：ireFox
		return new XMLHttpRequest();
	} else if(window.ActiveXObject){
		// IE5縲！E6
		try {
			// MSXML3
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			// MSXML2
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	} else{
		// 髱槫ｯｾ蠢懊�繝悶Λ繧ｦ繧ｶ
		return null;
	}
}
//蜍慕判繝ｪ繝ｳ繧ｯ陦ｨ遉ｺ
function toMovieInfo(docNo, kisyuNo, dispPattern){
	if(docNo != null && docNo != "" && kisyuNo != null && kisyuNo != ""){
		var ret = makeLinkPageMovie(docNo, kisyuNo, dispPattern, "");
	} else {
		document.write(document.write(docNo+"(-2)"));
	}
	return false;
}

//******************************************************************************************************************************************************
//蜍慕判繝ｪ繝ｳ繧ｯ HTML繧､繝｡繝ｼ繧ｸ菴懈�
//******************************************************************************************************************************************************
function makeLinkPageMovie(docNo, kisyuNo, dispPattern, anchorType) {
	if (dispPattern < 0 || dispPattern > 6) {
		document.write(errOutMovie(dispPattern, anchorType,docNo));
		return false;
	}
	// 蜍慕判繝ｪ繝ｳ繧ｯ縺ｸ縺ｮ騾壻ｿ｡
	// 繝代Λ繝｡繝ｼ繧ｿ縺ｮ險ｭ螳�
	var parameter = MOVIE_NO + "=" + docNo + "&" + MOVIE_KISYU_NO + "=" + kisyuNo ;
	var httpObj = createXmlHttpMovie();
	if(httpObj == null){
		return;
	}
	var videoParam = docNo + "_" + kisyuNo;
	for (i=0; i< 2; i++) {
		// 騾壻ｿ｡繧丹PEN
		httpObj.open("POST", GET_MOVIE_LINK_INFO, false);
		httpObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpObj.send(parameter);
		if(httpObj.readyState == 4){
			if(httpObj.status == 200){
				// 霑斐ｊ蛟､�ｸ�ｭ�ｬ縺ｮ蜿門ｾ�
				xmlData  = httpObj.responseXML;
				var errorcode = xmlData.getElementsByTagName("ErrorCD")[0].childNodes[0].nodeValue;
				if(errorcode == 0){
					datas = new xmlAnsInfo(xmlData);
					var chtm = new Array();
					if(dispPattern == "1") {
						// 繝｢繝ｼ繝繝ｫ陦ｨ遉ｺ
						if (datas.memberFlg == "9") {
							 membersLink(chtm, datas, dispPattern);
						} else {
							chtm.push("<dl class=\"movie_list\"><dt>");
							chtm.push(datas.docTitle);
							chtm.push("</dt><dd><div class=\"layout01\"><div class=\"melfa_lc movie_wrap\"><div class=\"movie\"><a class=\"js_video_fancybox_win\" href=\"#modal_00"+modalCnt+"\" id=\"open1Video"+videoParam+"\"><img src=\"");
							chtm.push(datas.imgFile0);
							chtm.push("\" width=\"160\" alt=\"\"></a></div><div class=\"movie_meta\"><p>蜀咲函譎る俣縲");
							chtm.push(datas.mvTime);
							chtm.push("</p></div></div><div class=\"detail\"><div class=\"movie_tags\">");
							chtm.push("<span class=\"tag\"");
							chtm.push(" style=\"background-color:");
							chtm.push(datas.bgColor);
							chtm.push(";\">");
							chtm.push(datas.tagName);
							chtm.push("</span></div><p>");
							chtm.push(datas.supplement);
							chtm.push("</p><p class=\"link01\"><a class=\"js_video_fancybox_win\" href=\"#modal_00"+modalCnt+"\" id=\"open2Video"+videoParam+"\">縺薙�蜍慕判繧定ｦ九ｋ</a></p></div><!--/layout01--></div>");
							chtm.push("<div id=\"modal_00"+modalCnt+"\" class=\"modal_window\"><p class=\"modal_close\"><a class=\"modal_video_close_btn\">髢峨§繧�</a></p><p class=\"modal_title\">");
							modalCnt++;
							chtm.push(datas.docTitle);
							chtm.push("</p><div class=\"modal_content\">");
							chtm.push("<video width=\"480\" height=\"270\" poster=\"");
							chtm.push(datas.imgFile1);
							chtm.push("\" controls=\"controls\" preload=\"none\" id=\"selectVideo"+videoParam+"\">");
							if (datas.mvFile1 != "") {
								chtm.push("<source type=\"video/webm\" src=\"");
								chtm.push(datas.mvFile1);
								chtm.push("\" />");
							}
							if (datas.mvFile2 != "") {
								chtm.push("<source type=\"video/ogg\" src=\"");
								chtm.push(datas.mvFile2);
								chtm.push("\" />");
							}
							if (datas.mvFile0 != "") {
								chtm.push("<source type=\"video/mp4\" src=\"");
								chtm.push(datas.mvFile0);
								chtm.push("\" />");
							}
							// chtm.push("<object width=\"480\" height=\"270\" type=\"application/x-shockwave-flash\" data=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\">");
							// chtm.push("<param name=\"movie\" value=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\" />");
							// chtm.push("<param name=\"flashvars\" value=\"controls=true&file=");
							// chtm.push(datas.mvFile0);
							// chtm.push("\" />");
							// chtm.push("</object>");
							chtm.push("</video>");
							chtm.push("</div><div class=\"movie_tags\">");
							chtm.push("<span class=\"tag\"");
							chtm.push(" style=\"background-color:");
							chtm.push(datas.bgColor);
							chtm.push(";\">");
							chtm.push(datas.tagName);
							chtm.push("</span></div><!-- /modal_window --></div></dd></dl>");
						}
					}else if(dispPattern == "2"){
						var sendUrl = POPUP_URL+parameter;
						// 繝昴ャ繝励い繝��陦ｨ遉ｺ
						if (datas.memberFlg == "9") {
							 membersLink(chtm, datas, dispPattern);
						} else {
							chtm.push("<dl class=\"movie_list\"><dt>");
							chtm.push(datas.docTitle);
							chtm.push("</dt>");
							chtm.push("<dd><div class=\"layout01\"><div class=\"melfa_lc movie_wrap\"><div class=\"movie\"><a href=\"");
							chtm.push(sendUrl);
							chtm.push("\" onClick=\"javascript:window.open('");
							chtm.push(sendUrl);
							chtm.push("','popup','width=810,height=600,scrollbars=yes');return false;\"><img src=\"");
							chtm.push(datas.imgFile0);
							chtm.push("\" width=\"160\" alt=\"\"></a></div>");
							chtm.push("<div class=\"movie_meta\"><p>蜀咲函譎る俣縲");
							chtm.push(datas.mvTime);
							chtm.push("</p></div>");
							chtm.push("</div><div class=\"detail\"><div class=\"movie_tags\">");
							chtm.push("<span class=\"tag\"");
							chtm.push(" style=\"background-color:");
							chtm.push(datas.bgColor);
							chtm.push(";\">");
							chtm.push(datas.tagName);
							chtm.push("</span></div>");
							chtm.push("<p>");
							chtm.push(datas.supplement);
							chtm.push("</p><p class=\"link01\"><a href=\"");
							chtm.push(sendUrl);
							chtm.push("\" onClick=\"javascript:window.open('");
							chtm.push(sendUrl);
							chtm.push("','popup','width=810,height=600,scrollbars=yes');return false;\">縺薙�蜍慕判繧定ｦ九ｋ</a></p>");
							chtm.push("</div><!--/layout01--></div></dd></dl>");
						}
					}else if(dispPattern == "3") {
						// 逶ｴ謗･陦ｨ遉ｺ
						if (datas.memberFlg == "9") {
							 membersLink(chtm, datas, dispPattern);
						} else {
							chtm.push("<h2><span>");
							chtm.push(datas.docTitle);
							chtm.push("</span></h2><div class=\"movie_content\"><div class=\"movie\"><video width=\"480\" height=\"270\" poster=\"");
							chtm.push(datas.imgFile1);
							chtm.push("\" controls=\"controls\" preload=\"none\">");
							if (datas.mvFile1 != "") {
								chtm.push("<source type=\"video/webm\" src=\"");
								chtm.push(datas.mvFile1);
								chtm.push("\" />");
							}
							if (datas.mvFile2 != "") {
								chtm.push("<source type=\"video/ogg\" src=\"");
								chtm.push(datas.mvFile2);
								chtm.push("\" />");
							}
							if (datas.mvFile0 != "") {
								chtm.push("<source type=\"video/mp4\" src=\"");
								chtm.push(datas.mvFile0);
								chtm.push("\" />");
							}
							// chtm.push("<object width=\"480\" height=\"270\" type=\"application/x-shockwave-flash\" data=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\">");
							// chtm.push("<param name=\"movie\" value=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\" />");
							// chtm.push("<param name=\"flashvars\" value=\"controls=true&file=");
							// chtm.push(datas.mvFile0);
							// chtm.push("\" />");
							// chtm.push("</object>");
							chtm.push("</video></div><div class=\"movie_tags\">");
							chtm.push("<span class=\"tag\"");
							chtm.push(" style=\"background-color:");
							chtm.push(datas.bgColor);
							chtm.push(";\">");
							chtm.push(datas.tagName);
							chtm.push("</span></div></div><p>");
							chtm.push(datas.supplement);
							chtm.push("</p>");
						}
					}else if(dispPattern == "4") {
						// 蜍慕判蜀咲函驛ｨ蛻��縺ｿ陦ｨ遉ｺ
						if (datas.memberFlg == "9") {
							 membersLink(chtm, datas, dispPattern);
						} else {
							chtm.push("<video width=\"480\" height=\"270\" poster=\"");
							chtm.push(datas.imgFile1);
							chtm.push("\" controls=\"controls\" preload=\"none\">");
							if (datas.mvFile1 != "") {
								chtm.push("<source type=\"video/webm\" src=\"");
								chtm.push(datas.mvFile1);
								chtm.push("\" />");
							}
							if (datas.mvFile2 != "") {
								chtm.push("<source type=\"video/ogg\" src=\"");
								chtm.push(datas.mvFile2);
								chtm.push("\" />");
							}
							if (datas.mvFile0 != "") {
								chtm.push("<source type=\"video/mp4\" src=\"");
								chtm.push(datas.mvFile0);
								chtm.push("\" />");
							}
							// chtm.push("<object width=\"480\" height=\"270\" type=\"application/x-shockwave-flash\" data=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\">");
							// chtm.push("<param name=\"movie\" value=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\" />");
							// chtm.push("<param name=\"flashvars\" value=\"controls=true&file=");
							// chtm.push(datas.mvFile0);
							// chtm.push("\" />");
							// chtm.push("</object>");
							chtm.push("</video>");
						}
					}else if(dispPattern == "5") {
						// 繧ｿ繧､繝医Ν縺ｮ縺ｿ繝�く繧ｹ繝郁｡ｨ遉ｺ
						chtm.push(datas.docTitle);
					}else if(dispPattern == "6") {
						// 讎りｦ√�縺ｿ繝�く繧ｹ繝郁｡ｨ遉ｺ
						chtm.push(datas.supplement);
					}else {
						// 繝代Λ繝｡繝ｼ繧ｿ繧ｨ繝ｩ繝ｼ
						document.write(document.write(docNo+"(-2)"));
						return false;
					}
					document.write(chtm.join(""));
					return false;
				} else {
					document.write(errOutMovie(dispPattern, anchorType,docNo));
					return false;
				}
				break;
			}else{
				// 騾壻ｿ｡繧ｨ繝ｩ繝ｼ
				document.write(errOutMovie(dispPattern, anchorType,docNo));
				return false;
			}
		}
	}
}

//******************************************************************************************************************************************************
//蜍慕判繝ｪ繝ｳ繧ｯ 繝昴ャ繝励い繝��繝壹�繧ｸ菴懈�
//******************************************************************************************************************************************************
function makePopUpPage() {
	var parameter = "";
	if( 1 < window.location.search.length )
	{
		// 譛蛻昴�1譁�ｭ� (?險伜捷) 繧帝勁縺�◆譁�ｭ怜�繧貞叙蠕励☆繧�
		parameter = window.location.search.substring( 1 );
	}
	if (parameter == "") {
		return false;
	}
	var httpObj = createXmlHttpMovie();
	if(httpObj == null){
		return;
	}
	for (i=0; i< 2; i++) {
		// 騾壻ｿ｡繧丹PEN
		httpObj.open("POST", GET_MOVIE_LINK_INFO, false);
		httpObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpObj.send(parameter);
		if(httpObj.readyState == 4){
			if(httpObj.status == 200){
				// 霑斐ｊ蛟､�ｸ�ｭ�ｬ縺ｮ蜿門ｾ�
				xmlData  = httpObj.responseXML;
				var errorcode = xmlData.getElementsByTagName("ErrorCD")[0].childNodes[0].nodeValue;
				if(errorcode == 0){
					datas = new xmlAnsInfo(xmlData);
					document.title = datas.docTitle;
					var chtm = new Array();
					chtm.push("<h1>");
					chtm.push(datas.docTitle);
					chtm.push("</h1>");
					chtm.push("<div class=\"movie_content\">");
					chtm.push("<div class=\"movie\">");
					chtm.push("<video width=\"480\" height=\"270\" poster=\"");
					chtm.push(datas.imgFile1);
					chtm.push("\" controls=\"controls\" preload=\"none\">");
					if (datas.mvFile1 != "") {
						chtm.push("<source type=\"video/webm\" src=\"");
						chtm.push(datas.mvFile1);
						chtm.push("\" />");
					}
					if (datas.mvFile2 != "") {
						chtm.push("<source type=\"video/ogg\" src=\"");
						chtm.push(datas.mvFile2);
						chtm.push("\" />");
					}
					if (datas.mvFile0 != "") {
						chtm.push("<source type=\"video/mp4\" src=\"");
						chtm.push(datas.mvFile0);
						chtm.push("\" />");
					}
					chtm.push("<object width=\"480\" height=\"270\" type=\"application/x-shockwave-flash\" data=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\">");
					chtm.push("<param name=\"movie\" value=\"/fa/shared/lib/mediaelement/flashmediaelement.swf\" />");
					chtm.push("<param name=\"flashvars\" value=\"controls=true&file=");
					chtm.push(datas.mvFile0);
					chtm.push("\" />");
					chtm.push("</object>");
					chtm.push("</video>");
					chtm.push("</div>");
					chtm.push("<p>");
					chtm.push(datas.supplement);
					chtm.push("</p>");
					chtm.push("<div class=\"movie_tags\">");
					chtm.push("<span class=\"tag\"");
					chtm.push(" style=\"background-color:");
					chtm.push(datas.bgColor);
					chtm.push(";\">");
					chtm.push(datas.tagName);
					chtm.push("</span></div>");
					chtm.push("</div>");
					chtm.push("</div>");
					document.write(chtm.join(""));
					return false;
				} else {
					document.write(errOutMovie(dispPattern, anchorType,docNo));
					return false;
				}
				break;
			}else{
				// 騾壻ｿ｡繧ｨ繝ｩ繝ｼ
				document.write(errOutMovie(dispPattern, anchorType,docNo));
				return false;
			}
		}
	}
}

//------------------------------------------------------------------------------------------
//繝｡繝ｳ繝舌�蟆ら畑蜍慕判縺ｧ繝ｭ繧ｰ繧､繝ｳ縺励※縺�↑縺��ｴ蜷医�撕豁｢逕ｻ繧定｡ｨ遉ｺ縺励Ο繧ｰ繧､繝ｳ逕ｻ髱｢縺ｸ驕ｷ遘ｻ縺吶ｋ繧医≧縺ｫ縺吶ｋ
//------------------------------------------------------------------------------------------
function membersLink(chtm, datas, pattern) {
    hostName = "https://" + location.hostname;
	sendUrl = hostName + "/fa/ssl/php/members/b_login.php?moto=" + location.href;
	if (pattern == "1" || pattern == 2) {
		chtm.push("<dl class=\"movie_list\"><dt>");
		chtm.push(datas.docTitle);
		chtm.push("</dt>");
		chtm.push("<dd><div class=\"layout01\"><div class=\"melfa_lc movie_wrap\"><div class=\"movie\"><a href=\"");
		chtm.push(sendUrl);
		chtm.push("\"><img src=\"");
		chtm.push(datas.imgFile0);
		chtm.push("\" width=\"360\" alt=\"\"></a></div>");
		chtm.push("<div class=\"movie_meta\"><p>蜀咲函譎る俣縲");
		chtm.push(datas.mvTime);
		chtm.push("</p></div>");
		chtm.push("</div><div class=\"detail\"><div class=\"movie_tags\">");
		chtm.push("<span class=\"tag\"");
		chtm.push(" style=\"background-color:");
		chtm.push(datas.bgColor);
		chtm.push(";\">");
		chtm.push(datas.tagName);
		chtm.push("</span></div>");
		chtm.push("<p>");
		chtm.push(datas.supplement);
		chtm.push("</p><p class=\"link01\"><a href=\"");
		chtm.push(sendUrl);
		chtm.push("\" onClick=\"");
		chtm.push(sendUrl);
		chtm.push("\">縺薙�蜍慕判繧定ｦ九ｋ</a></p>");
		chtm.push("</div><!--/layout01--></div></dd></dl>");
	} else {
		if (pattern == "3") {
			chtm.push("<h2><span>");
			chtm.push(datas.docTitle);
			chtm.push("</span></h2>");
		}
		chtm.push("<div class=\"movie_content\"><div class=\"movie\"><a href=\" ");
		chtm.push(sendUrl);
		chtm.push("\" height=\"270\" poster=\" controls=\"controls\" preload=\"none\"><img src=\"");
		chtm.push(datas.imgFile1);
		chtm.push("\" width=\"480\" alt=\"\"></a></div>");
		if (pattern == "3") {
			chtm.push("<div class=\"movie_tags\">");
			chtm.push("<span class=\"tag\"");
			chtm.push(" style=\"background-color:");
			chtm.push(datas.bgColor);
			chtm.push(";\">");
			chtm.push(datas.tagName);
			chtm.push("</span>");
		chtm.push("</div>");
		}
		chtm.push("</div>");
		if (pattern == "3") {
			chtm.push("<p>");
			chtm.push(datas.supplement);
			chtm.push("</p>");
		}
	}
}

//---------------------------------------------
//繧ｨ繝ｩ繝ｼ譎ゅ�蜃ｺ蜉帙ｒ陦後＞縺ｾ縺�
//---------------------------------------------
function errOutMovie(titleType, anchorType, docNo) {
	var outString = "";
	if (titleType != null && titleType == "7" && anchorType != null) {
		outString = anchorType;
	} else {
		if (docNo != null) {
			outString = docNo;
		}
	}
	return outString;
}