const links = {'#mlCase1Link':'#mlCase1', '#mlCase2Link':'#mlCase2', '#mlCase3Link':'#mlCase3', '#mlCase4Link':'#mlCase4', '#mlCase5Link':'#mlCase5', '#mlSimulatorLink':'#mlSimulator'}
window.onload = $(function() {
	for(let key in links) {
		$(key).click(function() {
			$('html, body').animate({scrollTop: $(links[key]).offset().top}, 800, 'swing');
		});
	}
});