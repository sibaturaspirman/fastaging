/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';
  
  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  const currentKisyu = queryParametersObject.kisyu ?  queryParametersObject.kisyu.replace('/', '').replace(/\//g, '@@') : '';
  const currentMode = queryParametersObject.mode ?  queryParametersObject.mode : '';
  const modeArray = ['catalog', 'manual', 'technews', 'cad', 'software', 'lib'];
  const keywordsModeArray = ['catalog', 'manual', 'technews'];
  
  const $modalOpenTrigger = $('[data-js-modal-open]');  
  const $modalSelectProducts = $('#modal_select_products');
  const $modalSelectProductsBody = $modalSelectProducts.find('.c-modal__body');
  $modalSelectProductsBody.load('/fa/download/assets/include/modal_select_products.html #contents');
  
  const $downloadFilter = $('[data-js-downloadfilter]');
  const $downloadFilterTabTrigger = $downloadFilter.find('[data-js-tab-trigger]');
  const $downloadFilterSubmit = $('[data-js-downloadFilter-submit]');
  const $downloadFilterInput = $('[data-js-downloadfilter-input]');
  const $downloadFilterConditions = $('[data-js-downloadFilter-conditions]');
  const downloadFilterConditionsHtml = {
    catalog: {},
    manual: {},
    cad: {},
    technews: {},
    software: {},
    lib: {}
  };

  const $downloadBatchDownloadBtn = $('.c-downloadResultController__batchDownload .c-btn--sub');
    
  const $downloadResultSummary = $('.c-downloadResultSummary');
  const $downloadResultController = $('.c-downloadResultController');
  const $downloadResultControllerCadBatchDownload = $('.c-downloadResultController__cadBatchDownload');
  const $downloadResultControllerSorting = $('[data-js-downloadResultController-sorting]');
  const $downloadResultControllerStyle = $('[data-js-downloadResultController-style]');
  const $downloadResultList = $('.c-downloadResultList');
  
  const locationNoQuery = location.origin + location.pathname;
  const isDotPage = location.href.indexOf('.page') > 0;
  let targetLocation = '/fa/download/search.do';
  let locationSearchObject = {};
  
  const jsonRequestUrlObject = {
    catalog: isDotPage ? `/fa/download/data/catalog_${currentKisyu}_page.json` : `/fa/download/data/catalog_${currentKisyu}.json`,
    manual: isDotPage ? `/fa/download/data/manual_${currentKisyu}_page.json` : `/fa/download/data/manual_${currentKisyu}.json`,
    technews: isDotPage ? `/fa/download/techinfo/data/techinfo_${currentKisyu}_page.json` : `/fa/download/techinfo/data/techinfo_${currentKisyu}.json`,
    keycatalog: `/fa/download/data/catalog.json`,
    keymanual: `/fa/download/data/manual.json`,
    keytechnews: `/fa/download/techinfo/data/techinfo.json`,
    cad: isDotPage ? `/fa/download/cad/data/cad_${currentKisyu}_page.json` : `/fa/download/cad/data/cad_${currentKisyu}.json`,
    software: isDotPage ? `/fa/download/software/data/software_${currentKisyu}_page.json` : `/fa/download/software/data/software_${currentKisyu}.json`,
    lib: isDotPage ? `/fa/download/software/data/lib_${currentKisyu}_page.json` : `/fa/download/software/data/lib_${currentKisyu}.json`
  };
  
  // 検索条件や並び替え条件を取得して、ページの表示をリクエスト
  const _requestPage = function() {
    const $downloadFilterActiveTab = $downloadFilter.find('.c-tab__content--open');
    const $downloadFilterActiveSearchBox = $downloadFilterActiveTab.find('.c-searchBox__input');
    const $downloadFilterActiveRadioBtn = $downloadFilterActiveTab.find('.c-list__item:visible .c-radioButton__input:checked');
    const $downloadFilterCheckBox = $downloadFilterActiveTab.find('.c-list__item:visible .c-checkbox__input');

    locationSearchObject = {
      mode: $downloadFilterActiveTab.attr('id').replace('tab_', ''),
      kisyu: '/' + currentKisyu.replace('@@', '/'),
      q: encodeURIComponent($downloadFilterActiveSearchBox.val()),
      sort: $downloadResultControllerSorting.val(),
      style: $downloadResultControllerStyle.val()
    }
        
    $downloadFilterActiveRadioBtn.each(function(index) {
      const $this = $(this);
      locationSearchObject[$this.attr('data-filter-item-param-name')] = $this.val();
    });
    $downloadFilterCheckBox.each(function(index) {
      const $this = $(this);
      if($this.prop('checked')) {
        locationSearchObject[$this.attr('data-filter-item-param-name')] = $this.val();        
      } else {
        locationSearchObject[$this.attr('data-filter-item-param-name')] = $this.attr('data-filter-item-off-value');                
      }
    });
    
    // 使用していないパラメータを削除
    for(const key in locationSearchObject) {
      if(!locationSearchObject[key] || locationSearchObject[key] === 'undefined') {
        delete locationSearchObject[key];
      }
    }
    
    switch($downloadFilterActiveTab.attr('id').replace('tab_', '')) {
      case 'catalog': ;
      case 'manual': 
        if(!currentKisyu) {
          locationSearchObject.mode = 'key' + locationSearchObject.mode;
          delete locationSearchObject['kisyu'];
        };
        targetLocation = '/fa/download/search.do'; break;
      case 'technews':
        if(!currentKisyu) {
          locationSearchObject.mode = 'key' + locationSearchObject.mode;
          delete locationSearchObject['kisyu'];
        };
        targetLocation = '/fa/download/techinfo/search.do'; break;
      case 'cad':
        locationSearchObject.categoryb1 = '';
        locationSearchObject.categoryb2 = '';
        locationSearchObject.categoryb3 = '';
        locationSearchObject.categoryb4 = '';
        targetLocation = '/fa/download/cad/search.do'; break;
      case 'software': ;
      case 'lib':
        targetLocation = '/fa/download/software/search.do'; break;
    }
    
    // 新システムのページを閲覧中の場合は、遷移先ページの拡張子を変更
    if(isDotPage) {
      targetLocation = targetLocation.replace('.do', '.page');
    }
    
    location.href = targetLocation + '?' + decodeURIComponent($.param(locationSearchObject));
  }
  
  // JSONファイルから再帰的にHTMLを生成
  const _perseJsonToHTML = function(modeValue, jsonData, parentIndex) {
    if(jsonData.option) {
      downloadFilterConditionsHtml[modeValue].option = downloadFilterConditionsHtml[modeValue].option || '';
      jsonData.option.forEach(function(value, index) {
        downloadFilterConditionsHtml[modeValue].option += _generateCheckBox(`${modeValue}_${jsonData.childName}${parentIndex}`, value, '', `${modeValue}${parentIndex}_${index}`, `${modeValue}${parentIndex}`, true);
      });
    }
    if(jsonData.child) {
      downloadFilterConditionsHtml[modeValue][jsonData.childName] = downloadFilterConditionsHtml[modeValue][jsonData.childName] || '';
      jsonData.child.forEach(function(value, index) {
        downloadFilterConditionsHtml[modeValue][jsonData.childName] += _generateRadioBtn(`${modeValue}_${jsonData.childName}${parentIndex}`, value, (index === 0) ? 'checked' : '', `${modeValue}${parentIndex}_${index}`, `${modeValue}${parentIndex}`, (parentIndex === '') ? true : false);
        _perseJsonToHTML(modeValue, value, `${parentIndex}_${index}`);
      });
    } else {
      return;
    }
  }
  
  // 検索条件のHTMLをJSONファイルから生成
  const _generateConditionTable = function(modeValue, jsonData) {
    if(jsonData.child) {
      
      _perseJsonToHTML(modeValue, jsonData, '');
      
      if(modeValue === 'catalog' || modeValue === 'manual' || modeValue === 'technews') {
        downloadFilterConditionsHtml[modeValue].all = `
          <table class="c-table__content">
          <tr><th class="c-table__headCell">Select documents</th><td><ul class="c-list c-list--float" data-downloadFilter-list-mode>
          ${downloadFilterConditionsHtml[modeValue].shiryo ? downloadFilterConditionsHtml[modeValue].shiryo : ''}
          </ul></td></tr>
          <tr><th class="c-table__headCell">Select language</th><td><ul class="c-list c-list--float" data-downloadFilter-list-lang>
          ${downloadFilterConditionsHtml[modeValue].lang ? downloadFilterConditionsHtml[modeValue].lang : ''}
          </ul></td></tr>
          <tr><th class="c-table__headCell">Refine further conditions</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-category1>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Large categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category1 ? downloadFilterConditionsHtml[modeValue].category1 : ''}
          </ul>
          <ul class="c-list c-list--float" data-downloadFilter-list-category2>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Medium categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category2 ? downloadFilterConditionsHtml[modeValue].category2 : ''}
          </ul>
          <ul class="c-list c-list--float" data-downloadFilter-list-category3>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Small categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category3 ? downloadFilterConditionsHtml[modeValue].category3 : ''}
          </ul>
          <ul class="c-list c-list--float l-separator-x1-imp">
          ${downloadFilterConditionsHtml[modeValue].option ? downloadFilterConditionsHtml[modeValue].option : ''}
          </ul>
          </td></tr>
          </table>  
        `;  
      }
      if(modeValue === 'cad') {
        downloadFilterConditionsHtml[modeValue].all = `
          <table class="c-table__content">
          <tr><th class="c-table__headCell">Refine further conditions</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-bunruiL>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Large categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category1 ? downloadFilterConditionsHtml[modeValue].category1 : ''}
          </ul>
          <ul class="c-list c-list--float" data-downloadFilter-list-bunriM>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Medium categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category2 ? downloadFilterConditionsHtml[modeValue].category2 : ''}
          </ul>
          <ul class="c-list c-list--float" data-downloadFilter-list-bunriS>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Small categories:</li>
          ${downloadFilterConditionsHtml[modeValue].category3 ? downloadFilterConditionsHtml[modeValue].category3 : ''}
          </ul>
          </td></tr>
          </table>  
        `;  
      }
      if(modeValue === 'software') {
        downloadFilterConditionsHtml[modeValue].all = `
          <table class="c-table__content">
          <tr><th class="c-table__headCell">Select language</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-lang>
          ${downloadFilterConditionsHtml[modeValue].lang ? downloadFilterConditionsHtml[modeValue].lang : ''}
          </ul></td></tr>
          <tr><th class="c-table__headCell">Refine further conditions</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-category>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Product type</li>
          ${downloadFilterConditionsHtml[modeValue].category ? downloadFilterConditionsHtml[modeValue].category : ''}
          </ul>
          </td></tr>
          </table>  
        `;  
      }
      if(modeValue === 'lib') {
        if(isDotPage) {
          downloadFilterConditionsHtml[modeValue].all = `
          <table class="c-table__content">
          <tr><th class="c-table__headCell">Select language</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-lang>
          ${downloadFilterConditionsHtml[modeValue].lang ? downloadFilterConditionsHtml[modeValue].lang : ''}
          </ul>
          </td></tr>
          <tr><th class="c-table__headCell">Refine further conditions</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-category>
          <li class="c-list__item c-list__item--title" style="width: 100%;">Product type</li>
          ${downloadFilterConditionsHtml[modeValue].category ? downloadFilterConditionsHtml[modeValue].category : ''}
          </ul>
          </td></tr>
          </table>  
          `;
        } else {
          downloadFilterConditionsHtml[modeValue].all = `
          <table class="c-table__content">
          <tr><th class="c-table__headCell">Select language</th><td>
          <ul class="c-list c-list--float" data-downloadFilter-list-lang>
          ${downloadFilterConditionsHtml[modeValue].lang ? downloadFilterConditionsHtml[modeValue].lang : ''}
          </ul>
          </td></tr>
          </table>  
          `;
        }
      }
    }
  }
  
  // 検索条件のラジオボタン生成
  const _generateRadioBtn = function(radioBtnName, data, radioBtnChecked, listItemClass, listItemParentClass, isShow = false) {
    return `
      <li class="c-list__item ${listItemParentClass}" data-filter-item-category="${listItemClass}" ${isShow ? '' : 'style="display: none;"'}>
      <label class="c-radioButton">
      <input class="c-radioButton__input" type="radio" name="${radioBtnName}" data-filter-item-param-name="${data.paramName}" value="${data.value}" ${radioBtnChecked}>
      <span class="c-radioButton__text">${data.name}</span>
      </label>
      </li>
    `;
  }
  
  // 検索条件のチェックボックス生成
  const _generateCheckBox = function(checkBoxName, data, checkBoxChecked, listItemClass, listItemParentClass, isShow = false) {
    return `
      <li class="c-list__item ${listItemParentClass}" data-filter-item-category="${listItemClass}" ${isShow ? '' : 'style="display: none;"'}>
      <label class="c-checkbox">
      <input class="c-checkbox__input" type="checkbox" id="${data.id}" name="${checkBoxName}" data-filter-item-param-name="${data.paramName}" value="${data.value}" data-filter-item-off-value="${data.offValue}" ${checkBoxChecked}>
      <span class="c-checkbox__text">${data.name}</span>
      </label>
      </li>
    `;
  }
  
  // 検索条件のラジオボタンを更新
  const _updateRadioBtns = function() {
    const $downloadFilterActiveTab = $downloadFilter.find('.c-tab__content--open');
    const $downloadFilterConditionsTr = $downloadFilterActiveTab.find('[data-js-downloadfilter-conditions] tr');
    $downloadFilterConditionsTr.removeClass('hide');
    
    $downloadFilterConditions.each(function() {
      const $this = $(this);
      $this.find('.c-table__content .c-list:not(:eq(0)) .c-list__item:not(.always_shown)').hide();
      let $activeRadioBtn = $this.find('.c-table__content .c-list:eq(0) .c-radioButton__input:checked');
      let activeRadioBtnGroupClass = $activeRadioBtn.closest('.c-list__item').attr('data-filter-item-category');
      
      while($activeRadioBtn.length > 0) {
        $(`.${activeRadioBtnGroupClass}`).show();
        $(`.${activeRadioBtnGroupClass}`).siblings('.c-list__item--title').show();
        $activeRadioBtn = $(`.${activeRadioBtnGroupClass}`).find('.c-radioButton__input:checked');
        activeRadioBtnGroupClass = $activeRadioBtn.closest('.c-list__item').attr('data-filter-item-category');
      }
    });
    
    // 検索条件に表示された項目が無い行は非表示
    $downloadFilterConditionsTr.each(function(index) {
      const $this = $(this);
      if($this.has('.c-list__item:visible').length === 0) {
        $this.addClass('hide');
      }
    });
  }

  // サーバー名取得（MIND）
  const getServerName = function() {
    const nowhref = top.location.href;
    const buff1 = nowhref.split("//");
    const buff2 = buff1[1].split("/");
    return buff2[0];
  }
  
  // 資料分類:機種IDの形式のデータを取得する（MIND）
  const getprememInfo = function() {
    let prememInfo = $(".c-tab__trigger--active").data("js-bulk-prememinfo");
    let arr = Array();
    if(prememInfo == undefined || prememInfo.length == 0){
      return arr;
    }
    prememInfo = prememInfo.split('|');
    for(let p of prememInfo){
      let tmpshiryo = p.split(":")[0];
      let parr = p.split(":")[1];
      if(p.indexOf(',') != -1){
        parr = p.split(":")[1].split(",");
        for(let kisyuid of parr){
          let tmp = Object();
          tmp.shiryoId = tmpshiryo;
          tmp.kisyuId = kisyuid; 
          arr.push(tmp);
        }
      }else{
        let tmp = Object();
        tmp.shiryoId = tmpshiryo;
        tmp.kisyuId = parr; 
        arr.push(tmp);
  
      }
      
    }
    return arr;
  }
  
  // ユーザーの権限保有の資料分類:機種IDの合致確認（MIND）
  const checkprememInfo = function(prememInfo, shiryoid, kisyuid) {
    if(prememInfo.length == 0){
      return false;
    }
    for(let p of prememInfo){
      if(p.kisyuId ==kisyuid && p.shiryoId == shiryoid){
        return true;
      }
    }
    return false;
  }
    
  // イベント登録
  const initEvent = function() {
    // ページ更新リクエスト
    $downloadFilterInput.on('change.submit', _requestPage);
    $downloadFilterSubmit.on('click.submit', _requestPage);
    $downloadResultControllerSorting.on('change.sorting', _requestPage);
    
    // リスト表示・タイル表示切り替え
    $downloadResultControllerStyle.on('change.style', function() {
      const styleType = $(this).val();
      switch(styleType) {
        case '0': $downloadResultList.removeClass('l-tile--listMode'); break;
        case '1': $downloadResultList.addClass('l-tile--listMode'); break;
        default: console.log('該当スタイル無し');
      }
    });
    
    // タブのhrefをリンク先の値に変更して、通常のタブ切り替えイベント削除
    $downloadFilterTabTrigger.each(function() {
      const $this = $(this);
      const targetMode = $this.attr('href').replace('#tab_', '');

      // kisyuパラメータが存在しない場合は、キーワード検索として動作
      if(!currentKisyu) {
        locationSearchObject.mode = 'key' + targetMode;
        let tempKeyword = '';
        $downloadFilterInput.each(function() {
          tempKeyword += $(this).val();
        });
        if(tempKeyword.length > 0) {
          locationSearchObject.q = tempKeyword;
        }
      } else {
        locationSearchObject.mode = targetMode;
        locationSearchObject.kisyu = '/' + currentKisyu.replace('@@', '/');
      };
          
      switch(targetMode) {
        case 'catalog': ;
        case 'manual': 
          targetLocation = '/fa/download/search.do'; break;
        case 'technews':
          targetLocation = '/fa/download/techinfo/search.do'; break;
        case 'cad':
          targetLocation = '/fa/download/cad/search.do'; break;
        case 'software': ;
        case 'lib':
          targetLocation = '/fa/download/software/search.do'; break;
      }
      
      // 新システムのページを閲覧中の場合は、遷移先ページの拡張子を変更
      if(isDotPage) {
        targetLocation = targetLocation.replace('.do', '.page');
      }

      // タブのトリガーのリンクを修正し、タブ切り替えのイベントを削除して通常の動作に変更
      $this.attr('href', targetLocation + '?' + decodeURIComponent($.param(locationSearchObject)));
      $this.off('click');
    });

    // CAD・ソフトウェアのダウンロード画面にアクセスする際、国・地域確認モーダルを表示
    $('a[href*="/fa/download/cad/"], a[href*="/fa/download/software/"]').on('click.modal', function(e) {
      e.preventDefault();
      const $this = $(this);
      const cookiesObject = MEL_SETTINGS.helper.getCookies();
      let targetURL = $this.attr('href');
      const targetID = targetURL.indexOf('cad') > -1 ? '#modal_cad' : '#modal_software';

      if(cookiesObject.fa_country_region) {
        // 国・地域の選択あり
        document.location = targetURL;
      } else {
        // 国・地域の選択なし
        // ダウンロードトップHTMLを取得し、国・地域選択するモーダルを表示
        $.ajax({
          url: '/fa/download/index.html',
          dataType: 'html'
        })
        .done(function(data) {
          const $parsedHTML = $(data);
          const $modalCadHtml = $parsedHTML.find(targetID);
          $('body').append($modalCadHtml);
          $.simpleModalOpen(targetID, {ajaxContentFlag: false});

          // 国・地域選択確認
          $('.c-modal .u-icons.u-icons--bulletRight').on('click.cookie', function(e) {
            e.preventDefault();
            const $this = $(this);
            targetURL = $this.attr('href') === '#' ? targetURL : $this.attr('href');
            const selectedCountryRegion = $(this).text();
            const expirationDays = 7;
            let expiresValue = new Date();
            expiresValue.setDate(expiresValue.getDate() + expirationDays);
            const maxAgeValue = 60 * 60 * 24 * expirationDays;
            if(selectedCountryRegion.length > 0) {
              document.cookie = 'fa_country_region=' + $this.text() + '; path=/fa; expires=' + expiresValue.toUTCString() + '; max-age=' + maxAgeValue + '; SameSite=Strict';
              document.location = targetURL;
            }
          });
        })
        .fail(function() {
          console.log('国・地域選択モーダル取得エラー');
        });
      }
    });
    
    // 製品・サービス選択モーダル表示時にmode指定、インクルードしたファイルの該当箇所のみ表示
    $modalOpenTrigger.on('click.modal', function() {
      const thisTabMode = $(this).closest('.c-tab__content').attr('id');
      $('.c-modal__body').attr('id', thisTabMode);
    });
  }
  
  // 検索条件・設定ファイルの読み込み、初期設定
  if(currentKisyu) {
    // 設定条件のファイル存在チェック
    modeArray.forEach(function(modeValue, index) {
      $.ajax({
        url: jsonRequestUrlObject[modeValue],
        async : false,
        dataType: 'JSON'
      })
      .done(function(data) {})
      .fail(function(jqXHR, textStatus, errorThrown) {
        jsonRequestUrlObject[modeValue] = '/fa/download/data/noconditions.json';
      });
    });
    
    $.when(
      $.getJSON(jsonRequestUrlObject.catalog),
      $.getJSON(jsonRequestUrlObject.manual),
      $.getJSON(jsonRequestUrlObject.technews),
      $.getJSON(jsonRequestUrlObject.cad),
      $.getJSON(jsonRequestUrlObject.software),
      $.getJSON(jsonRequestUrlObject.lib)
    )
    .done(function(catalog_data, manual_data, technews_data, cad_data, software_data, lib_data){
      const dataArray = [catalog_data[0].catalog, manual_data[0].manual, technews_data[0].techinfo, cad_data[0].cad, software_data[0].software, lib_data[0].lib];

      modeArray.forEach(function(modeValue, index) {
        // 検索条件が空の場合はタブを不活性
        if(Object.keys(dataArray[index]).length > 0) {
          _generateConditionTable(modeValue, dataArray[index]);          
        } else {
          $downloadFilterTabTrigger.filter(`[href="#tab_${modeValue}"]`).addClass('disable');
        };
      });
      
      if($downloadFilterConditions.length > 0) {
        $downloadFilterConditions.each(function() {
          const $this = $(this);
          const mode = $this.attr('data-js-downloadFilter-conditions');
          $this.html(downloadFilterConditionsHtml[mode]['all']);
        });
        
        _updateRadioBtns();
        
        const $downloadFilterConditionsRadioBtns = $downloadFilterConditions.find('.c-radioButton__input');
        $downloadFilterConditionsRadioBtns.on('change.filter', _updateRadioBtns);
      }

      
      // 初期設定・状態復元
      // タブメニューの生成のタイミング調整のため、setTimeoutを設定
      setTimeout(function() {
        const $downloadFilterActiveTab = $downloadFilter.find('.c-tab__content--open');
                  
        //　キーワード
        if(queryParametersObject.q) {
          const $downloadFilterActiveSearchBox = $downloadFilterActiveTab.find('.c-searchBox__input');
          $downloadFilterActiveSearchBox.val(queryParametersObject.q);
        }
        // キーワード以外
        for (const property in queryParametersObject) {
          if(property !== 'q') {
              const $downloadFilterActiveItems = $downloadFilterActiveTab.find(`.c-list__item:visible [data-filter-item-param-name="${property}"]`);
              $downloadFilterActiveItems.each(function() {
                const $this = $(this);
                if($this.val() === queryParametersObject[property]) {
                  $this.trigger('click');
                }
              });            
          }
        }
      
        // 検索条件に表示された項目が無い行は非表示
        const $downloadFilterConditionsTr = $downloadFilterActiveTab.find('[data-js-downloadfilter-conditions] tr');
        $downloadFilterConditionsTr.each(function(index) {
          const $this = $(this);
          if($this.has('.c-list__item:visible').length === 0) {
            $this.addClass('hide');
          }
        });
      }, 100);

      
      // 並び替え設定復元
      if(queryParametersObject.sort) {
        if(queryParametersObject.sort === '2') {
          $downloadResultControllerSorting.find('option[value="2"]').prop('selected', true);
        }
      }
      // 表示形式復元
      if(queryParametersObject.style) {
        if(queryParametersObject.style === '1') {
          $downloadResultControllerStyle.find('option[value="1"]').prop('selected', true);
          $downloadResultList.addClass('l-tile--listMode');
        }
      }
      
      // 技術資料 kisyu=/lvcb, mode=curveの場合は、大分類：すべてを非表示
      if(currentKisyu === 'lvcb' && currentMode === 'curve') {
        const $radioButtonForAll = $('[data-downloadfilter-list-category1]').find('.c-list__item:visible .c-radioButton__input[value="0"]')
        const $radioButtonForAllWrapper = $radioButtonForAll.closest('.c-list__item')
        if($radioButtonForAll.prop('checked')) {
          $radioButtonForAllWrapper.next().find('.c-radioButton__input').trigger('click');          
        }
        $radioButtonForAllWrapper.remove();
      }
      
      // CADページにおいて一括ダウンロードのリンクが#の場合はエリアを非表示
      if($downloadResultControllerCadBatchDownload.find('.c-btn').attr('href') === '#') {
        $downloadResultController.hide();
      }
    })
    .fail(function(){
      console.log('絞り込み条件エラー');
    });
  } else {
    // キーワード横断検索
    $.when(
      $.getJSON(jsonRequestUrlObject.keycatalog),
      $.getJSON(jsonRequestUrlObject.keymanual),
      $.getJSON(jsonRequestUrlObject.keytechnews),
    )
    .done(function(catalog_data, manual_data, technews_data){
      const dataArray = [catalog_data[0].catalog, manual_data[0].manual, technews_data[0].techinfo];

      keywordsModeArray.forEach(function(modeValue, index) {
        _generateConditionTable(modeValue, dataArray[index]);
      });
      
      if($downloadFilterConditions.length > 0) {
        $downloadFilterConditions.each(function() {
          const $this = $(this);
          const mode = $this.attr('data-js-downloadFilter-conditions');
          $this.html(downloadFilterConditionsHtml[mode]['all']);
        });
        
        _updateRadioBtns();
        
        const $downloadFilterConditionsRadioBtns = $downloadFilterConditions.find('.c-radioButton__input');
        $downloadFilterConditionsRadioBtns.on('change.filter', _updateRadioBtns);
      }
      
      
      // 初期設定・状態復元
      // タブメニューの生成のタイミング調整のため、setTimeoutを設定
      setTimeout(function() {
        const $downloadFilterActiveTab = $downloadFilter.find('.c-tab__content--open');
        
        //　キーワード
        if(queryParametersObject.q) {
          const $downloadFilterActiveSearchBox = $downloadFilterActiveTab.find('.c-searchBox__input');
          $downloadFilterActiveSearchBox.val(queryParametersObject.q);
        }
        // キーワード以外
        for (const property in queryParametersObject) {
          if(property !== 'q') {
            const $downloadFilterActiveItems = $downloadFilterActiveTab.find(`.c-list__item:visible [data-filter-item-param-name="${property}"]`);
            $downloadFilterActiveItems.each(function() {
              const $this = $(this);
              if($this.val() === queryParametersObject[property]) {
                $this.trigger('click');
              } else if($this.val() === queryParametersObject['mode'].replace('key', '')) {
                $this.trigger('click');                
              }
            });
          }
        }
        
        // 検索条件に表示された項目が無い行は非表示
        const $downloadFilterConditionsTr = $downloadFilterActiveTab.find('[data-js-downloadfilter-conditions] tr');
        $downloadFilterConditionsTr.each(function(index) {
          const $this = $(this);
          if($this.has('.c-list__item:visible').length === 0) {
            $this.addClass('hide');
          }
        });
      }, 100);
      
      // 並び替え設定復元
      if(queryParametersObject.sort) {
        if(queryParametersObject.sort === '2') {
          $downloadResultControllerSorting.find('option[value="2"]').prop('selected', true);
        }
      }
      // 表示形式復元
      if(queryParametersObject.style) {
        if(queryParametersObject.style === '1') {
          $downloadResultControllerStyle.find('option[value="1"]').prop('selected', true);
          $downloadResultList.addClass('l-tile--listMode');
        }
      }
    })
    .fail(function(){
      console.log('絞り込み条件エラー');
    });
  }
  
  // ソフトウェア・サンプルライブラリページのアコーディオンで保持するsessionStorageが存在し、クエリパラメータも含めて一致する場合に状態を復元
  // cache-control: no-cacheが指定されているページでも初期動作させるために、pageshowイベントを利用
  $(window).on('pageshow', function() {
    if(sessionStorage.getItem('openedAccordionTriggers') && sessionStorage.getItem('openedAccordionCurrentURL').indexOf(queryParametersObject.mode) > 0 && sessionStorage.getItem('openedAccordionCurrentURL').indexOf(queryParametersObject.kisyu) > 0) {
      sessionStorage.getItem('openedAccordionTriggers').split(',').forEach(function(value, index) {
        const $targetAccordionTrigger = $('[data-js-gs18-accordion-trigger], [data-js-accordion-trigger]').eq(value);
        if($targetAccordionTrigger.hasClass('is-open')) {
        } else {
          $targetAccordionTrigger.trigger('click');
        }
      });
    }

    // URLでaccordionパラメータが指定されている場合は、該当の箇所を開きその位置までスクロール
    if(queryParametersObject.accordion) {
      queryParametersObject.accordion.split('_').forEach(function(value, index) {
        const $targetAccordionTrigger = $('[data-js-gs18-accordion-trigger], [data-js-accordion-trigger]').eq(value - 1);
        if($targetAccordionTrigger.hasClass('is-open')) {
        } else {
          $targetAccordionTrigger.trigger('click');
        }
        if(index === 0) {
          const targetAccordionTopPosition = $targetAccordionTrigger.offset().top - 30;
          $('html, body').animate({ scrollTop: targetAccordionTopPosition}, 500, 'swing');
        }
      });
    }
  });
  
  // // 一括ダウンロードボタン
  // $downloadResultList.find('[data-js-bulk-docid]').on('change', function() {
  //   // チェック済み要素の取得
  //   const $checkedItems = $downloadResultList.find('input:checked');
  //   if($checkedItems.length === 0) {
  //     $downloadBatchDownloadBtn.addClass('disabled');
  //   } else {
  //     $downloadBatchDownloadBtn.removeClass('disabled');
  //   }
  // });

  // $downloadBatchDownloadBtn.on('click.download', function(){
  //   const $tabTriggerActive = $(".c-tab__trigger--active");    
  //   const checkfilecount = $tabTriggerActive.attr("data-js-bulk-checkfilecount");
  //   const checkfilesize = $tabTriggerActive.attr("data-js-bulk-checkfilesize");
  //   const loginstatus = $tabTriggerActive.attr("data-js-bulk-loginstatus");
  //   const callaction = $tabTriggerActive.attr("data-js-bulk-callaction");
  //   const prememInfo = getprememInfo();
  //   const errmesinfo = $tabTriggerActive.attr("data-js-bulk-errmesinfo");

  //   // prememInfoは以下のような出力
  //   // data-js-bulk-prememInfo="1:1,2|3:1|4:1,2,3"
  //   // 資料分類:機種IDの形式

  //   // errmesinfoは以下のような出力
  //   // data-js-bulk-errmesinfo="99:システムエラーです。|1:パラメータが不正です。|2:ファイルパスの取得が出来ませんでした。|3:ログインしてください。|4:一括ダウンロード可能なファイル数(5)を超えています。|5:一括ダウンロード可能なファイルサイズ（50.00MB）を超えています。|6:システムエラーです。|7:権限が足りません。|8:ファイル存在しません。"
  //   // 数字部分はエラーコード

  //   // エラーメッセージをハッシュを作成
  //   const meshash = {};
  //   errmesinfo.split('|').forEach(function(valuearray1) {
  //     let tmpCount = 0;
  //     let tmpMesCode = "";
  //     let tmpMesMessage = "";
  //     valuearray1.split(':').forEach(function(valuearray2) {
  //       if (tmpCount == 0) {
  //         tmpMesCode = valuearray2;
  //       } else {
  //         tmpMesMessage = valuearray2;
  //       }
  //       tmpCount = tmpCount + 1;
  //     })
  //     meshash[tmpMesCode] = tmpMesMessage;
  //   })

  //   let checkSelectFileSize = 0; // ファイルサイズのチェック
  //   //let checkSelectFileCount = 0 ; // ファイル数のチェック
  //   let checkSelectLogin = false; // ログインチェック
  //   let checkSelectPreMem = false; // プレミアムメンバーチェック

  //   // チェック済み要素の取得
  //   const $checkedItems = $downloadResultList.find('input:checked');

  //   // 選択ファイル数の入力チェック
  //   if (checkfilecount < $checkedItems.length) {
  //     alert(meshash['4']);
  //     return;
  //   }
  //   let failflg = false;
  //   let msgno = 0;
  //   $checkedItems.each(function(index, element) {
  //     const tmp = Object();
  //     tmp.filesize = $(element).data('js-bulk-filesize');
  //     checkSelectFileSize = tmp.filesize + checkSelectFileSize;
  //     //未ログインでプレミアム対象アイテムの場合
  //     if ($(element).data('js-bulk-premembertype') == '1' && loginstatus != '1') {
  //       msgno = 3;  
  //       //alert(meshash['3']);
  //       failflg = true;
  //       return false;
  //     }
  //     //ログインでプレミアム対象アイテムの場合
  //     if ($(element).data('js-bulk-premembertype') == '1' && loginstatus == '1' && !checkprememInfo(prememInfo, $(element).data('js-bulk-linktoshiryoid'), tmp.linkKisyuId)) {
  //       //alert(meshash['7']);
  //       msgno = 7;
  //       failflg = true;
  //       return false;
  //     }
  //   });
  //   if (checkfilesize < checkSelectFileSize) {  
  //     alert(meshash['5']);
  //     return;
  //   }
  //   if(failflg){
  //     alert(meshash[msgno]);
  //     return;
  //   }

  //   // パラメータ（チェックボックス選択）を作成
  //   const arr = Array();
  //   $checkedItems.each(function(index, element) {
  //     const tmp = Object();
  //     tmp.kisyuId = $(element).data('js-bulk-kisyuid');
  //     tmp.docId = $(element).data('js-bulk-docid');
  //     //tmp.shiryoId = $(element).data('js-bulk-shiryoid');
  //     tmp.linkKisyuId = $(element).data('js-bulk-linkkisyuid');
  //     tmp.linkDocId = $(element).data('js-bulk-linkdocid');
  //     //tmp.linkShiryoId = $(element).data('js-bulk-linktoshiryoid');

  //     tmp.membertype = $(element).data('js-bulk-membertype');
  //     tmp.premembertype = $(element).data('js-bulk-premembertype');
  //     if (tmp.membertype == '1') {
  //       checkSelectLogin = true;
  //     }
  //     tmp.dispNo = $(element).data('js-bulk-dispno');  
  //     tmp.fileType = $(element).data('js-bulk-filetype');  
  //     arr.push(tmp);
  //   });

  //   //チェックなし
  //   if(arr.length == 0){
  //     return;
  //   }
  //   // ログインチェック
  //   if (checkSelectLogin && loginstatus != '1') {
  //     alert(meshash['3']);
  //     // TODO ログイン画面に遷移させるかはCNT様判断
  //     return;
  //   }

  //   const json = Object();
  //   json.fileInfoList = arr;
    
  //   // ajax呼び出し
  //   $.ajax({
  //     url: callaction,
  //     type: "POST",
  //     contentType: "application/json",
  //     data: JSON.stringify(json),
  //     dataType: "json",
  //   }).done(function(data, textStatus, jqXHR) {
  //     // jsonの結果を解析
  //     if (data.code == "0") {
  //       // 正常系ルート
  //       // ファイルのダウンロード
  //       const nowServerName = getServerName();

  //       // チェックボックスをクリア
  //       const $checkbox = $('input[type="checkbox"]');
  //       $checkbox.removeAttr('checked').prop('checked', false).change();
        
  //       const downloadfullpath = location.origin + data.downloadpath;
  //       window.open(downloadfullpath);
  //     } else {
  //       // エラー系
  //       // メッセージを表示する
  //       alert(data.errmes)
  //     }
  //   }).fail(function (jqXHR, textStatus, errorThrown) {
  //     const er = jqXHR.status
  //     alert("システムエラー：" + er);
  //   });
  // });
  
  //===================================== document ready
  $(function() {
    
    initEvent();
    
  });
})(window.jQuery3_6 || jQuery);
