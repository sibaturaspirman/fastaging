// 即時実行
(function($) {
	'use strict';

	// JS の Global な設定
	// HTML中で事前に設定されていた場合はその内容を優先する
	var MEL_SETTINGS = window.MEL_SETTINGS || {};
	var MEL_CMS_SETTINGS = window.MEL_CMS_SETTINGS || {};
	var MEL_FUNCTIONS = window.MEL_FUNCTIONS || {};
	var helper = {
		getMediaMode: function() {
			return window.innerWidth < 981 ? 'small' : 'large';
		},
		getPath: function(uri) {
			// URI から pathname 相当を取得
			// a 要素を生成して pathname を取得することで確実な処理を期待
			var path = $('<a />')
				.attr('href', uri)
				.prop('pathname');
			if (path.match(/^[^\/]/)) path = '/' + path;
			return path;
		},
		getCurrentPath: function() {
			return (
				//helper.getPath($('meta[property="og:url"]').attr('content')) ||
				location.pathname.replace('/index.html', '/')
			);
		},
		getCurrentDirectory: function() {
			var directory = location.pathname.split('/');
			directory.pop();
			return directory.join('/');
		},
		getCurrentDirectories: function() {
			var tempDirectories = location.pathname.split('/');
			if(tempDirectories[tempDirectories.length - 1].match(/\.html|\.do|\.page|\.php/g)) {
				tempDirectories[tempDirectories.length - 1] = '';
			}
			return tempDirectories;
		},
		getCurrentQueries: function() {
			var locationSearchParam = {};
			var tempLocationSearchParam = location.search.substring(1).split('&');
			tempLocationSearchParam.forEach(function(value, index) {
				if(value == '') {
					return;
				}
				var key = value.split('=')[0];
				var param = value.split('=')[1];
				if(key.indexOf('[]') > 0) {
					locationSearchParam[key] = locationSearchParam[key] || [];
					locationSearchParam[key].push(decodeURIComponent(param));
				} else {
					locationSearchParam[key] = decodeURIComponent(param);					
				}
			});
			return locationSearchParam;
		},
		getCookies: function() {
			var cookieObject = {};
			var cookieArray = [];
			if (document.cookie != '') {
				cookieArray = document.cookie.split('; ');
				cookieArray.forEach(function(value, index) {
					var cookieKey = decodeURIComponent(value.split('=')[0]);
					var cookieValue = decodeURIComponent(value.split('=')[1]);
					cookieObject[cookieKey] = cookieValue;
				});
			}
			return cookieObject;
		},
		getAttributeFromJson: function(attrObject) {
			if(!attrObject) {
				return '';
			}
			const returnAttribute = [];
			Object.keys(attrObject).forEach(function(value, index) {
				returnAttribute.push(`${value}="${attrObject[value]}"`);
			});
			return returnAttribute.join(' ');
		}
	};

	window.MEL_SETTINGS = $.extend(
		{
			current_path: helper.getCurrentPath(),
			current_directory: helper.getCurrentDirectory(),
			current_directories: helper.getCurrentDirectories(),
			// Header, Footer's external file path
			footer_container_path: '/fa/shared/gws0001/default/include/_footer.html',
			footer_simple_container_path: '/fa/shared/gws0001/default/include/_footer_simple.html',

			// Header
			header_path: '/fa/shared/gws0001/include/me_header.html',
			header_simple_path: '/fa/shared/gws0001/include/me_header_simple.html',

			// Footer
			footer_main_path: '/fa/shared/gws0001/include/me_footer.html',
			footer_popup_path: '/fa/shared/gws0001/include/me_footer_popup.html',
			footer_sns_path: '/fa/shared/gws0001/include/_footer_sns.html',

			helper: helper
		},
		MEL_SETTINGS
	);
	
	window.MEL_FUNCTIONS = $.extend(
		{
			openNewWindow: function(url, width = 800, height = 600) {
				if(url) {
					window.open(url, '_blank', 'width=' + width + ', height=' + height);
				} else {
					return;
				}
			},
			generateFloatingMenu: function(jsonObject) {
				if(!jsonObject) {
					return '';
				} else {
					// 小階層を持つ場合プルダウンで表示
					if(jsonObject.child) {
						var childItemHtmlArray = jsonObject.child.map(function(value) {
							return `
								<li class="c-list__item">
								<a class="c-floatingNav__link" href="${value.link}" ${helper.getAttributeFromJson(value.attr)}>
								<div class="c-floatingNav__icon u-icons u-icons--${value.icon}"></div>
								<div class="c-floatingNav__label">${value.name}</div>
								</a>
								</li><!-- /.c-list__item -->
							`;
						});
						return `
							<li class="c-floatingNav__item c-floatingNav__item--pulldown">
							<span class="c-floatingNav__link">
							<div class="c-floatingNav__icon u-icons u-icons--${jsonObject.icon}"></div>
							<div class="c-floatingNav__label">${jsonObject.name}</div>
							</span>
							<div class="c-floatingNav__pulldown">
							<ul class="c-list">
							${childItemHtmlArray.join('')}
							</ul>
							</div>
							</li><!-- /.c-floatingNav__item -->
						`;
					} else {
						return `
							<li class="c-floatingNav__item">
							<a class="c-floatingNav__link" href="${jsonObject.link}" ${helper.getAttributeFromJson(jsonObject.attr)}>
							<div class="c-floatingNav__icon u-icons u-icons--${jsonObject.icon}"></div>
							<div class="c-floatingNav__label">${jsonObject.name}</div>
							</a>
							</li><!-- /.c-floatingNav__item -->
						`;
					}
				}
			},
			generateSpotlightCard: function(jsonObject) {
				if(!jsonObject) {
					return '';
				} else {
					return `
						<div class="l-grid__item l-grid__item-4 l-grid__item-6-md l-grid__item-12-sm">
						<a class="c-linkWithImage" href="${jsonObject.link}" ${helper.getAttributeFromJson(jsonObject.attr)}>
						<div class="c-linkWithImage__image">
						<img src="${jsonObject.img}" alt="" decoding="async">
						</div>
						<span class="c-linkWithImage__link u-icons u-icons--bulletRight">${jsonObject.name}</span>
						</a><!-- /.c-linkWithImage -->
						</div><!-- /.l-grid__item -->
					`;
				}
			},
			generateLinkButtonWithIcon: function(jsonObject) {
				if(!jsonObject) {
					return '';
				} else {
					// 小階層を持つ場合プルダウンで表示
					if(jsonObject.child) {
						var childItemHtmlArray = jsonObject.child.map(function(value) {
							return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight" href="${value.link}" ${helper.getAttributeFromJson(value.attr)}>${value.name}</a></li>`;
						});
						return `
							<div class="c-linkWithIcon c-linkWithIcon--pulldown">
							<div class="c-linkWithIcon__icon"><img src="/fa/shared/common/img/icon/icon_${jsonObject.icon}.svg" alt="" with="60" height="60" decoding="async"></div>
							<span class="c-linkWithIcon__link">${jsonObject.name}</span>
							<div class="c-linkWithIcon__pulldown">
							<ul class="c-list">
							${childItemHtmlArray.join('')}
							</ul><!-- /.c-list -->
							</div>
							</div><!-- /.c-linkWithIcon -->
						`;
					} else {
						return `
							<a class="c-linkWithIcon" href="${jsonObject.link}" ${helper.getAttributeFromJson(jsonObject.attr)}>
							<div class="c-linkWithIcon__icon"><img src="/fa/shared/common/img/icon/icon_${jsonObject.icon}.svg" alt="" with="60" height="60" decoding="async"></div>
							<span class="c-linkWithIcon__link u-icons u-icons--bulletRight">${jsonObject.name}</span>
							</a><!-- /.c-linkWithIcon -->
						`;
					}					
				}
			},
			generateLinkButton: function(jsonObject) {
				if(!jsonObject) {
					return '';
				} else {
					return `
						<a class="c-linkButton" href="${jsonObject.link}" ${helper.getAttributeFromJson(jsonObject.attr)}>
						<span class="c-linkButton__link u-icons u-icons--bulletRight">${jsonObject.name}</span>
						</a><!-- /.c-linkButton -->						
					`;
				}
			},
			generateLinkBunner: function(jsonObject) {
				if(!jsonObject) {
					return '';
				} else {
					return `
						<a class="c-img u-bd" href="${jsonObject.link}" ${helper.getAttributeFromJson(jsonObject.attr)}>
						<img src="${jsonObject.image}" alt="${jsonObject.name}" decoding="async">
						</a><!-- /.c-img -->						
					`;
				}
			},
			sharePage: function(targetSNS) {
				var targetURL = '';
				switch(targetSNS) {
					case 'twitter':
						targetURL = `https://twitter.com/share?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(location.href)}`;
						break;
					case 'facebook':
						targetURL = `https://www.facebook.com/share.php?u=${encodeURIComponent(location.href)}&t=${encodeURIComponent(document.title)}`;
						break;
					case 'linkedin':
						targetURL = `https://www.linkedin.com/shareArticle/?mini=true&url=${encodeURIComponent(location.href)}`;
						break;
					case 'email':
						targetURL = `mailto:?body=%0D%0A%0D%0A${encodeURIComponent(document.title)}%0D%0A${encodeURIComponent(location.href)}`
						break;
				}
				window.open(targetURL);
			},
			openChatbot: function() {
				var $chatBotWrapper = $('#chatbot_wrapper');
				var $chatOpeningItems = $('.chat_opening_image, .chat_opening_text, .chat_opening_btn_group');
				$chatBotWrapper.addClass('is-active');
				$chatOpeningItems.show();
			}
		},
		MEL_FUNCTIONS
	);

	// Construction of Header
	$('[data-js-gs18-header]').includeHeader({
		path: $('.gs18-Header--simple').length ? window.MEL_SETTINGS.header_simple_path : window.MEL_SETTINGS.header_path ,
		// is-current の自動付与を止めたい場合は enableSetCurrent: false を設定
		enableSetCurrent: false,
		enableFlyOut: false,
		noajax: $('[data-js-gs18-header]').data('js-gs18-header') === 'noajax',
		callback: function($header) {
			// Reading MarsFlag does not work unless it creates a Header.
			var $marsFlagScript = $('<script/>').attr({
				src: '//c.marsflag.com/mf/mfx/1.0/js/mfx-sbox.js',
				charset: 'UTF-8'
			});
			$('body').append($marsFlagScript);
			// NOTE: If additional processing is required after header display, pass function to callback
			// console.log("some callbacks", $header)
		}
	});

	// Construction of Footer
	$('[data-js-gs18-footer]').includeFooter({
		path: $('.gs18-Footer--simple').length ? window.MEL_SETTINGS.footer_simple_container_path : window.MEL_SETTINGS.footer_container_path,
		mainPath: window.MEL_SETTINGS.footer_main_path,
		snsPath: window.MEL_SETTINGS.footer_sns_path,
		noajax: $('[data-js-gs18-footer]').data('js-gs18-footer') === 'noajax',
		callback: function($footer) {
			// NOTE: If additional processing is necessary after footer display, pass the function to callback
			// console.log("some callbacks", $footer)
			var includeParts = function($target, path, callback) {
				// eslint-disable-next-line no-redeclare
				var callback = callback || function() {};
				path &&
					$.ajax({
						url: path
					}).done(function(data) {
						$target.after(data);
						$target.remove();
						callback();
					});
			};

			// Include Main
			includeParts(
				$('[data-js-gs18-footer-main]'),
				window.MEL_SETTINGS.footer_main_path,
				function() {
					// Callbacks here
					
					//ページTopスクロール
					$('[data-js-gs18-gotop]').on('click', function(e) {
						e.preventDefault();
						$(this).goTopScroll();
					});
				}
			);

			// Include SNS
			includeParts(
				$('[data-js-gs18-footer-sns]'),
				window.MEL_SETTINGS.footer_sns_path,
				function() {
					// Callbacks here

					//Footer WeChat
					$('[data-js-gs18-footer-wechat]').on('click', function(e) {
						e.preventDefault();
						$(this)
							.find('[data-js-gs18-footer-wechat-target]')
							.slideToggle();
						$(this).blur();
					});
				}
			);
		}
	});

	// Set Custom Accorion UI
	var accordionSelectors = [
		{
			body: '[data-js-gs18-accordion]',
			trigger: '[data-js-gs18-accordion-trigger]',
			content: '[data-js-gs18-accordion-content]'
		},
		{
			body: '[data-js-accordion]',
			trigger: '[data-js-accordion-trigger]',
			content: '[data-js-accordion-content]'
		}
	];

	$(accordionSelectors).each(function(index, selectors) {
		$(selectors.body).setCustomAccordion({
			selectors: selectors
		});
	});
	
	// DOMContentLoaded
	$(function() {
		
		let windowPositionTop = 0;
		let windowWidth = 1280;
		let windowHeight = 800;
		let nowWindowPositionTop = 0;
		let isWindowScrolling = false;
		const queryParametersObject = window.MEL_SETTINGS.helper.getCurrentQueries();

		// Mobile判定
		if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
			$('body').addClass('mobile');
		} 
				
		// Window Resize
		$(window).on('resize load', function(){
			const $this = $(this);
			windowWidth = $this.width();
			windowHeight = $this.height();
		});
		
		// Window Scroll
		$(window).on('scroll load', function(){
			if(!isWindowScrolling) {
				const $this = $(this);
				nowWindowPositionTop = $this.scrollTop();
				isWindowScrolling = true;
				
				// メガドロップダウンは表示されておらず、Window高さの半分以上スクロールした状態で、ページ下方向にスクロールした場合はヘッダーを隠し、戻す操作の場合はヘッダーを表示				
				if(!$('.gs18-HeaderNav').hasClass('is-nav-open') && (nowWindowPositionTop - 0.5 * windowHeight > 0) && (nowWindowPositionTop - windowPositionTop > 0)) {
					$('[data-js-gs18-header]').addClass('is-hidden');			
				}	else {
					$('[data-js-gs18-header]').removeClass('is-hidden');								
				}
				
				setTimeout(function() {
					windowPositionTop = nowWindowPositionTop;
					isWindowScrolling = false;
				}, 100);
			}
		});

		//Pulldown Link
		$('[data-js-gs18-pulldown-link]').pulldownLink();
		
		//MicroMacro Panel
		$('[data-js-gs18-micro-macro]').microMacro();

		//Responsive Table
		$('[data-js-gs18-responsive-table]').setResponsiveTable();

		// Set VI Changer
		$('[data-js-vi]').setViChanger();
		
		// Set Tab Changer
		$('[data-js-tab]').setTabChanger();
		
		// 設定ファイルから生成するナビゲーション
		var currentDirectory = window.MEL_SETTINGS.current_directory;
		var currentDirectoryArray = window.MEL_SETTINGS.current_directories;
		// FAサイト直下のページは、homeカテゴリーとして処理
		if(!currentDirectoryArray[2]) {
			currentDirectoryArray[2] = 'home';
		}
		// カテゴリートップにある設定ファイルパスを指定
		var settingsJsonPath = currentDirectoryArray.slice(0, 3).join('/')  + '/data/settings.json';
		var directoriesJsonPath = currentDirectoryArray.slice(0, 3).join('/')  + '/data/directories.json';

		// 製品情報の機種配下のページの場合は、機種配下用のディレクトリ設定ファイルを指定		
		if(currentDirectoryArray[2].indexOf('products') !== -1 && currentDirectoryArray[3] === 'software' && currentDirectoryArray[5]) {
			directoriesJsonPath = currentDirectoryArray.slice(0, 6).join('/')   + '/data/directories.json';
		} else if(currentDirectoryArray[2].indexOf('products') !== -1 && currentDirectoryArray[5]) {
			directoriesJsonPath = currentDirectoryArray.slice(0, 5).join('/')   + '/data/directories.json';
		}
		
		// ディレクトリ設定ファイルを上書きするパラメータが設定されている場合
		if(queryParametersObject.dir) {
			directoriesJsonPath = queryParametersObject.dir + '/data/directories.json';
		}
		
		// 現在閲覧中のページ固有の設定ファイル
		var settingsLocalJsonPath = window.MEL_SETTINGS.current_path + 'data/settings.json';
		var settingsLocalJson = {
			"floatingMenu": {
				"specificItems": [],
				"commonItems": []
			}
		};
				
		// カテゴリートップでは、ローカルの設定ファイルは重複するので参照しない
		if(!(settingsJsonPath === settingsLocalJsonPath)) {
			$.ajaxSetup({ async: false });
			$.getJSON({
				url: settingsLocalJsonPath
			})
			.done(function(data) {
				settingsLocalJson = $.extend(settingsLocalJson, data);
			})
			.fail(function() {
				//console.log('ページ固有の設定ファイル無し');
			});
			$.ajaxSetup({ async: true });			
		}
				
		$.when(
			$.getJSON({
				url: directoriesJsonPath
			}),
			$.getJSON({
				url: settingsJsonPath
			})
		)
		.done(function(directoriesJsonData, settingsJsonData) {
			var directoriesJson = directoriesJsonData[0];
			var settingsJson = settingsJsonData[0];
			
			var topPagePathObject = {
				name: 'Mitsubishi Electric',
				path: '/',
				child: [],
				ancestors: []
			}
			var currentPageFamily = {
				ancestors: [],
				parent: {},
				myself: {},
				siblings: []
			};
			
			var searchDirectoryPath = function(json, parentJson) {

				// jsonの各ノードに親と先祖のオブジェクトを設定
				json.parent = {
					name: parentJson.name,
					path: parentJson.path,
					child: parentJson.child
				}
				json.ancestors = parentJson.ancestors;
				
				// ノードのpathが現在のページと一致するものを走査
				// ローカルナビのカレント指定がHTMLでされている場合は、その値を優先
				var currentPath = ($('.c-localNav').attr('data-js-local-nav') ? $('.c-localNav').attr('data-js-local-nav').replace('/index.html', '/') : null) || window.MEL_SETTINGS.current_path;

				if(json.path.split('?')[0].replace('/index.html', '/') === currentPath) {
					currentPageFamily = {
						ancestors: json.ancestors,
						parent: json.parent,
						myself: {
							name: json.name,
							path: json.path
						},
						siblings: parentJson.child
					}
					return;
				}
				
				// 子のノードに再帰的に適用
				if(json.child) {
					json.child.forEach(function(value, index) {
						searchDirectoryPath(value, 
							{
								name: json.name,
								path: json.path,
								child: json.child,
								ancestors: json.ancestors.concat([
									{
										name: json.name,
										path: json.path
									}
								])
							}
						);
					});
				}
			}
			
			searchDirectoryPath(directoriesJson.directories, topPagePathObject);
			
			// Local Nav
			$('[data-js-local-nav]').setLocalNav({
				currentPageFamily: currentPageFamily
			});
			
			// Breadcrumb Nav
			$('[data-js-breadcrumb]').setBreadcrumbNav({
				currentPageFamily: currentPageFamily
			});
			
			// Floating Nav
			// ブランドページではフローティングナビ非表示
			if(window.MEL_SETTINGS.current_path !== '/fa/about-us/automating-the-world/') {
				$('.c-mainVisual, .c-caseStudiyMainVisual').setFloatingNav(
					{
						"floatingMenu": {
							"specificItems": settingsLocalJson.floatingMenu.specificItems.length > 0 ? settingsLocalJson.floatingMenu.specificItems : settingsJson.floatingMenu.specificItems,
							"commonItems": [
								{
									"name": "Inquiries",
									"icon": "contact",
									"link": "/fa/contact-us/index.html"
								},
								{
									"name": "Share",
									"icon": "share",
									"link": "#",
									"child": [
										{
											"name": "Twitter",
											"icon": "twitter",
											"link": "JavaScript: MEL_FUNCTIONS.sharePage('twitter');"
										},
										{
											"name": "Facebook",
											"icon": "facebook",
											"link": "JavaScript: MEL_FUNCTIONS.sharePage('facebook');"
										},
										{
											"name": "LinkedIn",
											"icon": "linkedin",
											"link": "JavaScript: MEL_FUNCTIONS.sharePage('linkedin');"
										},
										{
											"name": "e-mail",
											"icon": "mail",
											"link": "JavaScript: MEL_FUNCTIONS.sharePage('email');"
										}
									]
								}
							]
						}
					}
				);
			}
		})
		.fail(function() {
			console.log('設定ファイルが存在しないか形式が不正です');
		});
		
		// Anchor Nav
		$('[data-js-anchor-nav]').setAnchorNav();
		
		// Set Modal
		$('[data-js-modal-open]').setSimpleModal();
		
		// Set Local Smooth Scroll
		$('main').setLocalSmoothScroll();
		
		// Set Collapse items
		$('[data-js-collapse-trigger]').setCollapseItems();
		
		// Set SNS Page Share Button
		$('[data-js-sns-page-share]').snsPageShare({
			message: 'Share this page',
			sns: {
				twitter: {
					display: true
				},
				facebook: {
					display: true
				},
				linkedin: {
					display: true
				},
				email: {
					display: true
				}
			}
		});
	});
})(window.jQuery3_6 || jQuery);
