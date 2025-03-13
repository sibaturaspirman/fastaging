function generateHtmlFromJson(jsonData, number) {
  // 指定された番号で該当する情報を取得
	const item = jsonData.find(obj => obj.number.toString() === number.toString());

  // HTMLコードの生成
  if (item) {
    const htmlCode = `
      <div class="l-grid__item l-grid__item-3 l-grid__item-4-md l-grid__item-12-sm">
        <a class="c-linkWithImage" href="${item.url}" target="${item.target}">
          <div class="c-linkWithImage__image">
            <img src="/fa/solutions/efactory/iot-solutions/assets/img/project/img_product_${item.number}.jpg" alt="" decoding="async">
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
const jsonUrl = '/fa/solutions/efactory/iot-solutions/assets/data/project.json';

// HTML要素のクラス名
const elementClass = 'sols_project';

// JSONデータの取得とHTMLコード生成の処理
$.getJSON(jsonUrl, function(jsonData) {
  $(`.${elementClass}`).each(function() {
    const targetNumber = $(this).data('number');
    const generatedHtml = generateHtmlFromJson(jsonData, targetNumber);
    if (generatedHtml) {
      $(this).replaceWith(generatedHtml);
    } else {
      console.log(`No item found with number ${targetNumber}.`);
    }
  });
});
