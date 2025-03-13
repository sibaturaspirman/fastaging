/**
 * @fileOverview category.js
 */

// おすすめカタログ用ドキュメントリンク機能追加
const toCatalogInfo = function(elemid, docNo, kisyuNo, anchorType) {
  if(docNo && docNo !== '' && kisyuNo && kisyuNo !== '') {
    const GET_DOCUMENT_LINK_INFO = "https://www.mitsubishielectric.com/app/fa/DocumentSearchService/GetDocumentLinkInfo.do";
    const NEW_GET_DOCUMENT_LINK_INFO = "https://www.mitsubishielectric.com/fa/linkinfo/DocumentSearchService/GetDocumentLinkInfoJson";
    let count = 0;
    let kisyuSwitchedFlag = false;
    for ( count=0; count<=KISYU_ARRAY.length; count++) {
      if (KISYU_ARRAY[count] == kisyuNo) {
        kisyuSwitchedFlag = true;
        break;
      }
    }
    // 機種名での判定(機種IDでフラグがtrueになった場合はスキップ）
    if (!kisyuSwitchedFlag) {
      for ( count=0; count<=KISYU_NAME_ARRAY.length; count++) {
        if (KISYU_NAME_ARRAY[count] == kisyuNo) {
          kisyuSwitchedFlag = true;
          break;
        }
      }
    }

    const $productsDownload = $('[data-js-products-download]');
    const $productsDownloadRecommendedCatalog = $productsDownload.find('.c-recommendedCatalog');
    
    $.ajax({
      type: 'GET',
      url: kisyuSwitchedFlag ? NEW_GET_DOCUMENT_LINK_INFO : GET_DOCUMENT_LINK_INFO,
      data: {
        documentNO1: docNo,
        kisyuNO: kisyuNo,
        documentType: 'catalog'
      },
      dataType: 'jsonp'
    })
    .done(function(data) {
      const errorcode = data.ErrorCD;
      if(errorcode == 0) {
        const documentDatas = kisyuSwitchedFlag ? data.DocumentLinkInfoList.DocumentLinkInfo[0] : data.DocumentLinkInfoList.DocumentLinkInfo;    
        switch (anchorType) {
          case '3':
            $productsDownloadRecommendedCatalog.find('.c-linkWithImage__link').html(documentDatas.DocTitle);
            break;
          case '5':
            $productsDownloadRecommendedCatalog.find('.c-linkWithImage__image img').attr('src', documentDatas.DocImgCatalogURL);
            break;
          case '10':
            $productsDownloadRecommendedCatalog.find('.c-linkWithImage').attr('href', documentDatas.DocPdfURL);
            break;
          default:;
        }
      } else {
        console.log('ドキュメント情報の取得に失敗しました。：' + data.ErrorCD);        
      }
    })
    .fail(function() {
      console.log('ドキュメント情報の取得に失敗しました。');
    });      
  }
};

