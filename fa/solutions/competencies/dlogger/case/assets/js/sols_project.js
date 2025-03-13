function generateHtmlFromJson(jsonData, number) {
  // 指定された番号で該当する情報を取得
	const item = jsonData.find(obj => obj.number.toString() === number.toString());

  // HTMLコードの生成
  if (item) {
    const htmlCode = `
      <div class="l-grid__item l-grid__item-3 l-grid__item-4-md l-grid__item-12-sm">
        <a class="c-linkWithImage" href="${item.url}" target="${item.target}">
          <div class="c-linkWithImage__image">
            <img src="/fa/solutions/competencies/dlogger/case/assets/img/img_product_${item.number}.jpg" alt="" decoding="async">
          </div>
          <span class="c-linkWithImage__link u-icons u-icons--bulletRight">${item.name}</span>
        </a><!-- /.c-linkWithImage -->
      </div><!-- /.l-grid__item -->
    `;
    return htmlCode;
  } else {
    return null;
  }
}


// JSONファイルのURL
const jsonUrl = '/fa/solutions/competencies/dlogger/case/assets/data/project.json';

// HTML要素のクラス名
const elementClass = 'sols_project';

// JSONデータの取得とHTMLコード生成の処理
$.getJSON(jsonUrl, function(jsonData) {
  $(`.${elementClass}`).each(function() {
    const targetNumber = $(this).data('number');
    const generatedHtml = generateHtmlFromJson(jsonData, targetNumber);
    if (generatedHtml) {
      $(this).replaceWith(generatedHtml);
		}
  });
});


$(function() {
	$(window).on('load resize', function() {
		eq_height();
	});

	// 高さ揃え
	function eq_height() {
		if ($('[data-height]').length) {
			var top = 0;
			var count = -1;
			var elems = {};
			$('[data-height]').css('min-height', '');
			$('[data-height]').each(function() {
				var offset_top = Math.floor($(this).offset().top);
				if (top < offset_top) {
					top = offset_top;
					count++;
				}
				$(this).attr('data-height', count);
				count = $(this).attr('data-height');
				if (!elems[count] || elems[count] < $(this).height()) {
					elems[count] = $(this).height();
				}
			});
			$.each(elems, function(index, value) {
				$('[data-height="' + index + '"]').css('min-height', value + 'px');
			});
		}
	}
});
