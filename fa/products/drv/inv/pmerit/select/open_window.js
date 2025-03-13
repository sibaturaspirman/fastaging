// 省エネ計算システムを開く

function MM_openBrWindow() {
	var w = screen.width;
	var h = screen.height;
	var bufferSize = 80;
	var scrollSize = 18;
	var windowW = 1100;
	var windowH = 800;
	var scroll = "yes";
	var changeFlagW = false;
	var changeFlagH = false;

	if (w < windowW ) {
		windowW = windowW - (w - windowW);
		scroll = "yes";
		changeFlagW = true;
	}
	if (h - bufferSize <= windowH ) {
		windowH = windowH - (h - windowH);
		scroll = "yes";
		changeFlagH = true;
	}

	if ( changeFlagW == true && changeFlagH == false ) {
		windowH += scrollSize;
	} else if ( changeFlagW == false && changeFlagH == true ) {
		windowW += scrollSize;
	}

	var IE_DEBUG_OPTION = (false ? "menubar=1,toolbar=1," : "");
	window.open("/fa/products/drv/inv/pmerit/select/app/fan.html","popupr", IE_DEBUG_OPTION + "width=" + windowW + ",height=" + windowH + ",scrollbars=" + scroll);
}