/**
 * @fileOverview category.js
 */

(function($) {
  'use strict';

  // ページ個別設定ファイル
  const pageDirectoriesLocalJsonPath = window.MEL_SETTINGS.current_directory + '/data/directories.json';
  const $layerNav = $('[data-js-layer-nav]');
    
  const $ourStoriesFilterTagListTheme = $('[ data-js-tag-list-theme]');
  const $ourStoriesFilterTagListIndustry = $('[ data-js-tag-list-industry]');
  const $ourStoriesFilterTagListTrend = $('[ data-js-tag-list-trend]');
  let tagListItems = '';

  const ourStoriesArticleDataURL = '/fa/our-stories/data/article-data.json';
  const ourStoriesFilterDataURL = '/fa/our-stories/data/filter-data.json';
  const $ourStoriesCards = $('[data-js-our-stories-cards]');
  const ourStoriesCardsMaxNumber = 8;
  
  
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
  var _generateTagList = function(tags) {
    var tagElement = '';
    if(tags.length > 0) {
      tags.forEach(function(value, index) {
        tagElement += `<a href="/fa/our-stories/index.html?tag[]=${value}" class="c-filter__tag">#${value}</a>`;
      }); 
    }
    return tagElement;    
  }// _generateTagList()
  
  // 導入事例の絞り込み用のタグJSONを取得し、タグリストを生成
  $.when(
    $.getJSON({url: ourStoriesFilterDataURL}),
    $.getJSON({url: ourStoriesArticleDataURL})
  )
  .done(function(filter_data, article_data){
    // タグリスト生成
    tagListItems = _generateTagList(filter_data[0][0].tagTheme);
    $ourStoriesFilterTagListTheme.html(tagListItems);
    tagListItems = _generateTagList(filter_data[0][0].tagIndustry);
    $ourStoriesFilterTagListIndustry.html(tagListItems);
    tagListItems = _generateTagList(filter_data[0][0].tagTrend);
    $ourStoriesFilterTagListTrend.html(tagListItems);
    
    const $parsedHTML = $(article_data[0]);
    const $shownItems = $parsedHTML.slice(0, ourStoriesCardsMaxNumber);
    const _generateArticleCard = function(data) {
      const articlePublishedDate = data.publishedAt;
      const articlePublishedDateObject = articlePublishedDate !== '' ? new Date(articlePublishedDate) : '';
      const nowDateObject = new Date();
      const diffDate = Math.floor((nowDateObject.getTime() - articlePublishedDateObject.getTime()) / (1000 * 60 * 60 * 24));
      const newFlag = (diffDate < 120) ? 'new' : '';
      
      return `
        <div class="l-tile__item">
        <div class="c-card ${newFlag}">
        <a class="c-card__link" href="/fa/our-stories/${data.articleID}/index.html">
        <div class="c-card__head">
        <div class="c-card__img">
        <img src="${data.image}" alt="" decoding="async">
        </div><!-- /.c-card__img -->
        </div><!-- /.c-card__head -->
        <div class="c-card__body">
        <div class="c-card__row">
          <span class="c-card__date">${articlePublishedDate}</span>
        </div>
        <p class="c-card__title">${data.title}</p>
        <p class="c-card__text">${data.name}</p>
        <p class="c-card__tag">
        ${data.tagTheme ? _generateTags(data.tagTheme) : ''}
        ${data.tagIndustry ? _generateTags(data.tagIndustry) : ''}
        ${data.tagTrend ? _generateTags(data.tagTrend) : ''}
        </p>
        </div><!-- /.c-card__body -->
        </a><!-- /.c-card__link -->
        </div><!-- /.c-card -->
        </div><!-- /.l-tile__item -->`;
    }// _generateArticleCard()
    
    $shownItems.each(function() {
      $ourStoriesCards.append(_generateArticleCard(this));
    });
  })
  .fail(function() {
    console.log('導入事例データ取得エラー');
  });

  // 下層ページ
  // ローカルdirectories.jsonから各種アイテム生成
  $.getJSON({
    url: pageDirectoriesLocalJsonPath      
  })
  .done(function(DirectoriesJson) {
    // 階層ナビ生成
    if($layerNav.length > 0) {
      const directoryIDs = $layerNav.attr('data-js-layer-nav').split('_').map(function(value) {return parseInt(value) - 1});
      
      if(DirectoriesJson.layerNav.firstLayer) {
        const firstLayerHtmlTemplate = '<div class="c-layerNav__inner"><ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-1st>'
          + DirectoriesJson.layerNav.firstLayer.map(function(value, index) {
            return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[1] ? 'is-active': ''}" href="${value.path}">${value.name}</a></li>`
          }).join('')
          + '</ul></div>';
        $layerNav.append(firstLayerHtmlTemplate);
        
        if(DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer) {
          const secondLayerHtmlTemplate = '<ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-2nd>'
            + DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer.map(function(value, index) {
              return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[2] ? 'is-active': ''}" href="${value.path}">${value.name}</a></li>`
            }).join('')
            + '</ul>';
          $layerNav.find('.c-layerNav__inner').append(secondLayerHtmlTemplate);
          
          if(DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer[directoryIDs[2]].thirdLayer) {
            const thirdLayerHtmlTemplate = '<ul class="c-layerNav__list c-list c-list--float" data-js-layer-nav-3rd>'
              + DirectoriesJson.layerNav.firstLayer[directoryIDs[1]].secondLayer[directoryIDs[2]].thirdLayer.map(function(value, index) {
                return `<li class="c-list__item"><a class="u-icons u-icons--bulletRight ${index === directoryIDs[3] ? 'is-active': ''}" href="${value.path}">${value.name}</a></li>`
              }).join('')
              + '</ul>';
            $layerNav.find('.c-layerNav__inner').append(thirdLayerHtmlTemplate);
          }
        }
      }
    }
  })
  .fail(function() {
    console.log('ローカル階層設定ファイルの読み込みエラーです');
  })
  
  //===================================== document ready
  $(function() {

  });
})(window.jQuery3_6 || jQuery);
