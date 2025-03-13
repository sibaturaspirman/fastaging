$(function () {
    $('.js-accordion .closed').next().hide();
    $('.js-accordion .js-accordion_trigger').on('click', function () {
        if ($(this).hasClass('closed')) {
            $(this).removeClass('closed');
        } else {
            $(this).addClass('closed');
        }
        $(this).next().slideToggle();
    });
});