(function($) {
  'use strict';
  // ドキュメントリンク 新システム移行機種定義ファイル読み込み
  $("<script src='/fa/shared/js/ikouKisyu.js'></script>").appendTo("body");
  
  // ----------
  // 製品情報トップ
  // ----------
  const $radioSearchType = $('input[name="radioSearchType"]');
  const $searchBoxes = $('.c-searchBox');

  // 製品検索初期化
  if($radioSearchType.length > 0) {
    $.ajax({
      url: '/fa/shared/suggest/jn/sdata.json',
      dataType: 'text'
    })
    .done(function(data) {
      // 元JSONが正しいフォーマットではないため、即時関数を使ってJSオブジェクトとして取得
      const productsSearchSuggetJSON = (new Function("return" + data))();
      
      Model = productsSearchSuggetJSON.Model;
      Products = productsSearchSuggetJSON.Products;
      Kisyus = $.extend(true, [], productsSearchSuggetJSON.Products);
      
      $('body').append('<script src="/fa/shared/suggest/SGSTSearch.js"><\/script>');
      $('body').append('<script src="/fa/shared/suggest/SGSTCore.js"><\/script>');

    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log('製品検索サジェストファイルの取得に失敗しました');
    });

    // 検索タイプ切り替え
    $radioSearchType.on('change.searchType', changeSearchType);
    
    // 文字数制限
    // カウントするフィールドを監視
    $("#searchWord0").on('keyup', function(){
      // 現在入力されている文字
      const thisValue = $(this).val();
      // サジェスト表示
      const sList = document.getElementById('mSuggest');
      // 2文字に満たない場合はサジェスト非表示
      if(thisValue.length < 2) {
        sList.className = "melfa_search_model_suggest";
      } else {
        sList.className = "melfa_search_model_suggest on";
      }
    });	
    $("#searchWord1").on('keyup', function(){
      // 現在入力されている文字
      const thisValue = $(this).val();
      // サジェスト表示
      const sList = document.getElementById('pSuggest');
      // 2文字に満たない場合はサジェスト非表示
      if(thisValue.length < 2) {
        sList.className = "melfa_search_model_suggest";
      } else {
        sList.className = "melfa_search_model_suggest on";
      }
    });
    // 制限文字数を満たない状態でサブミットされた場合はアラート表示
    $('form[action="/fa/products/typename/search.do"]').each(function() {
      const $this = $(this);
      const $thisTextField = $this.find('input[type="text"]');
      $this.submit(function() {
        if ($thisTextField.val().length < 2) {
          alert('2文字以上のテキストを入力してください');
          return false;
        }
        if ($thisTextField.val().length > 100) {
          alert('100文字以下のテキストを入力してください');
          return false;
        }
      });
    });
  }
  
  
  // ----------
  // 製品情報下層
  // ----------
  const $productsSpotlightItems = $('[data-js-spotlight-items]');
  const $productsMenu = $('[data-js-products-menu]');
  const $productsOptionMenu = $('[data-js-products-option-menu]');
  const $productsDownload = $('[data-js-products-download]');
  const $productsDownloadRecommendedCatalog = $productsDownload.find('.c-reccomendedCatalog, .c-recommendedCatalog');
  const $productsRelatedLinks = $('[data-js-products-related-links]');
  const $productsBanner = $('[data-js-products-banner]');
  const $productsNews = $('[data-js-products-news]');
  const $productsUpdatedInformation = $('[data-js-products-updated-information]');
  const $productsContact = $('[ data-js-products-contact]');
  
  let productsFloatingMenuHTML = '';
  let productsSpotlightHTML = '';
  let productsMenuHTML = '';
  let productsOptionMenuHTML = '';
  let productsDownloadHTML = '';
  let productsRelatedLinksHTML = '';
  let productsBannerHTML = '';
  let productsContactHTML = '';
  
  // 機種トップパス
  // ソフトウェアのLP3はルートディレクトリを一段深い所を指定
  const pageRootPath = (window.MEL_SETTINGS.current_directories[3] === 'software' && window.MEL_SETTINGS.current_directories[5])
  ? window.MEL_SETTINGS.current_directories.slice(0, 6).join('/')
  : window.MEL_SETTINGS.current_directories.slice(0, 5).join('/');
  // 機種共通設定ファイル
  const pageSettingJsonPath = pageRootPath + '/data/settings.json';
  // CMSから出力されるお知らせ・更新情報xmlパス
  const productsNewsJsonPath = pageRootPath + '/index-melfa_tab01.xml';
  const productsUpdatedInformationJsonPath = pageRootPath + '/index-melfa_tab02.xml';
  
  // Settings.jsonから各種アイテム生成
  $.getJSON({
    url: pageSettingJsonPath      
  })
  .done(function(settingsJson) {
    // 固有のフローティングメニュー追加、共通アイテムオーバーライド
    $(document).on('floatingNavLoaded', function() {
      if(settingsJson.floatingMenu.specificItems.length > 0) {
        productsFloatingMenuHTML = settingsJson.floatingMenu.specificItems.map(window.MEL_FUNCTIONS.generateFloatingMenu).join('');
        $('.c-floatingNav__list').prepend(productsFloatingMenuHTML);          
      }
      if(settingsJson.floatingMenu.commonItems.length > 0) {
        settingsJson.floatingMenu.commonItems.forEach(function(value, index) {
          const $overrideItem = $('.c-floatingNav__list').find(`.u-icons--${value.icon}`).closest('.c-floatingNav__link');
          $overrideItem.attr('href', value.link);
          $overrideItem.find('.c-floatingNav__label').html(value.name);
        });
      }
    });
    
    // Spotlight生成
    if($productsSpotlightItems.length > 0 && settingsJson.spotlight.items.length > 0) {
      settingsJson.spotlight.items.forEach(function(value, index) {
        productsSpotlightHTML += window.MEL_FUNCTIONS.generateSpotlightCard(value);
      });
      $productsSpotlightItems.find('.l-grid').html(productsSpotlightHTML);
    }
    
    // 製品メニュー生成
    if($productsMenu.length > 0 && settingsJson.productsMenu.items.length > 0) {
      settingsJson.productsMenu.items.forEach(function(value, index) {
        productsMenuHTML += `<div class="l-grid__item l-grid__item-3 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButtonWithIcon(value)}</div><!-- /.l-grid__item -->`;
      });
      $productsMenu.html(productsMenuHTML);
    }
    
    // 機種固有メニュー生成
    if($productsOptionMenu.length > 0 && settingsJson.optionItems.items.length > 0) {
      settingsJson.optionItems.items.forEach(function(value, index) {
        productsOptionMenuHTML += `<div class="l-grid__item l-grid__item-3 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButton(value)}</div><!-- /.l-grid__item -->`;
      });
      $productsOptionMenu.html(productsOptionMenuHTML);
    }
    
    // ダウンロード
    if($productsDownload.length > 0 && settingsJson.download.recommended.length > 0) {
      productsDownloadHTML = `
        <p class="c-recommendedCatalog__title">Recommended Catalog</p>
        <a class="c-linkWithImage" href>
        <div class="c-linkWithImage__image">
        <img src alt="" decoding="async">
        </div>
        <span class="c-linkWithImage__link u-icons u-icons--bulletRight"></span>
        </a><!-- /.c-linkWithImage -->
      `;
      $productsDownloadRecommendedCatalog.html(productsDownloadHTML);
      
      if(settingsJson.download.recommended[0].name.indexOf('javascript.') === 0) {
        eval(settingsJson.download.recommended[0].name.replace('javascript.', ''));
      } else {
        $productsDownloadRecommendedCatalog.find('.c-linkWithImage__link').html(settingsJson.download.recommended[0].name);
      }

      if(settingsJson.download.recommended[0].img.indexOf('javascript.') === 0) {
        eval(settingsJson.download.recommended[0].img.replace('javascript.', ''));
      } else {
        $productsDownloadRecommendedCatalog.find('.c-linkWithImage__image img').attr('src', settingsJson.download.recommended[0].img);
      }
      
      if(settingsJson.download.recommended[0].link.indexOf('javascript.') === 0) {
        eval(settingsJson.download.recommended[0].link.replace('javascript.', ''));
      } else {
        $productsDownloadRecommendedCatalog.find('.c-linkWithImage').attr('href', settingsJson.download.recommended[0].link);
      }
    } else {
      $productsDownload.children('.l-grid__item-3').remove();
      $productsDownload.children('.l-grid__item-9').removeClass('l-grid__item-9 l-grid__item-8-md l-grid__item-12-sm').addClass('l-grid__item-12');
    }
    
    productsDownloadHTML = '';
    if($productsDownload.length > 0 && settingsJson.download.items.length > 0) {
      if(settingsJson.download.recommended.length > 0) {
        settingsJson.download.items.forEach(function(value, index) {
          productsDownloadHTML += `<div class="l-grid__item l-grid__item-4 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButtonWithIcon(value)}</div><!-- /.l-grid__item -->`;
        });        
      } else {
        settingsJson.download.items.forEach(function(value, index) {
          productsDownloadHTML += `<div class="l-grid__item l-grid__item-3 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButtonWithIcon(value)}</div><!-- /.l-grid__item -->`;
        });
      }
      $productsDownload.find('.l-grid--halfGutter').html(productsDownloadHTML);
    }
    
    // 関連リンク生成
    if($productsRelatedLinks.length > 0 && settingsJson.relatedLink.items.length > 0) {
      settingsJson.relatedLink.items.forEach(function(value, index) {
        productsRelatedLinksHTML += `<div class="l-grid__item l-grid__item-3 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButton(value)}</div><!-- /.l-grid__item -->`;
      });
      $productsRelatedLinks.html(productsRelatedLinksHTML);
    }
    
    // バナー生成
    if($productsBanner.length > 0 && settingsJson.banner.items.length > 0) {
      settingsJson.banner.items.forEach(function(value, index) {
        productsBannerHTML += `<div class="l-grid__item l-grid__item-20per l-grid__item-30per-md l-grid__item-50per-sm">${window.MEL_FUNCTIONS.generateLinkBunner(value)}</div><!-- /.l-grid__item -->`;
      });
      $productsBanner.html(productsBannerHTML);  
    }
    
    // お問い合わせ生成
    if($productsContact.length > 0 && settingsJson.contact.items.length > 0) {
      settingsJson.contact.items.forEach(function(value, index) {
        productsContactHTML += `<div class="l-grid__item l-grid__item-3 l-grid__item-6-md l-grid__item-12-sm">${window.MEL_FUNCTIONS.generateLinkButtonWithIcon(value)}</div><!-- /.l-grid__item -->`;
      });
      $productsContact.html(productsContactHTML);
    }
  })
  .fail(function() {
    console.log('設定ファイルが存在しないか形式が不正です');
  });
  
  // お知らせ生成
  if($productsNews.length > 0) {
    $.ajax({
      url: productsNewsJsonPath,
      dataType: 'XML'
    })
    .done(function(data) {
      let productsNewsListHtml = '';
      const newsShowAllTitle = $(data).find('listtitle').text();
      const newsShowAllLink = $(data).find('listUrl').text();

      $(data).find('item').each(function() {
        const newsDate = $(this).find('pubDate').text();
        const newsTitle = $(this).find('title').text();
        const newsDescription = $(this).find('description').text();
        const newsLink = $(this).find('link').text();
        
        if(newsLink) {
          productsNewsListHtml += `
            <li class="c-news__item">
            <a href="${newsLink}" class="c-news__link">
            <time class="c-news__date" datetime="${newsDate.replace('/', '-')}">${newsDate}</time>
            <p class="c-news__content">${newsTitle}<br>${newsDescription}</p>
            </a><!-- /.c-news__link -->
            </li><!-- /.c-news__item -->
          `;
        } else {
          productsNewsListHtml += `
            <li class="c-news__item">
            <span class="c-news__link">
            <time class="c-news__date" datetime="${newsDate.replace('/', '-')}">${newsDate}</time>
            <p class="c-news__content">${newsTitle}<br>${newsDescription}</p>
            </span><!-- /.c-news__link -->
            </li><!-- /.c-news__item -->
          `;
        }
      });
      $productsNews.html(productsNewsListHtml);
      $productsNews.after(`
        <p class="c-text u-ta--right l-separator-x1_5-imp">
        <a class="u-icons u-icons--bulletRight" href="${newsShowAllLink}">${newsShowAllTitle}</a>
        </p>
      `)
    })
    .fail(function() {
      console.log('お知らせの読み込みエラーです');
    });
  }
  
  // 更新情報生成
  if($productsUpdatedInformation.length > 0)  {
    $.ajax({
      url: productsUpdatedInformationJsonPath,
      dataType: 'XML'
    })
    .done(function(data) {
      let productsNewsListHtml = '';
      const newsShowAllTitle = $(data).find('listtitle').text();
      const newsShowAllLink = $(data).find('listUrl').text();

      $(data).find('item').each(function() {
        const newsDate = $(this).find('pubDate').text();
        const newsTitle = $(this).find('title').text();
        const newsDescription = $(this).find('description').text();
        const newsLink = $(this).find('link').text();
        
        if(newsLink) {
          productsNewsListHtml += `
            <li class="c-news__item">
            <a href="${newsLink}" class="c-news__link">
            <time class="c-news__date" datetime="${newsDate.replace('/', '-')}">${newsDate}</time>
            <p class="c-news__content">${newsTitle}<br>${newsDescription}</p>
            </a><!-- /.c-news__link -->
            </li><!-- /.c-news__item -->
          `;
        } else {
          productsNewsListHtml += `
            <li class="c-news__item">
            <span class="c-news__link">
            <time class="c-news__date" datetime="${newsDate.replace('/', '-')}">${newsDate}</time>
            <p class="c-news__content">${newsTitle}<br>${newsDescription}</p>
            </span><!-- /.c-news__link -->
            </li><!-- /.c-news__item -->
          `;
        }
      });
      $productsUpdatedInformation.html(productsNewsListHtml);
      $productsUpdatedInformation.after(`
        <p class="c-text u-ta--right l-separator-x1_5-imp">
        <a class="u-icons u-icons--bulletRight" href="${newsShowAllLink}">${newsShowAllTitle}</a>
        </p>
      `)
    })
    .fail(function() {
      console.log('更新情報の読み込みエラーです');
    });
  }

  //===================================== document ready
  $(function () {
    // ラジオボタンのページキャッシュ対応のため、ロード時に検索の切り替え状態復元
    // setTimeout(changeSearchType);
  });
})(window.jQuery3_6 || jQuery);
