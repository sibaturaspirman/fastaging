/* Rollover Script */

if(navigator.appVersion.charAt(0) >=3){
var rolimg = new Array();
for( i = 0 ; i < 11 ; i++ ){
rolimg[i] = new Image();
}

// 元画像のイメージのパス
rolimg[0].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle00.jpg"
rolimg[1].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle01.jpg"
rolimg[2].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle02.jpg"
rolimg[3].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle03.jpg"
rolimg[4].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle04.jpg"
rolimg[5].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle05.jpg"
rolimg[6].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle06.jpg"
rolimg[7].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle07.jpg"
rolimg[8].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle08.jpg"
rolimg[9].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle09.jpg"
rolimg[10].src= "/fa/products/cnt/plcr/pmerit/concept/images/concept_cercle10.jpg"}

function paintRol(dim,cnt){
if(navigator.appVersion.charAt(0) >= 3 ){
document.images[dim].src=rolimg[cnt].src;
}
}

//イメージマップの境界線を消す
var ua = navigator.userAgent;
var chkFF = ua.indexOf("Firefox",0);
if(chkFF>0){
	if($("#Map area").length){
		$("#Map area").attr("onFocus","");
	}
}