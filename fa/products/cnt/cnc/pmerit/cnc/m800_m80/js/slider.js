$(document).ready(function(){

	$('h4.slider').mouseenter(function(){
		$(this).css("cursor","pointer");
    }).mouseleave(function(){
      	$(this).css("cursor","default");
    });

	
	$('h4.slider').click(function() {
	  
	  ar_r = 'images/dtl_title_dwn.gif';
	  ar_d = 'images/dtl_title.gif';
	  ar_r1 = 'images/sp_title_03_dwn.gif';
	  ar_d1 = 'images/sp_title_03.gif';
	  
	  src = $(this).children().attr('src');
	  
	  if (src == ar_r) {
	  	$(this).children().attr('src',ar_d); 
	  }
	  if (src == ar_r1) {
	  	$(this).children().attr('src',ar_d1); 
	  }
 
	  $(this).next().slideToggle();
	  
	  if (src == ar_d) {
	  	$(this).children().attr('src',ar_r); 
	  }
	   if (src == ar_d1) {
	  	$(this).children().attr('src',ar_r1); 
	  }

	});
});