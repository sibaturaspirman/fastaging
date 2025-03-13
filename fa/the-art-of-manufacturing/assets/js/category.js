/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';
  
  // 記事ポップアップを開くグローバル関数定義
  window.MM_openBrWindow = function(targetURL, windowName, features) {
    let wopen;
    wopen = window.open(targetURL, windowName, features);
    wopen.focus();
  }
  
  const aomSearchPath = '/fa/the-art-of-manufacturing/search.html';
  const $aomFooter = $('[data-js-aom-footer]');
  const aomFooterPath = '/fa/the-art-of-manufacturing/assets/include/aom_footer.html'
    
  /* 変数 */
  const allArticleObject = {};
  const ourStoriesArticleObject = {};
    
  const $aomSearchInput = $('[data-js-aom-search-input]');
  const $aomSearchButton = $('[data-js-aom-search-button]');
  const $aomFilter = $('[ data-js-aom-filter]');
  const $aomFilterTagList = $('[ data-js-tag-list-category]');
  const $aomResult = $('[data-js-aom-result]');
  const $aomResultLatest = $('[data-js-aom-result-latest]');
  const $aomResultTechnologies = $('[data-js-aom-result-technologies]');
  const $aomResultFocus = $('[data-js-aom-result-focus]');
  const $aomResultColumn = $('[data-js-aom-result-column]');
  const $aomResultSummary = $('[data-js-aom-result-summary]');
  const $aomRanking = $('[data-js-aom-ranking]');
  const $aomRecommended =  $('[data-js-aom-recommended]');
  const $ourStoriesResult =  $('[data-js-our-stories-cards]');
  
  let tagListItems = '';
  let aomResultItems = '';
  let ourStoriesItems = '';
  
  const ourStoriesLabels = {
    all: 'All',
    resultSummary0: 'No articles were found that match your search criteria.<br>Please change the keywords or conditions and try again.',
    resultSummary1: 'articles were found.',
    resultUnit: '&ensp;'
  }
  
  let filterKeywordArray = [];
  let filterCategoryTagArray = [];
    
  const queryParametersObject = MEL_SETTINGS.helper.getCurrentQueries();
  const locationNoQuery = location.origin + location.pathname;
  let locationSearch = '';

  
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
      <a class="c-card__link" href="${allArticleObject[articleID]['url']}">
      <div class="c-card__head">
      <div class="c-card__img c-card__img--16x9">
      <img src="${allArticleObject[articleID]['image']}" alt="" decoding="async">
      </div><!-- /.c-card__img -->
      </div><!-- /.c-card__head -->
      <div class="c-card__body">
      <div class="c-card__row">
        <span class="c-card__date">${articlePublishedDate}</span>
      </div>
      <p class="c-card__title">${allArticleObject[articleID]['title']}</p>
      <p class="c-card__tag">
        ${allArticleObject[articleID]['tagCategory'] ? _generateTags(allArticleObject[articleID]['tagCategory']) : ''}
        ${allArticleObject[articleID]['tag1'] ? _generateTags(allArticleObject[articleID]['tag1']) : ''}
        ${allArticleObject[articleID]['tag2'] ? _generateTags(allArticleObject[articleID]['tag2']) : ''}
        ${allArticleObject[articleID]['tag3'] ? _generateTags(allArticleObject[articleID]['tag3']) : ''}
        ${allArticleObject[articleID]['tag4'] ? _generateTags(allArticleObject[articleID]['tag4']) : ''}
      </p>
      </div><!-- /.c-card__body -->
      </a><!-- /.c-card__link -->
      </div><!-- /.c-card -->
      </div><!-- /.l-tile__item -->`;
    }
    return cardElement;    
  }// _generateArticleCard()

  // 導入事例記事タイルパーツ生成
  const _generateOurStoriesArticleCard = function(articleID) {
    let cardElement = '';
    let articlePublishedDate;
    let articlePublishedDateObject;
    let nowDateObject;
    let diffDate;
    let newFlag = '';
    
    if(ourStoriesArticleObject[articleID]['publishedAt']) {
      articlePublishedDate = ourStoriesArticleObject[articleID]['publishedAt'];
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
      <a class="c-card__link" href="${ourStoriesArticleObject[articleID]['url']}">
      <div class="c-card__head">
      <div class="c-card__img c-card__img--16x9">
      <img src="${ourStoriesArticleObject[articleID]['image']}" alt="" decoding="async">
      </div><!-- /.c-card__img -->
      </div><!-- /.c-card__head -->
      <div class="c-card__body">
      <div class="c-card__row">
        <span class="c-card__date">${articlePublishedDate}</span>
      </div>
      <p class="c-card__title">${ourStoriesArticleObject[articleID]['title']}</p>
      <p class="c-card__tag">
        ${ourStoriesArticleObject[articleID]['tagCategory'] ? _generateTags(ourStoriesArticleObject[articleID]['tagCategory']) : ''}
        ${ourStoriesArticleObject[articleID]['tagTheme'] ? _generateTags(ourStoriesArticleObject[articleID]['tagTheme']) : ''}
        ${ourStoriesArticleObject[articleID]['tagIndustry'] ? _generateTags(ourStoriesArticleObject[articleID]['tagIndustry']) : ''}
        ${ourStoriesArticleObject[articleID]['tagTrend'] ? _generateTags(ourStoriesArticleObject[articleID]['tagTrend']) : ''}
      </p>
      </div><!-- /.c-card__body -->
      </a><!-- /.c-card__link -->
      </div><!-- /.c-card -->
      </div><!-- /.l-tile__item -->`;
    }
    return cardElement;    
  }// _generateOurStoriesArticleCard()
  
  
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
        tagElement += `<li><a href="${aomSearchPath}?keyword=${value}" class="c-filter__tag">#${value}</a></li>`;
      }); 
    }
    return tagElement;    
  }// _generateTagList()
  
    
  // 検索条件に合致する記事を取得し、検索結果のエリアを更新
  const _updateAomResults = function() {
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    
    _getFilterValue();
    
    // 各フィルターの配列が空でなければ実行
    filteredArticleObject = allArticleObject;
    
    if(filterKeywordArray.length > 0) {
      filterKeywordArray.forEach(function(value, index) {      
        filteredArticleObject = Object.keys(filteredArticleObject).reduce(
          (previousValue, key) => (_isTextContainsArrayWords(new Array(value), filteredArticleObject[key].title + ',' + filteredArticleObject[key].description + ',' + filteredArticleObject[key].tagCategory + ',' +  filteredArticleObject[key].tag1 + ',' +  filteredArticleObject[key].tag2 + ',' +  filteredArticleObject[key].tag3 + ',' +  filteredArticleObject[key].tag4) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
          {}
        );
      });
    }

    // フィルターヒット件数
    filteredArticleArray = Object.keys(filteredArticleObject);
    
    // 検索結果数
    const filteredArticleLength = filteredArticleArray.length;

    if(filteredArticleLength > 0) {
      $aomResultSummary.html('<em>' + filteredArticleLength + ourStoriesLabels.resultUnit + '</em>' + ourStoriesLabels.resultSummary1);
    } else {
      $aomResultSummary.html(ourStoriesLabels.resultSummary0);      
    }
    
    // 記事を日付降順に入れ替え
    filteredArticleArray.reverse();
    
    aomResultItems = filteredArticleArray.map(_generateArticleCard);
    $aomResult.html(aomResultItems);
  }// _updateAomResults()
  
  // 掲載箇所と記事カテゴリー・件数を指定して表示
  const _getAomArticles = function($target, category, articleMaxNumber) {
    
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    let shownArticleIDArray = [];
    filterCategoryTagArray = [];
    filterCategoryTagArray.push(category);
        
    // 各フィルターの配列が空でなければ実行
    filteredArticleObject = allArticleObject;
    if(category !== 'all') {
      filteredArticleObject = Object.keys(filteredArticleObject).reduce(
        (previousValue, key) => (_isTextContainsArrayWords(filterCategoryTagArray, filteredArticleObject[key].tagCategory) ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
        {}
      );      
    }
    filteredArticleArray = Object.keys(filteredArticleObject);

    // 記事を日付降順に入れ替え
    filteredArticleArray.reverse();
    
    // 1ページあたりのカード表示数と現在のページ数から、表示対象のオブジェクトを定義
    for(let articleCount = 0; articleCount < articleMaxNumber; articleCount++) {
      let tempArticleObjectKey = filteredArticleArray[articleCount];
      shownArticleIDArray.push(tempArticleObjectKey);
    }
    
    aomResultItems = shownArticleIDArray.map(_generateArticleCard);
    $target.html(aomResultItems);
  }// _getAomArticles()

  const _getOurStoriesArticles = function(articleMaxNumber) {
    
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    let shownArticleIDArray = [];

    // 記事をID降順に並び替え
    filteredArticleObject = ourStoriesArticleObject;
    filteredArticleArray = Object.keys(ourStoriesArticleObject).sort(function(a, b) {
      return (filteredArticleObject[a].articleID < filteredArticleObject[b].articleID) ? 1 : -1;  //ID降順
    });
        
    for(let articleCount = 0; articleCount < articleMaxNumber; articleCount++) {
      let tempArticleObjectKey = filteredArticleArray[articleCount];
      shownArticleIDArray.push(tempArticleObjectKey);
    }
    
    ourStoriesItems = shownArticleIDArray.map(_generateOurStoriesArticleCard);
    $ourStoriesResult.html(ourStoriesItems);

  }// __getOurStoriesArticles()
  
  // ランキング表示
  const _getAomRanking = function() {
    
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    let shownArticleIDArray = [];
        
    // 各フィルターの配列が空でなければ実行
    filteredArticleObject = allArticleObject;
    filteredArticleObject = Object.keys(filteredArticleObject).reduce(
      (previousValue, key) => (filteredArticleObject[key].ranking ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
      {}
    );      

    // 記事をランキング順に並び替え
    filteredArticleArray = Object.keys(filteredArticleObject).sort(function(a, b) {
      return (filteredArticleObject[a].ranking < filteredArticleObject[b].ranking) ? -1 : 1;  //ランキング昇順
    });
        
    // 1ページあたりのカード表示数と現在のページ数から、表示対象のオブジェクトを定義
    for(let articleCount = 0; articleCount < filteredArticleArray.length; articleCount++) {
      let tempArticleObjectKey = filteredArticleArray[articleCount];
      shownArticleIDArray.push(tempArticleObjectKey);
    }
    
    aomResultItems = shownArticleIDArray.map(_generateArticleCard);
    $aomRanking.html(aomResultItems);

    // GAでの計測のため、リンクにパラメータ付与
    $aomRanking.find('.c-card__link').each(function() {
      const $this = $(this);
      const thisHrefValue = $this.attr('href');
      if($this.attr('href').indexOf('?ref=rank') === -1) {
        $this.attr('href', thisHrefValue + '?ref=rank');
      }
    });
  }// _getAomRanking()
  
  // 編集部おすすめ表示
  const _getAomRecommended = function() {
    
    let filteredArticleObject = {};
    let filteredArticleArray = [];
    let shownArticleIDArray = [];
        
    // 各フィルターの配列が空でなければ実行
    filteredArticleObject = allArticleObject;
      filteredArticleObject = Object.keys(filteredArticleObject).reduce(
        (previousValue, key) => (filteredArticleObject[key].recommended ? { ...previousValue, [key]: filteredArticleObject[key] } : previousValue),
        {}
      );
      
    // 記事をおすすめ順に並び替え
    filteredArticleArray = Object.keys(filteredArticleObject).sort(function(a, b) {
      return (filteredArticleObject[a].recommended < filteredArticleObject[b].recommended) ? -1 : 1;  //おすすめ昇順
    });
    
    // 1ページあたりのカード表示数と現在のページ数から、表示対象のオブジェクトを定義
    for(let articleCount = 0; articleCount < filteredArticleArray.length; articleCount++) {
      let tempArticleObjectKey = filteredArticleArray[articleCount];
      shownArticleIDArray.push(tempArticleObjectKey);
    }
    
    aomResultItems = shownArticleIDArray.map(_generateArticleCard);
    $aomRecommended.html(aomResultItems);

    // GAでの計測のため、リンクにパラメータ付与
    $aomRecommended.find('.c-card__link').each(function() {
      const $this = $(this);
      const thisHrefValue = $this.attr('href');
      if($this.attr('href').indexOf('?ref=recommend') === -1) {
        $this.attr('href', thisHrefValue + '?ref=recommend');
      }
    });
  }// _getAomRecommended()
  
  // 絞り込み条件の取得とURLへの反映
  const _getFilterValue = function() {
    filterKeywordArray = [];
    locationSearch = '';

    // フィルター項目取得
    if($aomSearchInput.val() != '') {
      filterKeywordArray = $aomSearchInput.val().replace('　',' ').split(' ');  
      locationSearch = '?keyword=' + $aomSearchInput.val();
    }

    // URLにフィルタ条件反映
    window.history.replaceState(null, null, locationNoQuery + locationSearch);    
  }// _getFilterValue()
  
    
  // 各種イベント初期化
  const initEvent = function() {
    // キーワード絞り込み
    $aomSearchInput.on('change.search', function() {
      _updateAomResults();
    });   
    $aomSearchButton.on('click.search', function() {
      _updateAomResults();
    });
  }// initEvent()
  
  
  // URLおよび設定からページの状態を復元
  const _reloadStatus = function() {    
    if(queryParametersObject['keyword']) {
      $aomSearchInput.val(queryParametersObject['keyword']);
    }
  }// reloadStatus()
  
  /* 初期設定 */
  // 設定ファイルからタグ一覧と全記事データオブジェクトを生成
  $.when(
    $.getJSON('data/filter-data.json'),
    $.getJSON('data/article-data.json'),
    $.getJSON('/fa/our-stories/data/article-data.json')
  )
  .done(function(filter_data, article_data, ourStories_data){
    // タグリスト生成
    tagListItems = _generateTagList(filter_data[0][0].tagCategory);
    $aomFilterTagList.html(tagListItems);
      
    // 全記事データオブジェクト生成
    const tempAllArticleObject = [...article_data[0]];
    tempAllArticleObject.forEach(function(value, index) {
      if(value.articleID !== '') {
        allArticleObject[parseInt(value.articleID)] = value;
      }
    });
    // 導入事例記事データオブジェクト生成
    const tempOurStoriesArticleObject = [...ourStories_data[0]];
    tempOurStoriesArticleObject.forEach(function(value, index) {
      if(value.articleID !== '') {
        ourStoriesArticleObject[parseInt(value.articleID)] = value;
      }
    });
    
    if($aomResultLatest.length > 0) {
      // AOMトップ
      // 最新記事
      _getAomArticles($aomResultLatest, 'all', 3);
      // テクノロジー
      //_getAomArticles($aomResultTechnologies, 'Technologies', 3);
      // フォーカス
      //_getAomArticles($aomResultFocus, 'Focus', 3);
      // コラム
      //_getAomArticles($aomResultColumn, 'Column', 3);
      // 導入事例
      _getOurStoriesArticles(3);
      // アクセスランキング
      _getAomRanking();
      // 編集部おすすめ
      _getAomRecommended();      
    } else {
      // AOM検索結果ページ
      // URL・設定内容復元
      _reloadStatus();
          
      // 初期記事表示
      _updateAomResults();
    }
  })
  .fail(function(){
    console.log('記事情報取得エラー');
  });
  
  //===================================== document ready
  $(function() {
    // AOM 各種イベント初期化
    initEvent();
    
    
    // AOM記事詳細 関連テーマタグでの絞り込み
    var $filterTagArea = $('[data-js-filter-tags]');
    var $filterTags = $filterTagArea.find('a');
    
    if($filterTags.length > 0) {
      $filterTags.on('click.filter', function(e) {
        e.preventDefault();
        var $this = $(this);
        var filterLabel = $this.text().replace('#', '');
        window.location.href = aomSearchPath + '?keyword=' + filterLabel;
      });
    }
    
    // 共通フッター読み込み
    if($aomFooter.length > 0) {
      $.ajax(
        {url: aomFooterPath}
      )
      .done(function(data) {
        $aomFooter.before(data);
        $aomFooter.remove();
      })
      .fail(function() {
        console.log('共通フッターの読み込みエラー');
      });
    }  
  });
})(window.jQuery3_6 || jQuery);
