const links = {'#mlCase1Link':'#mlCase1', '#mlCase2Link':'#mlCase2'}
window.onload = $(function() {
	for(let key in links) {
		$(key).click(function() {
			$('html, body').animate({scrollTop: $(links[key]).offset().top}, 800, 'swing');
		});
	}
});
