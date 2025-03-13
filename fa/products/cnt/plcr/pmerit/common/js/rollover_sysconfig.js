/* Rollover Script */

var rolimg = new Array();
for( i = 0 ; i < 7 ; i++ ){
	rolimg[i] = new Image();
}

// 元画像のイメージのパス
rolimg[0].src= "images/fig_sysconfig01.jpg"
rolimg[1].src= "images/fig_sysconfig01a.jpg"
rolimg[2].src= "images/fig_sysconfig01b.jpg"
rolimg[3].src= "images/fig_sysconfig01c.jpg"
rolimg[4].src= "images/fig_sysconfig01d.jpg"
rolimg[5].src= "images/fig_sysconfig01e.jpg"
rolimg[6].src= "images/fig_sysconfig01f.jpg"
function paintRol(dim,cnt){
	document.images[dim].src=rolimg[cnt].src;
}
