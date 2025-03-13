/**
 * @fileOverview category.js
 */

const productsLabels = {
  top: 'Home',
  products: 'Products',
  spec: 'Product Specifications',
  standard: 'Products certified/compliant to standards',
  discon: 'Discontinued Products'
}

// おすすめカタログ用ドキュメントリンク機能追加
const showRecommendedCatalog = function(elemid, docNo, kisyuNo, anchorType) {
  if(docNo && docNo !== '' && kisyuNo && kisyuNo !== '') {
    const GET_DOCUMENT_LINK_INFO = "/app/fa/DocumentSearchService/GetDocumentLinkInfo.do";
    const NEW_GET_DOCUMENT_LINK_INFO = "/fa/linkinfo/DocumentSearchService/GetDocumentLinkInfoJson";
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

  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  
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
  const $productsLocalNav = $('[data-js-products-local-nav]');
  const $productsSwitchNav = $('[data-js-switch-nav]');
  const $productsLayerNav = $('[data-js-layer-nav]');
  const $productsProductsBreadcrumb = $('[data-js-products-breadcrumb]');
  const kisyuParameterRoot = {
    '3dsim': '/fa/products/software/simulation-tools/gemini/',
    'melipc': '/fa/products/edge/melipc/',
    'plcr': '/fa/products/cnt/plcr/items/',
    'plcf': '/fa/products/cnt/plcf/items/',
    'plcq': '/fa/products/cnt/plcq/items/',
    'plcl': '/fa/products/cnt/plcl/items/',
    'plc_fx': '/fa/products/cnt/plc_fx/items/',
    'plcqsws': '/fa/products/cnt/plcqsws/items/',
    'plca': '/fa/products/cnt/plca/items/',
    'plcnet': '/fa/products/cnt/plcnet/items/',
    'ssc': '/fa/products/cnt/ssc/',
    'cnc': '/fa/products/cnt/cnc/',
    'sensor': '/fa/products/snsr/sensor/',
    'servo': '/fa/products/drv/servo/',
    'gear-reducer': '/fa/products/drv/gear-reducer/',
    'slsv': '/fa/products/drv/slsv/',
    'inv': '/fa/products/drv/inv/',
    'i_motor': '/fa/products/drv/i_motor/',
    'gear': '/fa/products/drv/gear/',
    'clutch': '/fa/products/drv/clutch/',
    'tencon': '/fa/products/drv/tencon/',
    'got': '/fa/products/hmi/got/',
    'got_soft': '/fa/products/hmi/got/',
    'robot': '/fa/products/rbt/robot/',
    'lvcb': '/fa/products/lvd/lvcb/',
    'lvsw': '/fa/products/lvd/lvsw/',
    'pmd': '/fa/products/pmng/pmd/',
    'trns': '/fa/products/taca/trns/',
    'capa': '/fa/products/taca/capa/',
    'vcbvmc': '/fa/products/mvd/vcbvmc/',
    'pror': '/fa/products/mvd/pror/',
    'fuses': '/fa/products/mvd/fuses/',
    'mvsw': '/fa/products/mvd/mvsw/',
    'ems': '/fa/products/pmng/ems/',
    'pms': '/fa/products/pmng/pms/',
    'pven': '/fa/products/psup/pven/',
    'ups': '/fa/products/psup/ups/',
    'mcc': '/fa/products/psup/mcc/',
    'pven': '/fa/products/psup/pven/',
    'laser': '/fa/products/mecha/laser/',
    'edm': '/fa/products/mecha/edm/',
    'msc': '/fa/products/mecha/msc/',
    'am': '/fa/products/mecha/am/',
    'ebm': '/fa/products/mecha/ebm/',
    'ebm': '/fa/products/mecha/ebm/',
    'weldhead': '/fa/products/mecha/weldhead/',
    'ecoadviser': '/fa/products/software/ems/eap/',
    'ecomeasure': '/fa/products/software/ems/eap/',
    'lp2': '/fa/products/lp1/lp2/'
  }
  
  let productsFloatingMenuHTML = '';
  let productsSpotlightHTML = '';
  let productsMenuHTML = '';
  let productsOptionMenuHTML = '';
  let productsDownloadHTML = '';
  let productsRelatedLinksHTML = '';
  let productsBannerHTML = '';
  let productsContactHTML = '';
  
  // 機種トップパス
  let pageRootPath = '';
  if(queryParametersObject.kisyu) {
    // kisyuパラメータがある場合は対応表からディレクトリを指定
    pageRootPath = kisyuParameterRoot[queryParametersObject.kisyu.slice(1)];
  } else if (queryParametersObject.dir) {
    // ディレクトリ設定ファイルを上書きするパラメータが設定されている場合
    pageRootPath = queryParametersObject.dir + '/';
  } else {
    // ソフトウェアのLP3はルートディレクトリを一段深い所を指定
    pageRootPath = (window.MEL_SETTINGS.current_directories[3] === 'software' && window.MEL_SETTINGS.current_directories[5])
    ? window.MEL_SETTINGS.current_directories.slice(0, 6).join('/') + '/'
    : window.MEL_SETTINGS.current_directories.slice(0, 5).join('/') + '/';
  }
  // 機種共通設定ファイル
  const pageDirectoriesJsonPath = pageRootPath + 'data/directories.json';
  const pageSettingJsonPath = pageRootPath + 'data/settings.json';
  // CMSから出力されるお知らせ・更新情報xmlパス
  const productsNewsJsonPath = pageRootPath + 'index-melfa_tab01.json';
  const productsUpdatedInformationJsonPath = pageRootPath + 'index-melfa_tab02.json';
  // ページ個別設定ファイル
  const pageDirectoriesLocalJsonPath = window.MEL_SETTINGS.current_directory + '/data/directories.json';
  const pageSettingsLocalJsonPath = window.MEL_SETTINGS.current_directory + '/data/settings.json';
  
  // 機種共通のSettings.jsonから各種アイテム生成
  $.getJSON({
    url: pageSettingJsonPath      
  })
  .done(function(settingsJson) {
    // 固有のフローティングメニュー追加、共通アイテムオーバーライド
    $(document).on('floatingNavLoaded', function() {
      if(settingsJson.floatingMenu.specificItems.length > 0) {
        productsFloatingMenuHTML = settingsJson.floatingMenu.specificItems.map(window.MEL_FUNCTIONS.generateFloatingMenu).join('');
        if(!(pageRootPath === window.MEL_SETTINGS.current_path)) {
          $('.c-floatingNav__list').prepend($(productsFloatingMenuHTML).addClass('pageRootItems'));        
        }
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

      if(settingsJson.spotlight.items.length >= 4) {
        $productsSpotlightItems.addClass('c-spotlightItems--scroll');
      } else {
        $productsSpotlightItems.removeClass('c-spotlightItems--scroll');
      }
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
      $productsDownloadRecommendedCatalog.addClass('c-recommendedCatalog');
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
        eval(settingsJson.download.recommended[0].name.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
      } else {
        $productsDownloadRecommendedCatalog.find('.c-linkWithImage__link').html(settingsJson.download.recommended[0].name);
      }

      if(settingsJson.download.recommended[0].img.indexOf('javascript.') === 0) {
        eval(settingsJson.download.recommended[0].img.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
      } else {
        $productsDownloadRecommendedCatalog.find('.c-linkWithImage__image img').attr('src', settingsJson.download.recommended[0].img);
      }
      
      if(settingsJson.download.recommended[0].link.indexOf('javascript.') === 0) {
        eval(settingsJson.download.recommended[0].link.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
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
  })
  .always(function() {
    // ローカルsettings.jsonから各種アイテム生成
    $.getJSON({
      url: pageSettingsLocalJsonPath      
    })
    .done(function(settingsJson) {
      // 機種トップで設定された変数をリセット
      productsFloatingMenuHTML = '';
      productsSpotlightHTML = '';
      productsMenuHTML = '';
      productsOptionMenuHTML = '';
      productsDownloadHTML = '';
      productsRelatedLinksHTML = '';
      productsBannerHTML = '';
      productsContactHTML = '';

      // 固有のフローティングメニュー追加、共通アイテムオーバーライド
      $(document).on('floatingNavLoaded', function() {
        if(settingsJson.floatingMenu.specificItems.length > 0) {
          // 機種トップの設定ファイルで設定されているリンクを削除
          $('.c-floatingNav__list').find('.pageRootItems').remove();
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

        if(settingsJson.spotlight.items.length >= 4) {
          $productsSpotlightItems.addClass('c-spotlightItems--scroll');
        } else {
          $productsSpotlightItems.removeClass('c-spotlightItems--scroll');
        }  
      } else {
        // Spotlightが下層で設定されていない場合は、エリアごと削除する
        $productsSpotlightItems.remove();
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
        $productsDownloadRecommendedCatalog.addClass('c-recommendedCatalog');
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
          eval(settingsJson.download.recommended[0].name.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
        } else {
          $productsDownloadRecommendedCatalog.find('.c-linkWithImage__link').html(settingsJson.download.recommended[0].name);
        }

        if(settingsJson.download.recommended[0].img.indexOf('javascript.') === 0) {
          eval(settingsJson.download.recommended[0].img.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
        } else {
          $productsDownloadRecommendedCatalog.find('.c-linkWithImage__image img').attr('src', settingsJson.download.recommended[0].img);
        }
        
        if(settingsJson.download.recommended[0].link.indexOf('javascript.') === 0) {
          eval(settingsJson.download.recommended[0].link.replace('javascript.', '').replace('toCatalogInfo', 'showRecommendedCatalog'));
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
      console.log('ローカル設定ファイルの読み込みエラーです');
    })
  });
  
  // お知らせ生成
  if($productsNews.length > 0) {
    $.ajax({
      url: productsNewsJsonPath,
      dataType: 'JSON'
    })
    .done(function(data) {
      let productsNewsListHtml = '';
      const newsShowAllTitle = data.listLinkLabel;
      const newsShowAllLink = data.listLink;
      
      if(data.items.length > 0) {
        data.items.forEach(function(value, index) {
          const newsDate = value.pubDate;
          const newsTitle = value.title.replaceAll('&lt;', '<').replaceAll('&gt;','>');
          const newsDescription = value.description;
          const newsLink = value.link ? value.link.replace('https://www-i.facom.web.melco.co.jp','') : null;
          
          if(newsLink) {
            productsNewsListHtml += `
              <li class="c-news__item">
              <a href="${newsLink}" class="c-news__link">
              <time class="c-news__date" datetime="${(newsDate.indexOf('<') !== -1) ? '' : newsDate.replaceAll('/', '-')}">${newsDate}</time>
              <p class="c-news__content">${newsTitle} ${(newsDescription.length > 0) ? '<br><object>' + newsDescription + '</object>' : ''}</p>
              </a><!-- /.c-news__link -->
              </li><!-- /.c-news__item -->
            `;
          } else {
            productsNewsListHtml += `
              <li class="c-news__item">
              <span class="c-news__link">
              <time class="c-news__date" datetime="${(newsDate.indexOf('<') !== -1) ? '' : newsDate.replaceAll('/', '-')}">${newsDate}</time>
              <p class="c-news__content">${newsTitle} ${(newsDescription.length > 0) ? '<br><object>' + newsDescription + '</object>' : ''}</p>
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
        `);        
      } else {
        productsNewsListHtml = `
          <li><p class="c-text l-separator-x1_5-imp">There are no announcements at this time.</p></li>
        `;    
        $productsNews.html(productsNewsListHtml);    
      }
    })
    .fail(function() {
      let productsNewsListHtml = `
        <li><p class="c-text l-separator-x1_5-imp">There are no announcements at this time.</p></li>
      `;
      $productsNews.html(productsNewsListHtml); 
      console.log('お知らせの読み込みエラーです');
    });
  }
  
  // 更新情報生成
  if($productsUpdatedInformation.length > 0)  {
    $.ajax({
      url: productsUpdatedInformationJsonPath,
      dataType: 'JSON'
    })
    .done(function(data) {
      let productsNewsListHtml = '';
      const newsShowAllTitle = data.listLinkLabel;
      const newsShowAllLink = data.listLink;
      
      if(data.items.length > 0) {
        data.items.forEach(function(value, index) {
          const newsDate = value.pubDate;
          const newsTitle = value.title.replaceAll('&lt;', '<').replaceAll('&gt;','>');
          const newsCategory = value.category;
          const newsDescription = value.description;
          const newsLink = value.link ? value.link.replace('https://www-i.facom.web.melco.co.jp','') : null;
          
          if(newsLink) {
            productsNewsListHtml += `
              <li class="c-news__item">
              <a href="${newsLink}" class="c-news__link">
              <time class="c-news__date" datetime="${(newsDate.indexOf('<') !== -1) ? '' : newsDate.replaceAll('/', '-')}">${newsDate}</time>
              <p class="c-news__content">${newsTitle} ${(newsDescription.length > 0) ? '<br><object>' + newsDescription + '</object>' : ''}</p>
              </a><!-- /.c-news__link -->
              </li><!-- /.c-news__item -->
            `;
          } else {
            productsNewsListHtml += `
              <li class="c-news__item">
              <span class="c-news__link">
              <time class="c-news__date" datetime="${(newsDate.indexOf('<') !== -1) ? '' : newsDate.replaceAll('/', '-')}">${newsDate}</time>
              <p class="c-news__category">${newsCategory ? '<span>' + newsCategory + '</span>' : ''}</p>
              <p class="c-news__content">${newsTitle} ${(newsDescription.length > 0) ? '<br><object>' + newsDescription + '</object>' : ''}</p>
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
        `);        
      } else {
        productsNewsListHtml = `
          <li><p class="c-text l-separator-x1_5-imp">There are no update information at this time.</p></li>
        `;    
        $productsUpdatedInformation.html(productsNewsListHtml);
      }
    })
    .fail(function() {
      let productsNewsListHtml = `
        <li><p class="c-text l-separator-x1_5-imp">There are no update information at this time.</p></li>
      `;
      $productsUpdatedInformation.html(productsNewsListHtml); 
      console.log('更新情報の読み込みエラーです');
    });
  }
  
  // directories.jsonから各種アイテム生成
  $.getJSON({
    url: pageDirectoriesJsonPath      
  })
  .done(function(DirectoriesJson) {
    const currentPageFamily = {
      mode : '',
      ancestors: [
        {
          "name": "Home",
          "path": "/fa/"
        },
        {
          "name": "Products",
          "path": "/fa/products/index.html"
        }
      ],
      parent: {},
      myself: {},
      siblings: [],
      family: [],
      firstLayer: [],
      secondLayer: [],
      thirdLayer: []
    };
    // 製品情報ローカルナビのカレント指定がHTMLでされている場合は、その値を優先
    const currentPathWithQuery = ($productsLocalNav.attr('data-js-products-local-nav') ? $productsLocalNav.attr('data-js-products-local-nav').replace('/index.html', '/') : null) || window.MEL_SETTINGS.current_path + decodeURIComponent(location.search);
    
    if(DirectoriesJson.switchNav) {
      currentPageFamily.ancestors.push(
        {
          name: DirectoriesJson.switchNav.name,
          path: DirectoriesJson.switchNav.path
        }
      );
      currentPageFamily.parent = {
        name: DirectoriesJson.switchNav.name,
        path: DirectoriesJson.switchNav.path
      }
      
      DirectoriesJson.switchNav.child.forEach(function(switchNavObject, index) {
        Object.keys(switchNavObject).forEach(function(key, index) {
          // console.log(switchNavObject[key]);
          // console.log(currentPathWithQuery);

          // 設定ファイルに含めれるパスを正規化、key=returnの場合は除外
          if(key !== 'return') {
            switchNavObject[key] = decodeURIComponent(switchNavObject[key].replace('/index.html', '/'));
          }

          if(key !== 'return' && switchNavObject[key] === currentPathWithQuery) {
            currentPageFamily.mode = key;
            currentPageFamily.myself = {
              group: switchNavObject.group,
              name: switchNavObject.name,
              path: switchNavObject[key]
            }
            currentPageFamily.family = switchNavObject;

            // ローカルナビの戻る項目を明示的に指定している場合、returnの内容を親要素に設定
            if(switchNavObject.return) {
              currentPageFamily.parent = {
                name: switchNavObject.return.name,
                path: switchNavObject.return.path
              }
            }
          }
        });
      });
      
      DirectoriesJson.switchNav.child.forEach(function(switchNavObject, index) {
        if(switchNavObject[currentPageFamily.mode] && switchNavObject.group === currentPageFamily.myself.group) {
          currentPageFamily.siblings.push(
            {
              name: switchNavObject.name,
              path: switchNavObject[currentPageFamily.mode]
            }
          );
        }
      });
      // console.log(currentPageFamily);
    }

    // 現在のページの親階層が取得できない場合は、パスから親階層を指定
    // ToDo: 仕様一覧・規格適合品・生産終了品の一覧ページ制作後にname・path修正
    if(Object.keys(currentPageFamily.parent).length === 0) {
      // 仕様一覧
      if(currentPathWithQuery.indexOf('/fa/products/faspec/search') !== -1) {
        currentPageFamily.parent = {
          name: productsLabels.products,
          path: '/fa/products/index.html'
        }
      }
      // 規格適合品
      else if(currentPathWithQuery.indexOf('/fa/products/standard/SearchServlet') !== -1) {
        currentPageFamily.parent = {
          name: productsLabels.products,
          path: '/fa/products/index.html'
        }
      }
      // 生産終了品
      else if(currentPathWithQuery.indexOf('/fa/products/dbdbsearch/SearchServlet') !== -1) {
        currentPageFamily.parent = {
          name: productsLabels.products,
          path: '/fa/products/index.html'
        }
      }
      // その他
      else {
        currentPageFamily.parent = {
          name: productsLabels.products,
          path: '/fa/products/index.html'
        }
      }
    }
    
    // Product feature・仕様一覧・規格適合品・生産終了品 ローカルナビ生成
    if($productsLocalNav.length > 0) {
      $productsLocalNav.setLocalNav({
        currentPageFamily: currentPageFamily
      });
    }
    
    // 切替ナビ生成
    if($productsSwitchNav.length > 0 && Object.keys(currentPageFamily.family).length > 0) {
      const switchNavHtmlTemplate = ''
      + '<ul class="c-list c-list--float">'
      + (currentPageFamily.family.feature ? `<li class="c-list__item"><a class="c-switchNav__link" href="${currentPageFamily.family.feature}">Feature</a></li>` : '<li class="c-list__item"><span class="c-switchNav__link disable">Feature</span></li>')
      + (currentPageFamily.family.spec ? `<li class="c-list__item"><a class="c-switchNav__link" href="${currentPageFamily.family.spec}">Specification</a></li>` : '<li class="c-list__item"><span class="c-switchNav__link disable">Specification</span></li>')
      + (currentPageFamily.family.standard ? `<li class="c-list__item"><a class="c-switchNav__link" href="${currentPageFamily.family.standard}">Standards</a></li>` : '<li class="c-list__item"><span class="c-switchNav__link disable">Standards</span></li>')
      + (currentPageFamily.family.discon ? `<li class="c-list__item"><a class="c-switchNav__link" href="${currentPageFamily.family.discon}">Discontinued</a></li>` : '<li class="c-list__item"><span class="c-switchNav__link disable">Discontinued</span></li>')
      + '</ul><!-- /.c-list -->';
      
      $productsSwitchNav.html(switchNavHtmlTemplate);
      $productsSwitchNav.find('a.c-switchNav__link').each(function() {
        const $this = $(this);
        if($this.attr('href').replace('index.html','') === currentPathWithQuery) {
          $this.addClass('is-active')
        }
      });
    }

    // 仕様一覧・規格適合品・生産終了品 パンくずナビ生成
    if($productsProductsBreadcrumb.length > 0) {
      $productsProductsBreadcrumb.setBreadcrumbNav({
        currentPageFamily: currentPageFamily
      });      
    }
  })
  .fail(function() {
    console.log('階層設定ファイルの読み込みエラーです');
  })
  
  // ローカルdirectories.jsonから各種アイテム生成
  $.getJSON({
    url: pageDirectoriesLocalJsonPath      
  })
  .done(function(DirectoriesJson) {
    // 階層ナビ生成
    if($productsLayerNav.length > 0) {
      const directoryIDs = $productsLayerNav.attr('data-js-layer-nav').split('_').map(function(value) {return parseInt(value) - 1});
      const hasMenuAndMid = queryParametersObject.menu && queryParametersObject.mid;
      
      if(DirectoriesJson.layerNav.firstLayer) {
        const firstLayerHtmlTemplate = '<div class="c-layerNav__inner"><ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-1st>'
          + DirectoriesJson.layerNav.firstLayer.map(function(value, index) {
            return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[1] ? 'is-active': ''}" href="${value.path}${hasMenuAndMid ? '?menu=' + queryParametersObject.menu + '&mid=' + queryParametersObject.mid : ''}">${value.name}</a></li>`
          }).join('')
          + '</ul></div>';
        $productsLayerNav.append(firstLayerHtmlTemplate);
        
        if(DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer) {
          const secondLayerHtmlTemplate = '<ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-2nd>'
            + DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer.map(function(value, index) {
              return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[2] ? 'is-active': ''}" href="${value.path}${hasMenuAndMid ? '?menu=' + queryParametersObject.menu + '&mid=' + queryParametersObject.mid : ''}">${value.name}</a></li>`
            }).join('')
            + '</ul>';
          $productsLayerNav.find('.c-layerNav__inner').append(secondLayerHtmlTemplate);
          
          if(DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer[directoryIDs[2]].thirdLayer) {
            const thirdLayerHtmlTemplate = '<ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-3rd>'
              + DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer[directoryIDs[2]].thirdLayer.map(function(value, index) {
                return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[3] ? 'is-active': ''}" href="${value.path}${hasMenuAndMid ? '?menu=' + queryParametersObject.menu + '&mid=' + queryParametersObject.mid : ''}">${value.name}</a></li>`
              }).join('')
              + '</ul>';
            $productsLayerNav.find('.c-layerNav__inner').append(thirdLayerHtmlTemplate);
          }
        }
      }
    }
  })
  .fail(function() {
    console.log('ローカル階層設定ファイルの読み込みエラーです');
  })
  
  
  // 別ページセクションロード
  // ToDo: リファクタリング
  if($('[data-include-section]').length > 0) {
    $('[data-include-section]').each(function() {
      const $this = $(this);
      const includeSectionURL = $this.attr('data-include-section');
      $.ajax({
        url: includeSectionURL.split(' ')[0]
      })
      .done(function(data) {
        const $targetSectionHTML = $(data).find(includeSectionURL.split(' ')[1]);
        $this.append($targetSectionHTML.find('.l-grid:not(.l-grid--halfGutter)'));
      })
      .fail();
    });
  }

  //===================================== document ready
  $(function () {
    // ラジオボタンのページキャッシュ対応のため、ロード時に検索の切り替え状態復元
    // setTimeout(changeSearchType);
  });
})(window.jQuery3_6 || jQuery);
