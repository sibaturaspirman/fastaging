/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';
  
  /* 変数 */
  var allMovieObject = {};
  
  var resultPerPage = 80;
  var resultCurrentPage = 1;
  var resultMaxPage = 1;
  
  var $mediaLibrarySearchInput = $('[data-js-media-library-search-input]');
  var $mediaLibrarySearchButton = $('[data-js-media-library-search-button]');
  var $mediaLibraryFilterDropDownTrigger = $('[data-js-media-library-filter-dropDown-trigger]');
  var $mediaLibraryFilterDropDown = $('[data-js-media-library-filter-dropDown]');
  var $mediaLibraryFilterSubmit = $('[data-js-media-library-filter-submit]');
  var $mediaLibraryFilterReset = $('[data-js-media-library-filter-reset]');
  var $mediaLibraryFilterProduct = $('[data-js-media-library-filter-product-2nd]');
  var $mediaLibraryFilterCategory = $('[data-js-media-library-filter-category]');
  var $mediaLibraryFilterLanguage = $('[data-js-media-library-filter-language]');
  var $mediaLibraryResultWrapper = $('[data-js-media-library-result-wrapper]');
  var $mediaLibraryResult = $('[data-js-media-library-result]');
  var $mediaLibraryResultSummary = $('[data-js-media-library-result-summary]');
  var $mediaLibraryResultControlsNumber = $('[data-js-media-library-result-controls-number]');
  var $mediaLibraryResultControlsStyle = $('[data-js-media-library-result-controls-style]');
  var $mediaLibraryResultControlsSort = $('[data-js-media-library-result-controls-sort]');
  var $mediaLibraryResultPagination = $('[data-js-pagination]');
  var $mediaLibraryResultPaginationPrev = $('[data-js-pagination-prev]');
  var $mediaLibraryResultPaginationFraction = $('[data-js-pagination-fraction]');
  var $mediaLibraryResultPaginationNext = $('[data-js-pagination-next]');
  var $mediaLibraryRecommendedWrapper = $('[ data-js-media-library-recommended-wrapper]');
  var $mediaLibraryRecommended = $('[data-js-media-library-recommended]');
  
  var $modalMovie = $('[data-js-modal]');
  var $modalMovieClose = $modalMovie.find('.c-modal__close, [data-js-modal_bg]');
  var $modalMovieTitle = $modalMovie.find('.c-modal__title');
  var $modalMovieWrapper = $modalMovie.find('.c-movie');
  var $modalMovieDescription = $modalMovie.find('.c-modal__description');
  
  var mediaLibraryResultStyle = 'tile';//ToDo: Cookieから値復元
  var mediaLibraryResultSort = 'new';//ToDo: Cookieから値復元
  var mediaLibraryResultItems = '';
  var recommendedMovieIDArray = Array();
  var mediaLibraryRecommendedItems = '';
  
  var mediaLibraryLabels = {
    all: 'All',
    resultSummary0: 'No videos were found that match your criteria.<br>Please change the keyword or condition and search again.',
    resultSummary1: 'videos found',
    resultUnit: '&emsp;',
    resultTitle: 'Search Result',
    shown: '掲載する'
  }
  var mediaLibraryi18n = {
    'すべて': 'All',
    'シーケンサ MELSEC':'Programmable Controllers MELSEC',
    'サーボシステムコントローラ':'Motion Controllers',
    '数値制御装置(CNC)':'CNC',
    'FAセンサ MELSENSOR':'FA Sensor MELSENSOR',
    'ACサーボ MELSERVO':'AC Servos-MELSERVO',
    'インバータ FREQROL':'Inverters-FREQROL',
    'ギヤードモータ':'Geared Motors',
    'テンションコントローラ':'Tension Controllers',
    '表示器 GOT':'Human Machine Interfaces-GOT',
    '産業用ロボット':'Industrial Robots-MELFA',
    '低圧遮断器':'Low-voltage Circuit Breakers',
    '電力管理用計器':'Power Management Meters',
    '省エネ支援機器':'Energy Saving Supporting Devices',
    '配電監視システム':'Power Monitoring Products',
    '無停電電源装置(UPS)':'UPS',
    'レーザ加工機 MELLASER':'Laser Processing Machines',
    '放電加工機(EDM)':'Electrical Discharge Machines',
    '電子ビーム加工機(EBM)':'Electro Beam Machines',
    '金属3Dプリンタ(AM)':'Additive Manufacturing',
    'Edgecross対応ソフトウェア':'Software',
    'ソリューション':'Solutions',
    'ソフトウェア':'Software',
    'サービス':'Service',
    'その他':'Other',
    '製品紹介': 'Products',
    'コンセプト': 'Concept',
    '事例': 'Case Study',
    'サンプル加工': 'Sample Processing',
    '操作説明': 'Operation Explanation',
    '展示会': 'Exhibition',
    '日本語': 'Japanese',
    '英語': 'English',
    '中国語': 'Chinese',
    'その他言語':'Others'
  }
  
  var filterKeywordArray = [];
  var filterProductArray = [];
  var filterCategoryArray = [];
  var filterLanguageArray = [];
  
  var queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  var locationNoQuery = location.origin + location.pathname;
  var locationSearch = '';

  
  /* 関数 */
  // 文字列内に配列のワードが含まれるかチェック
  var _isTextContainsArrayWords = function(arr, str) {
    return arr.filter(keyword => {
      var reg = new RegExp(keyword.replace('(', '\\(').replace(')', '\\)'), 'i');
      return str.match(reg);
    }).length > 0
  }// _isTextContainsArrayWords()
  
  
  // 動画タイルパーツ生成（フル要素）
  var _generateMovieCard = function(movieID) {
    var cardElement = '';
    var moviePublishedDate = allMovieObject[movieID]['publishedAt'].slice(0, 10);
    var moviePublishedDateObject =  new Date(moviePublishedDate);
    var nowDateObject = new Date();
    var diffDate = Math.floor((nowDateObject.getTime() - moviePublishedDateObject.getTime()) / (1000 * 60 * 60 * 24));
    var newFlag = (diffDate < 30) ? 'new' : '';
    
    if(movieID) {
      cardElement = `<div class="l-tile__item">
      <div class="c-card c-card--movie ${newFlag}">
      <a class="c-card__link" href="#modal_movie" data-js-modal-movie-open data-js-movie-id="${movieID}">
      <div class="c-card__head">
      <div class="c-card__img">
      <img src="http://img.youtube.com/vi/${movieID}/sddefault.jpg" alt="" decoding="async">
      </div><!-- /.c-card__img -->
      </div><!-- /.c-card__head -->
      <div class="c-card__body">
      <div class="c-card__row">
        <span class="c-card__date">${moviePublishedDate}</span>&nbsp;
        <span class="c-card__language">${allMovieObject[movieID]['language']}</span>
      </div>
      <p class="c-card__title">${allMovieObject[movieID]['title'].replace(/DQ/g, '"')}</p>
      <p class="c-card__tag">
        ${allMovieObject[movieID]['category1'] ? '<span>' + allMovieObject[movieID]['category1'] + '</span>' : ''}
        ${allMovieObject[movieID]['category2'] ? '<span>' + allMovieObject[movieID]['category2'] + '</span>' : ''}
        ${allMovieObject[movieID]['category3'] ? '<span>' + allMovieObject[movieID]['category3'] + '</span>' : ''}
        ${allMovieObject[movieID]['category4'] ? '<span>' + allMovieObject[movieID]['category4'] + '</span>' : ''}
      </p>
      </div><!-- /.c-card__body -->
      </a><!-- /.c-card__link -->
      </div><!-- /.c-card -->
      </div><!-- /.l-tile__item -->`;
    }
    return cardElement;    
  }// _generateMovieCard()
  
  
  // 動画タイルパーツ生成（コンパクト）
  var _generateCompactMovieCard = function(movieID) {
    var cardElement = '';
    var moviePublishedDate = allMovieObject[movieID]['publishedAt'].slice(0, 10);
    var moviePublishedDateObject =  new Date(moviePublishedDate);
    var nowDateObject = new Date();
    var diffDate = Math.floor((nowDateObject.getTime() - moviePublishedDateObject.getTime()) / (1000 * 60 * 60 * 24));
    var newFlag = (diffDate < 30) ? 'new' : '';

    if(movieID) {
      cardElement = `<div class="l-tile__item">
      <div class="c-card c-card--movie ${newFlag}">
      <a class="c-card__link" href="#modal_movie" data-js-modal-movie-open data-js-movie-id="${movieID}">
      <div class="c-card__head">
      <div class="c-card__img">
      <img src="http://img.youtube.com/vi/${movieID}/sddefault.jpg" alt="" decoding="async">
      </div><!-- /.c-card__img -->
      </div><!-- /.c-card__head -->
      <div class="c-card__body">
      <div class="c-card__row">
        <span class="c-card__date">${moviePublishedDate}</span>&nbsp;
        <span class="c-card__language">${allMovieObject[movieID]['language']}</span>
      </div>
      <p class="c-card__title">${allMovieObject[movieID]['title'].replace(/DQ/g, '"')}</p>
      <p class="c-card__text">${allMovieObject[movieID]['description'].replace(/DQ/g, '"')}</p>
      <p class="c-card__tag">
        ${allMovieObject[movieID]['category1'] ? '<span>' + allMovieObject[movieID]['category1'] + '</span>' : ''}
        ${allMovieObject[movieID]['category2'] ? '<span>' + allMovieObject[movieID]['category2'] + '</span>' : ''}
        ${allMovieObject[movieID]['category3'] ? '<span>' + allMovieObject[movieID]['category3'] + '</span>' : ''}
        ${allMovieObject[movieID]['category4'] ? '<span>' + allMovieObject[movieID]['category4'] + '</span>' : ''}
      </p>
      </div><!-- /.c-card__body -->
      </a><!-- /.c-card__link -->
      </div><!-- /.c-card -->
      </div><!-- /.l-tile__item -->`;
    }
    return cardElement;
  }// _generateCompactMovieCard()
  
    
  // 検索条件に合致する動画を取得し、検索結果のエリアを更新
  var _updateMediaLibraryResults = function(isResetCurrentPage = false) {
    
    // ページャー操作以外では、現在のページを最初に戻す
    if(isResetCurrentPage) {
      resultCurrentPage = 1;      
    }
    
    var filteredMovieObject = {};
    var filteredMovieArray = [];
    var shownMovieIDArray = [];
    
    // URLにmovieパラメータが存在しない場合、フィルターの値を取得してURLに反映
    if(queryParametersObject['movie']) {

    } else {
      _getFilterValue();
    }

    // 各フィルターの配列が空でなければ実行
    filteredMovieObject = allMovieObject;
    if(filterKeywordArray.length > 0) {
      filterKeywordArray.forEach(function(value, index) {
        filteredMovieObject = Object.keys(filteredMovieObject).reduce(
          (previousValue, key) => (_isTextContainsArrayWords(new Array(value), filteredMovieObject[key].title + ',' + filteredMovieObject[key].description) ? { ...previousValue, [key]: filteredMovieObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterProductArray.length > 0) {
      filteredMovieObject = Object.keys(filteredMovieObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterProductArray, filteredMovieObject[key].products) ? { ...previousValue, [key]: filteredMovieObject[key] } : previousValue),
        {}
      );
    }
    if(filterCategoryArray.length > 0) {
      filteredMovieObject = Object.keys(filteredMovieObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterCategoryArray, filteredMovieObject[key].category1 + ',' + filteredMovieObject[key].category2 + ',' +  filteredMovieObject[key].category3 + ',' +  filteredMovieObject[key].category4) ? { ...previousValue, [key]: filteredMovieObject[key] } : previousValue),
        {}
      );
    }
    if(filterLanguageArray.length > 0) {
      filteredMovieObject = Object.keys(filteredMovieObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterLanguageArray, filteredMovieObject[key].language) ? { ...previousValue, [key]: filteredMovieObject[key] } : previousValue),
        {}
      );
    }

    // フィルターヒット件数表示
    var filteredMovieObjectLength = Object.keys(filteredMovieObject).length;
    if(filteredMovieObjectLength > 0) {
      $mediaLibraryResultPagination.removeClass('hide');
      $mediaLibraryResultSummary.html('<em>' + filteredMovieObjectLength + mediaLibraryLabels.resultUnit + '</em>' + mediaLibraryLabels.resultSummary1);
    } else {
      $mediaLibraryResultPagination.addClass('hide');
      $mediaLibraryResultSummary.html(mediaLibraryLabels.resultSummary0);      
    }
    resultMaxPage = Math.ceil(Object.keys(filteredMovieObject).length / resultPerPage);

    // ページャーに現在のページと最大ページ数を表示
    if(resultMaxPage == 0) {
      $mediaLibraryResultPaginationFraction.text('1 / 1');
      $mediaLibraryResultPaginationPrev.addClass('disable');
      $mediaLibraryResultPaginationNext.addClass('disable');
    } else {
      $mediaLibraryResultPaginationFraction.text(resultCurrentPage + ' / ' + resultMaxPage);
    }
    if(resultCurrentPage == 1) {
      $mediaLibraryResultPaginationPrev.addClass('disable');
    } else {
      $mediaLibraryResultPaginationPrev.removeClass('disable');
    }
    if(resultCurrentPage == resultMaxPage) {
      $mediaLibraryResultPaginationNext.addClass('disable');
    } else {
      $mediaLibraryResultPaginationNext.removeClass('disable');
    }
    
    // 並び替え
    filteredMovieArray = Object.keys(filteredMovieObject).map(function(key) {
      return {...filteredMovieObject[key], "youTubeID": key};
    }).sort(function(a, b) {
      if(mediaLibraryResultSort === 'new') {
        return (a.publishedAt > b.publishedAt) ? -1 : 1;  //日付降順
      }
      if(mediaLibraryResultSort === 'views') {
        return (a.viewCount > b.viewCount) ? -1 : 1;  //再生回数降順
      }
    });    

    // 1ページあたりのカード表示数と現在のページ数から、表示対象のオブジェクトを定義
    for(var movieCount = resultPerPage * (resultCurrentPage - 1); movieCount < resultPerPage * resultCurrentPage; movieCount++) {
      if(movieCount < filteredMovieArray.length) {
        var tempMovieObjectKey = filteredMovieArray[movieCount]['youTubeID'];
        shownMovieIDArray.push(tempMovieObjectKey);
      }
    }
    
    mediaLibraryResultItems = shownMovieIDArray.map(_generateCompactMovieCard);
    $mediaLibraryResult.html(mediaLibraryResultItems);
  }// _updateMediaLibraryResults()
  
  
  // 絞り込み条件の取得とURLへの反映
  var _getFilterValue = function() {
    filterKeywordArray = [];
    filterProductArray = [];
    filterCategoryArray = [];
    filterLanguageArray = [];
    locationSearch = '';

    // フィルター項目取得
    if($mediaLibrarySearchInput.val() != '') {
      filterKeywordArray = $mediaLibrarySearchInput.val().replace('　',' ').split(' ');      
    }
    $mediaLibraryFilterProduct.find('option:selected').each(function() {
      var $this = $(this);
      if($this.text() !== mediaLibraryLabels.all) {
        filterProductArray.push($this.val());      
      } 
    });
    $mediaLibraryFilterCategory.find('.c-checkbox__input:checked').each(function() {
      var $this = $(this);
      filterCategoryArray.push($this.val());
    });
    if($mediaLibraryFilterLanguage.find('.c-checkbox__input:checked').length > 0) {
      $mediaLibraryFilterLanguage.find('.c-checkbox__input:checked').each(function() {
        var $this = $(this);
        filterLanguageArray.push($this.val());
      });      
    }

    // URLにフィルタ条件反映
    if(filterKeywordArray.concat(filterProductArray, filterCategoryArray, filterLanguageArray).length > 0) {      
      var tempFilterKeywordArray = (filterKeywordArray.length > 0 ? ['keyword=' + filterKeywordArray.join(' ')] : []);
      var tempFilterProductArray = filterProductArray.map(function(value) {
        return 'product[]=' + value;
      });
      var tempFilterCategoryArray = filterCategoryArray.map(function(value) {
        return 'category[]=' + value;
      });
      var tempfilterLanguageArray = filterLanguageArray.map(function(value) {
        return 'language[]=' + value;
      });
      
      locationSearch = '?' + tempFilterKeywordArray.concat(tempFilterProductArray, tempFilterCategoryArray, tempfilterLanguageArray).join('&');
    }
    window.history.replaceState(null, null, locationNoQuery + locationSearch);
  }// _getFilterValue()
  
  var _applyFilter = function() {
    // H2タイトル更新
    if($mediaLibraryResultWrapper.find('.c-headingLv2').text() !== mediaLibraryLabels.resultTitle) {
      $mediaLibraryResultWrapper.find('.c-headingLv2').fadeOut('fast', function() {
        $(this).text(mediaLibraryLabels.resultTitle).fadeIn();
      });
    }
    
    // おすすめ動画と検索結果の表示位置入れ替え
    var $detachedSection = $mediaLibraryRecommendedWrapper.detach();
    $mediaLibraryResultWrapper.after($detachedSection);
    
    _updateMediaLibraryResults(true);
    var mediaLibraryResultWrapperPositionTop = $mediaLibraryResultWrapper.offset().top - 50;
    $('html, body').animate({ scrollTop: mediaLibraryResultWrapperPositionTop }, 800, 'swing');
  }
  
  
  // 各種イベント初期化
  var initEvent = function() {
    
    // キーワード絞り込み
    $mediaLibrarySearchInput.on('change.search', _applyFilter);   
    $mediaLibrarySearchButton.on('click.search', _applyFilter);

    // 絞り込み条件ドロップダウン
    $mediaLibraryFilterDropDownTrigger.on('click.dropdown', function(e) {
      $mediaLibraryFilterDropDownTrigger.toggleClass('is-open');
      $mediaLibraryFilterDropDown.toggle();
    });    
    // 絞り込み実行
    $mediaLibraryFilterSubmit.on('click.search', _applyFilter);
    // 絞り込み条件リセット
    $mediaLibraryFilterReset.on('click.search', function() {
      $mediaLibrarySearchInput.val('');
      $mediaLibraryFilterProduct.find('option:first').prop('selected', true);
      $mediaLibraryFilterCategory.find('.c-checkbox__input').prop('checked', false);
      $mediaLibraryFilterLanguage.find('.c-checkbox__input').prop('checked', false);
      _updateMediaLibraryResults(true);
    });
    
    // 検索結果表示件数変更    
    $mediaLibraryResultControlsNumber.on('change.search', function() {
      resultPerPage = $mediaLibraryResultControlsNumber.val();
      _updateMediaLibraryResults(true);
    });
    
    // 検索結果表示形式変更
    $mediaLibraryResultControlsStyle.on('change.search', function() {
      mediaLibraryResultStyle = $mediaLibraryResultControlsStyle.val();
      if(mediaLibraryResultStyle === 'list') {
        $mediaLibraryResult.addClass('l-tile--listMode');
      } else {
        $mediaLibraryResult.removeClass('l-tile--listMode');        
      }
    });
    
    // 検索結果並び順変更    
    $mediaLibraryResultControlsSort.on('change.search', function() {
      mediaLibraryResultSort = $mediaLibraryResultControlsSort.val();
      _updateMediaLibraryResults(true);
    });
        
    //　ページャー操作
    $mediaLibraryResultPaginationPrev.on('click.pagination', function() {
      resultCurrentPage = (resultCurrentPage > 1) ? resultCurrentPage - 1 : 1;
      _updateMediaLibraryResults(false);
    });
    $mediaLibraryResultPaginationNext.on('click.pagination', function() {
      resultCurrentPage = (resultCurrentPage < resultMaxPage) ?  resultCurrentPage + 1 : resultMaxPage;
      _updateMediaLibraryResults(false);
    });
    
    // 動画モーダル表示
    $('body').on('click.modal', '[data-js-modal-movie-open]', function(e) {
      e.preventDefault();
      var targetMovieID = $(this).attr('data-js-movie-id');
      if(targetMovieID) {
        player.cueVideoById(targetMovieID);
        $modalMovieTitle.html(allMovieObject[targetMovieID].title.replace(/DQ/g, '"'));
        $modalMovieDescription.html(allMovieObject[targetMovieID].description.replace(/DQ/g, '"'));
        window.history.replaceState(null, null, locationNoQuery + '?movie=' + targetMovieID);
        $modalMovie.fadeIn(function() {
          $('html').attr('data-js-modal_fixed', '');
        });
      }
    });
    
    // 動画モーダル非表示
    $modalMovieClose.on('click.modal', function(e) {
      e.preventDefault();
      $modalMovieDescription.scrollTop(0);
      $modalMovie.fadeOut(function() {
        $('html').removeAttr('data-js-modal_fixed');
        player.stopVideo();
        $modalMovieTitle.html('');
        $modalMovieDescription.html('');
        window.history.replaceState(null, null, locationNoQuery);
      });
    });
    // 動画モーダルの背景クリックで非表示にさせるが、クリックの伝搬停止
    $('.c-modal').on('click.modal', function(e) {
      e.stopPropagation();
    });
  }// initEvent()
  
  // URLおよび設定からページの状態を復元
  var reloadStatus = function() {    
    if(queryParametersObject['keyword']) {
      $mediaLibrarySearchInput.val(queryParametersObject['keyword']);
    }
    if(queryParametersObject['product[]']) {
      queryParametersObject['product[]'].forEach(function(value, index) {
        $mediaLibraryFilterProduct.find('option:contains(' + value + ')').prop('selected', true);
      });
    }
    if(queryParametersObject['category[]']) {
      queryParametersObject['category[]'].forEach(function(value, index) {
        $mediaLibraryFilterCategory.find('.c-checkbox__text:contains(' + value + ')').siblings('.c-checkbox__input').prop('checked', true);
      });
    }
    if(queryParametersObject['language[]']) {
      queryParametersObject['language[]'].forEach(function(value, index) {
        $mediaLibraryFilterLanguage.find('.c-checkbox__text:contains(' + value + ')').siblings('.c-checkbox__input').prop('checked', true);
      });
    } else {
      $mediaLibraryFilterLanguage.find('.c-checkbox__text:contains("English")').siblings('.c-checkbox__input').prop('checked', true);      
    }
  }// reloadStatus()
  
  // 各種イベント初期化
  initEvent();
  
  /* 初期設定 */
  // 設定ファイルから全動画データオブジェクトを生成し、おすすめに動画を設定  
  $.when(
    $.getJSON('data/movie-data_master.json'),
    $.getJSON('data/products_am/movie-data_products_am1.json'),
    $.getJSON('data/products_branch/movie-data_products_branch1.json'),
    $.getJSON('data/products_branch/movie-data_products_branch2.json'),
    $.getJSON('data/products_cnc/movie-data_products_cnc1.json'),
    $.getJSON('data/products_division/movie-data_products_division1.json'),
    $.getJSON('data/products_division/movie-data_products_division2.json'),
    $.getJSON('data/products_division/movie-data_products_division3.json'),
    $.getJSON('data/products_ebm/movie-data_products_ebm1.json'),
    $.getJSON('data/products_edm/movie-data_products_edm1.json'),
    $.getJSON('data/products_ems/movie-data_products_ems1.json'),
    $.getJSON('data/products_fukuyama/movie-data_products_fukuyama.json'),
    $.getJSON('data/products_gear/movie-data_products_gear1.json'),
    $.getJSON('data/products_general/movie-data_products_general1.json'),
    $.getJSON('data/products_general/movie-data_products_general2.json'),
    $.getJSON('data/products_got/movie-data_products_got1.json'),
    $.getJSON('data/products_inv/movie-data_products_inv1.json'),
    $.getJSON('data/products_laser/movie-data_products_laser1.json'),
    $.getJSON('data/products_lvcb/movie-data_products_lvcb1.json'),
    $.getJSON('data/products_mecha/movie-data_products_mecha.json'),
    $.getJSON('data/products_msc/movie-data_products_msc1.json'),
    $.getJSON('data/products_nagoya/movie-data_products_nagoya1.json'),
    $.getJSON('data/products_nagoya/movie-data_products_nagoya2.json'),
    $.getJSON('data/products_plc/movie-data_products_plc1.json'),
    $.getJSON('data/products_plc/movie-data_products_plc2.json'),
    $.getJSON('data/products_pmd/movie-data_products_pmd1.json'),
    $.getJSON('data/products_pms/movie-data_products_pms1.json'),
    $.getJSON('data/products_robot/movie-data_products_robot1.json'),
    $.getJSON('data/products_servo/movie-data_products_servo1.json'),
    $.getJSON('data/products_software/movie-data_products_software1.json'),
    $.getJSON('data/products_software/movie-data_products_software2.json'),
    $.getJSON('data/products_software/movie-data_products_software3.json'),
    $.getJSON('data/products_ssc/movie-data_products_ssc1.json'),
    $.getJSON('data/products_solution/movie-data_products_solution1.json'),
    $.getJSON('data/products_ups/movie-data_products_ups1.json'),
    $.getJSON('data/products_tencon/movie-data_products_tencon1.json')
  )
  .done(
    function(
      master_data, 
      movie_data1,
      movie_data2,
      movie_data3,
      movie_data4,
      movie_data5,
      movie_data6,
      movie_data7,
      movie_data8,
      movie_data9,
      movie_data10,
      movie_data11,
      movie_data12,
      movie_data13,
      movie_data14,
      movie_data15,
      movie_data16,
      movie_data17,
      movie_data18,
      movie_data19,
      movie_data20,
      movie_data21,
      movie_data22,
      movie_data23,
      movie_data24,
      movie_data25,
      movie_data26,
      movie_data27,
      movie_data28,
      movie_data29,
      movie_data30,
      movie_data31,
      movie_data32,
      movie_data33,
      movie_data34,
      movie_data35
    ){
    // 全動画データオブジェクト生成
    var tempAllMovieObject = [
      ...movie_data1[0],
      ...movie_data2[0],
      ...movie_data3[0],
      ...movie_data4[0],
      ...movie_data5[0],
      ...movie_data6[0],
      ...movie_data7[0],
      ...movie_data8[0],
      ...movie_data9[0],
      ...movie_data10[0],
      ...movie_data11[0],
      ...movie_data12[0],
      ...movie_data13[0],
      ...movie_data14[0],
      ...movie_data15[0],
      ...movie_data16[0],
      ...movie_data17[0],
      ...movie_data18[0],
      ...movie_data19[0],
      ...movie_data20[0],
      ...movie_data21[0],
      ...movie_data22[0],
      ...movie_data23[0],
      ...movie_data24[0],
      ...movie_data25[0],
      ...movie_data26[0],
      ...movie_data27[0],
      ...movie_data28[0],
      ...movie_data29[0],
      ...movie_data30[0],
      ...movie_data31[0],
      ...movie_data32[0],
      ...movie_data33[0],
      ...movie_data34[0],
      ...movie_data35[0]
    ];
    
    tempAllMovieObject.forEach(function(value, index) {
      if(value.movieID !== '' && value.title !== '' && value.Global === mediaLibraryLabels.shown) {
        value.description = value.description.replace(/\\n/g, '<br>');
        value.products = mediaLibraryi18n[value.products];
        value.category1 = mediaLibraryi18n[value.category1];
        value.category2 = mediaLibraryi18n[value.category2];
        value.category3 = mediaLibraryi18n[value.category3];
        value.language = mediaLibraryi18n[value.language];
        if(allMovieObject[value.movieID]) {
          allMovieObject[value.movieID].products += ',' + value.products;
        } else {
          allMovieObject[value.movieID] = value;          
        }
      }      
    });
    
    // URL・設定内容復元
    reloadStatus();
    
    // 初期動画表示
    _updateMediaLibraryResults(true);
    
    if(queryParametersObject['keyword'] || queryParametersObject['product[]'] || queryParametersObject['category[]'] || queryParametersObject['language[]']) {
      $mediaLibraryFilterDropDownTrigger.trigger('click');
      $mediaLibraryFilterSubmit.trigger('click');        
    }
    
    // おすすめ動画生成
    recommendedMovieIDArray = master_data[0].map(function(data) {
      return data.movieID;
    });
    mediaLibraryRecommendedItems = recommendedMovieIDArray.map(_generateMovieCard);
    $mediaLibraryRecommended.html(mediaLibraryRecommendedItems);
        
    
    // URLに動画IDが指定されている場合は、初期表示でモーダルオープン
    if(queryParametersObject['movie']) {
      var targetMovieID = queryParametersObject['movie'];
      $modalMovieTitle.html(allMovieObject[targetMovieID].title.replace(/DQ/g, '"'));
      $modalMovieDescription.html(allMovieObject[targetMovieID].description.replace(/DQ/g, '"'));
      
      // 手動でモーダルオープン
      $modalMovie.fadeIn(function() {
        $('html').attr('data-js-modal_fixed','');
      });
    }    
  })
  .fail(function(){
    console.log('動画情報取得エラー');
  });

  //===================================== document ready
  $(function () {

  });
})(window.jQuery3_6 || jQuery);
