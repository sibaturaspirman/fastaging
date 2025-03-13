$(function() {
	$('.scrollAnim').addClass('ready');
	$('.scrollPopup').addClass('ready');
	$('.ready').each(function() {
		if ($(window).scrollTop() > $('.ready').offset().top - $(window).height()) {
			$(this).addClass('moveIn');
		}
	});
	$(window).scroll(function() {
		const posHeight = $(this).height();
		const scrollAmount = $(this).scrollTop();
		$('.ready').each(function() {
			const posTarget = $(this).offset().top;
			if (scrollAmount > posTarget - posHeight + 60) {
				$(this).addClass('moveIn');
			} else {
				$(this).removeClass('moveIn');
			}
		});
	});
});