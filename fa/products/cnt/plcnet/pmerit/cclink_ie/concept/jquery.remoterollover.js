$(function(){

	$("#factory_point li").bind("mouseover",function(){
		var liIndex = $("#factory_point li").index($(this));
		var factoryImg = "ul#factory_img li:eq("+liIndex+")";

		$( factoryImg ).css("display","block");

	});

	$("#factory_point li").bind("mouseout",function(){
		var liIndex = $("#factory_point li").index($(this));
		var factoryImg = "ul#factory_img li:eq("+liIndex+")";

		$( factoryImg ).css("display","none");

	});

});$