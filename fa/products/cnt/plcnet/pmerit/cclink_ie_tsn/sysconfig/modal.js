$(window).load(function(){
/* Modal */
    $(".modal_inline").fancybox({
        width: 740,
        type: 'inline',
        overlayOpacity: 0.8,
        overlayColor: '#000',
        titleShow: false,
        speedIn: 750,
        speedOut: 300,
        onComplete:function(){
            $.fancybox.center();
        }
    });
});