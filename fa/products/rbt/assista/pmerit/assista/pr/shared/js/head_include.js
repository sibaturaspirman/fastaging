/*
	--------------------------------
	Created: 2014.05.09
	Last Modified: 2019.05.08
	--------------------------------
	- Table of Contents -

	GTM
	--------------------------------
*/

/* --------------------------------
	GTM
-------------------------------- */

(function() {
	// 既にGTMが実行されている場合は、処理を行わない
	if (window.dataLayer) {
		return false;
	}

	var url = location.href;
	var isIndexPage = url.slice(url.length - 1) === '/';
	var indexPageFileNames = ['index.html', 'index.htm', 'index.php'];

	// 除外URL
	var EXCLUDE_URL_LIST = [
		//'http://www.mitsubishielectric.co.jp/aaa/',
		//'http://www.mitsubishielectric.co.jp/bbb/'
	];

	// 対象URL
	var TARGET_URL_LIST = [
		'http://www.mitsubishielectric.co.jp/',
		'https://www.mitsubishielectric.co.jp/',
		'http://mitsubishielectric.co.jp/',
		'https://mitsubishielectric.co.jp/',
		'http://www.mitsubishielectric.co.jp/corporate/',
		'http://www.mitsubishielectric.co.jp/isms/',
		'http://www.mitsubishielectric.co.jp/sports/',
		'http://www-t2.web.melco.co.jp/',
		'http://melcooff.netplusone.com/',
		'http://test8.hproducts.info/home/kirigamine/',
		'http://reizouko.apps.cenfy.com/home/reizouko/',
		'http://sq.preview.i-studio.co.jp/',
		'http://www.mitsubishielectric.co.jp/sq/',
		'https://www.mitsubishielectric.co.jp/contact/ssl/php/400/',
		'http://www.mitsubishielectric.co.jp/me/',
		'http://www.mitsubishielectric.co.jp/ldg/wink/',
		'https://www.mitsubishielectric.co.jp/ldg/wink/',
		'http://dl.mitsubishielectric.co.jp/dl/ldg/wink/',
		'https://dl.mitsubishielectric.co.jp/dl/ldg/wink/',
		'http://www.mitsubishielectric.co.jp/service/jettowel/',
		'http://www.mitsubishielectric.co.jp/index.html',
		'http://www.mitsubishielectric.co.jp/index_p.html',
		'http://www.mitsubishielectric.co.jp/business/index.html',
		'http://www.mitsubishielectric.co.jp/products/index.html',
		'http://www.mitsubishielectric.co.jp/support/index.html',
		'http://www.mitsubishielectric.co.jp/pr/index.html',
		'http://www.mitsubishielectric.co.jp/oshirase/',
		'http://www.mitsubishielectric.co.jp/shoan/',
		'http://www.mitsubishielectric.co.jp/tenken/',
		'http://www.mitsubishielectric.co.jp/lidar/',
		'http://www.mitsubishielectric.co.jp/smart-denka/',
		'http://www.mitsubishielectric.co.jp/bd/',
		'http://www.mitsubishielectric.co.jp/carele/',
		'http://www.mitsubishielectric.co.jp/mel-toss/',
		'https://www.mitsubishielectric.co.jp/mel-toss/',
		'http://www.mitsubishielectric.co.jp/group/mel-toss/',
		'https://www.mitsubishielectric.co.jp/group/mel-toss/',
		'http://www.mitsubishielectric.co.jp/club-me/',
		'https://www.mitsubishielectric.co.jp/club-me/',
		'https://www.mitsubishielectric.co.jp/ldg/catalog/ssl/php/',
		'https://www.mitsubishielectric.co.jp/ldg/reception/ssl/php/',
		'http://www.mitsubishielectric.co.jp/elevator/',
		'http://www.mitsubishielectric.co.jp/building/',
		'https://www.mitsubishielectric.co.jp/elevator/',
		'https://www.mitsubishielectric.co.jp/building/',
		'http://melcooff.netplusone.com/elevator/',
		'http://melcooff.netplusone.com/building/',
		'http://www.mitsubishielectric.co.jp/ldg/ja/',
		'https://www.mitsubishielectric.co.jp/ldg/ja/',
		'http://search.mitsubishielectric.co.jp/ldg/ja/mar',
		'https://search.mitsubishielectric.co.jp/ldg/ja/mar',
		'https://www-t2.web.melco.co.jp/ldg/catalog/',
		'https://www.mitsubishielectric.co.jp/ldg/catalog/',
		'http://www.mitsubishielectric.co.jp/automotive/',
		'https://www.mitsubishielectric.co.jp/automotive/',
		'https://test.mitsubishielectric.co.jp/',
		'http://www.mitsubishielectric.co.jp/lsg/message/',
		'https://www.mitsubishielectric.co.jp/lsg/ssl/message/',
		'http://www.mitsubishielectric.co.jp/ldg/message/area/',
		'http://www.mitsubishielectric.co.jp/home/',
		'http://www.mitsubishielectric.co.jp/eyeterior/',
		'http://www.mitsubishielectric.co.jp/nikuine/',
		'http://www.mitsubishielectric.co.jp/projector/',
		'http://www.mitsubishielectric.co.jp/service/taiyo/',
		'http://www.mitsubishielectric.co.jp/ud_eco/rakuashi/',
		'http://www.mitsubishielectric.co.jp/semiconductors/',
		'https://www.mitsubishielectric.co.jp/semiconductors/',
		'http://www.mitsubishielectric.co.jp/cs/',
		'http://www.mitsubishielectric.co.jp/lsg/faqmovie/',
		'http://www.mitsubishielectric.co.jp/lsg/kaden/support/support/',
		'http://www.mitsubishielectric.co.jp/support/',
		'http://www.mitsubishielectric.co.jp/use/',
		'http://www.mitsubishielectric.co.jp/privacy/index03.html',
		'http://test-mitsubishi-fa.okbiz.okwave.jp/',
		'http://fatmp2.marsflag.jp/',
		'http://www.mitsubishielectric.co.jp/security/',
		'https://www.mitsubishielectric.co.jp/security/',
		'https://www.mitsubishielectric.co.jp/contact/ssl/php/457/',
		'https://www.mitsubishielectric.co.jp/contact/ssl/php/151/',		
		'http://www.mitsubishielectric.co.jp/fa/',
		'http://search.mitsubishielectric.co.jp/mar/fa/',
		'http://fa-faq.mitsubishielectric.co.jp',
		'http://fa-dic.mitsubishielectric.co.jp',
		'http://fa-site.mitsubishielectric.co.jp',
		'http://dl.mitsubishielectric.co.jp/dl/fa/',
		'https://www.mitsubishielectric.co.jp/fa/',
		'https://search.mitsubishielectric.co.jp/mar/fa/',
		'https://fa-faq.mitsubishielectric.co.jp',
		'https://fa-dic.mitsubishielectric.co.jp',
		'https://fa-site.mitsubishielectric.co.jp',
		'https://dl.mitsubishielectric.co.jp/dl/fa/',
		'http://check-mitsubishi-fa.okbiz.okwave.jp/',
		'http://fatmp.marsflag.jp/',
		'http://search.mitsubishielectric.co.jp/site/',
		'https://wwwl9.mitsubishielectric.co.jp/',
		'http://faq01.mitsubishielectric.co.jp/',
		'http://test-mld.okbiz.okwave.jp/',
		'http://www-i.web.melco.co.jp/fa/',
		'https://www-i.web.melco.co.jp/fa/',
		'http://www-it2.web.melco.co.jp/fa/',
		'https://www-it2.web.melco.co.jp/fa/',
		'http://www-t2.facojp.web.melco.co.jp/fa/',
		'https://www-t2.facojp.web.melco.co.jp/fa/',
		'http://test-www.mitsubishielectric.co.jp/fa/',
		'https://test-www.mitsubishielectric.co.jp/fa/',
		'http://wwwf15.mitsubishielectric.co.jp/',
		'https://wwwf15.mitsubishielectric.co.jp/',	
		'https://melcooff-ssl.netplusone.com/'	
	];

	// 除外URL照合
	for (var i = 0, len = EXCLUDE_URL_LIST.length; i < len; i++) {
		var excludeURL = EXCLUDE_URL_LIST[i];
		var excludeURL_omitted;

		if (!isIndexPage) {
			if (url.indexOf(excludeURL) === 0) {
				return;
			}
		} else {
			for (var ni = 0, nlen = indexPageFileNames.length; ni < nlen; ni++) {
				if (excludeURL.indexOf(indexPageFileNames[ni]) !== -1) {
					excludeURL_omitted = excludeURL.replace(indexPageFileNames[ni], '');
					if (url === excludeURL || url === excludeURL_omitted) {
						return;
					}
				} else {
					if (url.indexOf(excludeURL) === 0) {
						return;
					}
				}
			}
		}
	}

	// 対象URL照合
	for (var i = 0, len = TARGET_URL_LIST.length; i < len; i++) {
		var targetURL = TARGET_URL_LIST[i];
		var targetURL_omitted;

		if (!isIndexPage) {
			if (url.indexOf(targetURL) === 0) {
				callGTM();
				return;
			}
		} else {
			for (var ni = 0, nlen = indexPageFileNames.length; ni < nlen; ni++) {
				if (targetURL.indexOf(indexPageFileNames[ni]) !== -1) {
					targetURL_omitted = targetURL.replace(indexPageFileNames[ni], '');
					if (url === targetURL || url === targetURL_omitted) {
						callGTM();
						return;
					}
				} else {
					if (url.indexOf(targetURL) === 0) {
						callGTM();
						return;
					}
				}
			}
		}
	}

	// GTM実行
	function callGTM() {
		// Google Tag Manager
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-MQKLB');
		// End Google Tag Manager
	}
})();