/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';
  
  const ourStoriesPath = '/fa/our-stories/';
  
  // 記事ポップアップを開くグローバル関数定義
  window.MM_openBrWindow = function(targetURL, windowName, features) {
    let wopen;
    wopen = window.open(targetURL, windowName, features);
    wopen.focus();
  }
  
  /* 変数 */
  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  const locationNoQuery = location.origin + location.pathname;
  let locationSearch = '';

  const allArticleObject = {};
  
  const resultPerPage = 160;
  let resultCurrentPage = 1;
  let resultMaxPage = 1;
  
  const $ourStoriesSearchInput = $('[data-js-our-stories-search-input]');
  const $ourStoriesSearchButton = $('[data-js-our-stories-search-button]');
  const $ourStoriesFilter = $('[ data-js-our-stories-filter]');
  const $ourStoriesFilterTagListTheme = $('[ data-js-tag-list-theme]');
  const $ourStoriesFilterTagListIndustry = $('[ data-js-tag-list-industry]');
  const $ourStoriesFilterTagListTrend = $('[ data-js-tag-list-trend]');
  const $ourStoriesResult = $('[data-js-our-stories-result]');
  const $ourStoriesResultSummary = $('[data-js-our-stories-result-summary]');
  
  let tagListItems = '';
  let ourStoriesResultItems = '';
  
  const ourStoriesLabels = {
    all: 'All',
    resultSummary0: 'No articles were found that match your search criteria.<br>Please change the keywords or conditions and try again.',
    resultSummary1: 'articles were found.',
    resultUnit: '&ensp;'
  }
  
  let filterKeywordArray = [];
  let filterTagArray = [];
  let filterThemeTagArray = [];
  let filterIndustryTagArray = [];
  let filterTrendTagArray = [];
  let filterSMKLKPITagArray = [];
  let filterSMKLProductivityTagArray = [];
  let filterSMKLQualityTagArray = [];
  let filterSMKLCapabilityTagArray = [];
  let filterSMKLEnvironmentTagArray = [];
  let filterSMKLInventoryControlTagArray = [];
  let filterSMKLMaintenanceTagArray = [];
    
  // SMKL絞り込みの値をURLから取得
  if(queryParametersObject['tagSMKLKPI[]']) {
    queryParametersObject['tagSMKLKPI[]'].forEach(function(value, index) {
      filterSMKLKPITagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLProductivity[]']) {
    queryParametersObject['tagSMKLProductivity[]'].forEach(function(value, index) {
      filterSMKLProductivityTagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLQuality[]']) {
    queryParametersObject['tagSMKLQuality[]'].forEach(function(value, index) {
      filterSMKLQualityTagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLCapability[]']) {
    queryParametersObject['tagSMKLCapability[]'].forEach(function(value, index) {
      filterSMKLCapabilityTagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLEnvironment[]']) {
    queryParametersObject['tagSMKLEnvironment[]'].forEach(function(value, index) {
      filterSMKLEnvironmentTagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLInventoryControl[]']) {
    queryParametersObject['tagSMKLInventoryControl[]'].forEach(function(value, index) {
      filterSMKLInventoryControlTagArray.push(value);
    });
  }
  if(queryParametersObject['tagSMKLMaintenance[]']) {
    queryParametersObject['tagSMKLMaintenance[]'].forEach(function(value, index) {
      filterSMKLMaintenanceTagArray.push(value);
    });
  }
  
  
  /* 関数 */
  // 文字列内に配列のワードが含まれるかチェック
  const _isTextContainsArrayWords = function(arr, str) {
    return arr.filter(keyword => {
      var reg = new RegExp(keyword.replace('(', '\\(').replace(')', '\\)'), 'i');
      return str.match(reg);
    }).length > 0
  }// _isTextContainsArrayWords()
  
  
  // 記事タイルパーツ生成
  const _generateArticleCard = function(articleID) {
    let cardElement = '';
    let articlePublishedDate;
    let articlePublishedDateObject;
    let nowDateObject;
    let diffDate;
    let newFlag = '';
    
    if(allArticleObject[articleID]['publishedAt']) {
      articlePublishedDate = allArticleObject[articleID]['publishedAt'];
      articlePublishedDateObject = new Date(articlePublishedDate);
      nowDateObject = new Date();
      diffDate = Math.floor((nowDateObject.getTime() - articlePublishedDateObject.getTime()) / (1000 * 60 * 60 * 24));
      newFlag = (diffDate < 30) ? 'new' : '';
    } else {
      articlePublishedDate = '';
    }
    
    if(articleID) {
      cardElement = `<div class="l-tile__item">
      <div class="c-card ${newFlag}">
      <a class="c-card__link" href="/fa/our-stories/${articleID}/index.html">
      <div class="c-card__head">
      <div class="c-card__img">
      <img src="${allArticleObject[articleID]['image']}" alt="" decoding="async">
      </div><!-- /.c-card__img -->
      </div><!-- /.c-card__head -->
      <div class="c-card__body">
      <div class="c-card__row">
        <span class="c-card__date">${articlePublishedDate}</span>
      </div>
      <p class="c-card__title">${allArticleObject[articleID]['title']}</p>
      <p class="c-card__text">${allArticleObject[articleID]['name']}</p>
      <p class="c-card__tag">
        ${allArticleObject[articleID]['tagTheme'] ? _generateTags(allArticleObject[articleID]['tagTheme']) : ''}
        ${allArticleObject[articleID]['tagIndustry'] ? _generateTags(allArticleObject[articleID]['tagIndustry']) : ''}
        ${allArticleObject[articleID]['tagTrend'] ? _generateTags(allArticleObject[articleID]['tagTrend']) : ''}
      </p>
      </div><!-- /.c-card__body -->
      </a><!-- /.c-card__link -->
      </div><!-- /.c-card -->
      </div><!-- /.l-tile__item -->`;
    }
    return cardElement;    
  }// _generateArticleCard()
  
  
  // カンマ区切りのデータからタグ生成
  const _generateTags = function(tags) {
    let tagElement = '';
    if(tags.length > 0) {
      tags.split(',').forEach(function(value, index) {
        tagElement += `<span>${value}</span>`;
      }); 
    }
    return tagElement;    
  }// _generateTagList()
  
  
  // フィルター用タグ生成
  const _generateTagList = function(tags) {
    let tagElement = '';
    if(tags.length > 0) {
      tags.forEach(function(value, index) {
        tagElement += `<span class="c-filter__tag">#${value}</span>`;
      }); 
    }
    return tagElement;    
  }// _generateTagList()
  
    
  // 検索条件に合致する記事を取得し、検索結果のエリアを更新
  const _updateourStoriesResults = function(isResetCurrentPage = false) {
    
    // ページャー操作以外では、現在のページを最初に戻す
    if(isResetCurrentPage) {
      resultCurrentPage = 1;      
    }
    
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    let shownarticleIDArray = [];
    
    _getFilterValue();
    
    // 各フィルターの配列が空でなければ実行
    filteredArticleObject = allArticleObject;
    if(filterKeywordArray.length > 0) {
      filterKeywordArray.forEach(function(value, index) {      
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => (_isTextContainsArrayWords(new Array(value), filteredArticleObject[key].title + ',' +  filteredArticleObject[key].name + ',' + filteredArticleObject[key].description + ',' + filteredArticleObject[key].tagTheme + ',' + filteredArticleObject[key].tagIndustry + ',' + filteredArticleObject[key].tagTrend) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterThemeTagArray.length > 0) {
      filteredArticleObject = Object.keys(filteredArticleObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterThemeTagArray, filteredArticleObject[key].tagTheme) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
        {}
      );
    }
    if(filterIndustryTagArray.length > 0) {
      filteredArticleObject = Object.keys(filteredArticleObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterIndustryTagArray, filteredArticleObject[key].tagIndustry) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
        {}
      );
    }
    if(filterTrendTagArray.length > 0) {
      filteredArticleObject = Object.keys(filteredArticleObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterTrendTagArray, filteredArticleObject[key].tagTrend) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
        {}
      );
    }
    
    // SMKLフィルター
    if(filterSMKLKPITagArray.length > 0) {
      filterSMKLKPITagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLKPI.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLProductivityTagArray.length > 0) {
      filterSMKLProductivityTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLProductivity.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLQualityTagArray.length > 0) {
      filterSMKLQualityTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLQuality.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLCapabilityTagArray.length > 0) {
      filterSMKLCapabilityTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLCapability.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLEnvironmentTagArray.length > 0) {
      filterSMKLEnvironmentTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLEnvironment.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLInventoryControlTagArray.length > 0) {
      filterSMKLInventoryControlTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLInventoryControl.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }
    if(filterSMKLMaintenanceTagArray.length > 0) {
      filterSMKLMaintenanceTagArray.forEach(function(value, index) {
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => ((filteredArticleObject[key].tagSMKLMaintenance.indexOf(value) !== -1) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }


    // フィルターヒット件数
    resultMaxPage = Math.ceil(Object.keys(filteredArticleObject).length / resultPerPage);
    filteredArticleArray = Object.keys(filteredArticleObject);
    
    // 検索結果数
    const filteredArticleLength = filteredArticleArray.length;

    if(filteredArticleLength > 0) {
      $ourStoriesResultSummary.html('<em>' + filteredArticleLength + ourStoriesLabels.resultUnit + '</em>' + ourStoriesLabels.resultSummary1);
    } else {
      $ourStoriesResultSummary.html(ourStoriesLabels.resultSummary0);      
    }
    $ourStoriesResultSummary.html();
    
    // 1ページあたりのカード表示数と現在のページ数から、表示対象のオブジェクトを定義
    for(let articleCount = resultPerPage * (resultCurrentPage - 1); articleCount < resultPerPage * resultCurrentPage; articleCount++) {
      if(articleCount < filteredArticleArray.length) {
        let tempArticleObjectKey = filteredArticleArray[articleCount];
        shownarticleIDArray.push(tempArticleObjectKey);
      }
    }
    
    ourStoriesResultItems = shownarticleIDArray.map(_generateArticleCard);
    $ourStoriesResult.html(ourStoriesResultItems);
  }// _updateourStoriesResults()
  
  
  // 絞り込み条件の取得とURLへの反映
  const _getFilterValue = function() {
    filterKeywordArray = [];
    filterTagArray = [];
    filterThemeTagArray = [];
    filterIndustryTagArray = [];
    filterTrendTagArray = [];
    locationSearch = '';

    // フィルター項目取得
    if($ourStoriesSearchInput.val() != '') {
      filterKeywordArray = $ourStoriesSearchInput.val().replace('　',' ').split(' ');      
    }
    $ourStoriesFilter.find('[data-js-tag-list-theme] .c-filter__tag.is-active').each(function() {
      const $this = $(this);
      if($this.text() !== ourStoriesLabels.all) {
        filterThemeTagArray.push($this.text().replace('#', ''));      
      } 
    });
    $ourStoriesFilter.find('[data-js-tag-list-industry] .c-filter__tag.is-active').each(function() {
      const $this = $(this);
      if($this.text() !== ourStoriesLabels.all) {
        filterIndustryTagArray.push($this.text().replace('#', ''));      
      } 
    });
    $ourStoriesFilter.find('[data-js-tag-list-trend] .c-filter__tag.is-active').each(function() {
      const $this = $(this);
      if($this.text() !== ourStoriesLabels.all) {
        filterTrendTagArray.push($this.text().replace('#', ''));      
      } 
    });
    
    // タグのグループの配列を結合
    filterTagArray = [...filterThemeTagArray, ...filterIndustryTagArray, ...filterTrendTagArray];

    // URLにフィルタ条件反映
    if(filterKeywordArray.concat(filterTagArray).length > 0) {      
      const tempFilterKeywordArray = (filterKeywordArray.length > 0 ? ['keyword=' + filterKeywordArray.join(' ')] : []);
      const tempFilterTagArray = filterTagArray.map(function(value) {
        return 'tag[]=' + value;
      });
      
      locationSearch = '?' + tempFilterKeywordArray.concat(tempFilterTagArray).join('&');
    }
    window.history.replaceState(null, null, locationNoQuery + locationSearch);
    
  }// _getFilterValue()
  
    
  // 各種イベント初期化
  const initEvent = function() {
    // キーワード絞り込み
    $ourStoriesSearchInput.on('change.search', function() {
      _updateourStoriesResults(true);
    });   
    $ourStoriesSearchButton.on('click.search', function() {
      _updateourStoriesResults(true);
    });
  }// initEvent()
  
  
  // URLおよび設定からページの状態を復元
  const _reloadStatus = function() {    
    if(queryParametersObject['keyword']) {
      $ourStoriesSearchInput.val(queryParametersObject['keyword']);
    }
    if(queryParametersObject['tag[]']) {
      queryParametersObject['tag[]'].forEach(function(value, index) {
        $ourStoriesFilter.find('.c-filter__tag:contains(' + value + ')').addClass('is-active');
      });
    }
  }// reloadStatus()
  
  /* 初期設定 */
  // 設定ファイルからタグ一覧と全記事データオブジェクトを生成
  $.when(
    $.getJSON('data/filter-data.json'),
    $.getJSON('data/article-data.json')
  )
  .done(function(filter_data, article_data){
    // タグリスト生成
    tagListItems = _generateTagList(filter_data[0][0].tagTheme);
    $ourStoriesFilterTagListTheme.html(tagListItems);
    tagListItems = _generateTagList(filter_data[0][0].tagIndustry);
    $ourStoriesFilterTagListIndustry.html(tagListItems);
    tagListItems = _generateTagList(filter_data[0][0].tagTrend);
    $ourStoriesFilterTagListTrend.html(tagListItems);
    
    // タグにイベント登録
    $('.c-filter__tag').on('click.filter', function() {
      const $this = $(this);
      $this.toggleClass('is-active');
      
      _updateourStoriesResults(true);
    });
    
    // 全記事データオブジェクト生成
    const tempAllArticleObject = [...article_data[0]];    
    tempAllArticleObject.forEach(function(value, index) {
      if(value.articleID !== '') {
        allArticleObject[value.articleID] = value;
      }
    });
        
    // URL・設定内容復元
    _reloadStatus();
        
    // 初期記事表示
    _updateourStoriesResults(true);
  })
  .fail(function(){
    console.log('記事情報取得エラー');
  });
  
  //===================================== document ready
  $(function() {
    // 導入事例トップ 各種イベント初期化
    initEvent();
    

    // 導入事例記事詳細 関連テーマタグでの絞り込み
    const $filterTagArea = $('[data-js-filter-tags]');
    const $filterTags = $filterTagArea.find('a');
    
    if($filterTags.length > 0) {
      $filterTags.on('click.filter', function(e) {
        e.preventDefault();
        const $this = $(this);
        const filterLabel = $this.text().replace('#', '');
        window.location.href = ourStoriesPath + '?tag[]=' + filterLabel;
      });
    }    
  });
})(window.jQuery3_6 || jQuery);
