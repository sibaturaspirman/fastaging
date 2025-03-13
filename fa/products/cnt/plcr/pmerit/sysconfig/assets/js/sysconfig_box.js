$(function(){

	$("#sysconfig_point li").bind("mouseover",function(){
		var liIndex = $("#sysconfig_point li").index($(this));
		var figSysconfig = "ul#fig_sysconfig li:eq("+liIndex+")";

		$( figSysconfig ).css("display","block");

	});

	$("#sysconfig_point li").bind("mouseout",function(){
		var liIndex = $("#sysconfig_point li").index($(this));
		var figSysconfig = "ul#fig_sysconfig li:eq("+liIndex+")";

		$( figSysconfig ).css("display","none");

	});

});$