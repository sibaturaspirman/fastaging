/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';
  
  const $spotLightList = $('[data-js-spotlight-list]');
  const $filterCategory = $('[data-js-filter-category]');
  const $allSpotlightObject = $('.c-spotlight__item');
  let $filteredSpotlightObject = {};
  let filterCategoryValue = '';
  
  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  const locationNoQuery = location.origin + location.pathname;
  let locationSearch = '';
  
  /* 関数 */  
  const _getFilterValue = function() {
    // フィルターの値を取得
    filterCategoryValue = $filterCategory.val();
  }// _getFilterValue()
  
  const _updateURL = function() {
    // フィルターの値でURLを更新
    const tempFilterArray = [];
    locationSearch = '';
    
    if(filterCategoryValue !== null && filterCategoryValue !== 'all') {
      tempFilterArray.push(`category=${filterCategoryValue}`);
    }
    if(tempFilterArray.length > 0) {
      locationSearch = '?' + tempFilterArray.join('&');
    }
    window.history.replaceState(null, null, locationNoQuery + locationSearch);
  }// _updateURL()
  
  const _filterObject = function() {
    _getFilterValue();
    _updateURL();
    
    //　フィルター処理
    $filteredSpotlightObject = $allSpotlightObject;
    if(filterCategoryValue !== 'all') {
      $filteredSpotlightObject = $filteredSpotlightObject.filter(function(index, value) {
        return $(value).find('.c-spotlight__category > span').text() === filterCategoryValue;
      });      
    }
    
    // 全件を非表示にしたから、フィルターで絞り込まれた内容を順に表示
    $spotLightList.find('.c-spotlight__item').fadeOut('fast');
    $filteredSpotlightObject.each(function(index, value) {
      setTimeout(function() {
        $(value).fadeIn();
      }, 80 * index + 400);
    });
  }// _filterObject()
  
  const reloadStatus = function() {
    // URLから状態を復元
    if(queryParametersObject['category']) {
      $filterCategory.val(queryParametersObject['category']);
    }
    
    // URLにパラメータが指定されていれば、フィルター実行
    if(queryParametersObject['category']) {
      $spotLightList.find('.c-spotlight__item').hide(0);
      _filterObject();
    }
  }// reloadStatus()
  
  const init = function() {
    // フィルターのイベント登録
    $filterCategory.on('change.filter', _filterObject);
  }// init()

  //===================================== document ready
  $(function () {
    reloadStatus();
    init();
  });
})(window.jQuery3_6 || jQuery);
