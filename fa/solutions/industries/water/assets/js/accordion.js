$(function() {
    var $trigger = $('.c-accordion__title'),
        $content = $('.c-accordion__content');

    $trigger.on('click', function() {
        if ($trigger.hasClass('is-open')) {
            closeAccordion();
        } else {
            openAccordion();
        }
    });

    $('.accordion_trigger a').on('click', function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        if (!$trigger.hasClass('is-open')) {
            openAccordion();
        }
        $('body,html').animate({ scrollTop: $(href).offset().top }, 400);
    });
    function closeAccordion() {
        $trigger.removeClass('is-open');
        $content.removeClass('is_down');
        $trigger.html('Open');
    }
    function openAccordion() {
        $trigger.addClass('is-open');
        $content.addClass('is_down');
        $trigger.html('Close');
    }
});