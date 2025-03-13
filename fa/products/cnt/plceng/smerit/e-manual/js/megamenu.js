var MegaMenuFlag = false;
$(function() {
    // メガメニューのクリック
    $('#megamenu_open').on('click', function() {
        if (!MegaMenuFlag) {
            // メガメニューをスライド表示
            $('#MegaMenuContents').stop().slideDown();
            MegaMenuFlag = true;
        } else {
            // メガメニューをスライド非表示
            $('#MegaMenuContents').stop().slideUp();
            MegaMenuFlag = false;
        }
    });

    // メガメニューの閉じるボタンのクリック
    $('#megamenu_close').on('click', function() {
        // メガメニューをスライド非表示
        $('#MegaMenuContents').stop().slideUp();
        MegaMenuFlag = false;
    });
});