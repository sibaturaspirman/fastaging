/**
 * @fileOverview update-information.js
 */

(function($) {
  'use strict';
  
  const $newsLists = $('[data-js-news-list]');
  const $filterCategory = $('[data-js-filter-category]');
  let filterCategoryValue = '';
  
  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  const locationNoQuery = location.origin + location.pathname;
  let locationSearch = '';
  
  const mediaLibraryi18n = {
    noResult: 'There are no announcements at this time.'    
  }
  
  /* 関数 */  
  const _getFilterValue = function() {
    if($filterCategory.length > 0) {
      // フィルターの値を取得
      filterCategoryValue = $filterCategory.val();
    }
  }// _getFilterValue()
  
  const _updateURL = function() {
    // フィルターの値でURLを更新
    const tempFilterArray = [];
    locationSearch = '';
    
    if(filterCategoryValue !== null && filterCategoryValue !== '' && filterCategoryValue !== 'all') {
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
    $newsLists.each(function(index, newsList) {
      
      const $allNewsObject = $(newsList).find('.c-news__item');
      let $filteredNewsObject = $allNewsObject;
      
      if(filterCategoryValue !== 'all' && filterCategoryValue !== '') {
        $filteredNewsObject = $filteredNewsObject.filter(function(index, newsItem) {
          return $(newsItem).find('.c-news__category > span').text() === filterCategoryValue;
        });      
      }
      
      // 全件を非表示にしたから、フィルターで絞り込まれた内容を順に表示
      $allNewsObject.fadeOut('fast');
      $(newsList).find('.c-news__item--noResult').remove();

      if($filteredNewsObject.length > 0) {
        $filteredNewsObject.each(function(index, value) {
          setTimeout(function() {
            $(value).fadeIn();
          }, 80 * index + 400);
        });        
      } else {
        $(newsList).append(`<li class="c-news__item--noResult"><p class="c-text l-separator-x1_5-imp">${mediaLibraryi18n.noResult}</p></li>`)        
      }
    });
  }// _filterObject()
  
  const reloadStatus = function() {
    if($filterCategory.length > 0) {
      // URLから状態を復元
      if(queryParametersObject['category']) {
        $filterCategory.val(queryParametersObject['category']);
      }
    }
    
    _filterObject();
  }// reloadStatus()
  
  const init = function() {
    if($filterCategory.length > 0) {
      // フィルターのイベント登録
      $filterCategory.on('change.filter', _filterObject);      
    }
  }// init()

  //===================================== document ready
  $(function () {
    reloadStatus();
    init();
  });
})(window.jQuery3_6 || jQuery);
