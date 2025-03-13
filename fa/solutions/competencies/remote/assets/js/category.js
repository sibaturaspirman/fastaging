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
})(window.jQuery3_6 || jQuery);
