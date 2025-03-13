// JavaScript Document

var flag_class = 0;
var flag_year = 0;
var flag_month = 0;
var flag_country = 0;
var flag_signature = 0;

var arr_class = ['000','001','002','003','004','005','006','007','008','009','00a','00b','00c','00d','00e','00f','00g','00h','00i','00j','00k','00l','00m','00n','00o','00p','00q','00s'];
var arr_country = {
	'JP':'Japan',
	'IN':'India',
	'CN':'China'
};

$(window).load(function(){
	var param_a = $.cookie( 'param_a' );

	var langlink = 'https://www.mitsubishielectric.co.jp/fa/products/drv/inv/redirect.html?k=inv&a=';
	if( param_a != null ){
		langlink += param_a;
	}
	$( '.outerlink.langlink .button a' ).attr( 'href', langlink );

	var param_class = param_a_split( 3 );
		if( arr_class.indexOf( param_class ) > -1){
			flag_class = 1;
		}
	var param_serial = param_a_split( 11 );
		var param_year = param_serial.substr( 2, 2 );
			if( param_year.match(/[0-9]/) ){
				param_year = 2000 + Number( param_year );
				flag_year = 1;
			}else{
				param_year = '';
			}
		var param_month = param_serial.substr( 4, 1 ).toUpperCase();
			if( param_month.match(/[0-9XYZ]/) ){
				param_month = param_month.replace(/X/, '10').replace(/Y/, '11').replace(/Z/, '12');
				flag_month = 1;
			}else{
				param_month = '';
			}
	var param_country = param_a_split( 2 ).toUpperCase();
		if( arr_country[ param_country ] ){
			param_country = arr_country[ param_country ];
			flag_country = 1;
		}else{
			param_country = '';
		}
	var param_signature = param_a_split( 4 );
		if( param_signature.length == 4 ){
			flag_signature = 1;
		}
	var param_type = param_a.toUpperCase();

	if ( flag_class && flag_year && flag_month && flag_country && flag_signature ){
		$( '.prodinfo .serial .number .body' ).html( param_serial );
		$( '.prodinfo .serial .country .body' ).html( param_country );
		$( '.prodinfo .serial .date .body' ).html( param_year + '/' + param_month );
		if( param_type ){
			$( '.prodhead .prodnum' ).html( 'FR-' + param_type );
		}
	}

	function param_a_split( n ) {
		var val = param_a.substr( 0, n );
		param_a = param_a.substr( n );
		return val;
	}
});
