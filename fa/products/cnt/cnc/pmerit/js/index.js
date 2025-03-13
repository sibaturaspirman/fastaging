$(function() {

  var $accordion,
      openClass = 'open',
      stateClass = 'active',
      pulldownSpeed = 300,
      slideSpeed = 700,
      scrollSpeed = 1000;

  //pagetop smoothscroll
  $('.pagetop a[href^=#]').click(function() {
    var href= $(this).attr('href'),
        target = $(href == '#' || href == '' ? 'html' : href),
        position = target.offset().top;
    $('html, body').stop(false, false).animate({scrollTop:position}, scrollSpeed, 'swing');
    return false;
  });

  //pulldown menu
  $('.cnc_map .box_01').hover(function() {
    $(this).find('.submenu').stop(true, true).slideToggle(pulldownSpeed);
    var btnHeight = $(this).find('.map_btn').outerHeight();
    $(this).find('.submenu').css('top', btnHeight);
  }, function() {
    $(this).find('.submenu').stop(true, true).slideToggle(pulldownSpeed);
  });

  //ckick pulldown
  $('.cnc_map a').click(function(e) {
      e.preventDefault();
      var $this = $(this),
          hash = this.hash,
          $parents = $(hash).parents('.detail_country');

      if($this.hasClass('trigger')) return false;

      $parents.find('h4').children('span').addClass(openClass);
      $parents.find('.subInner').not('.' + stateClass).slideToggle(0);
      $parents.find('.subInner').addClass(stateClass);
      $parents.find('.pagetop').fadeIn(slideSpeed - 500);
      var href= $this.attr('href'),
          target = $(href == '#' || href == '' ? 'html' : href),
          position = target.offset().top;
      $('html, body').stop(false, false).animate({scrollTop:position}, scrollSpeed, 'swing');
      return false;
  });

  //all open
  $('.click_portion .positive_sign a').click(function(e) {
      e.preventDefault();
      var $title = $('.detail_country h4 span'),
          $target = $('.subInner');
      $title.addClass(openClass);
      $target.slideDown(slideSpeed);
      $target.addClass(stateClass);
      $('.detail_country .pagetop').fadeIn(slideSpeed - 500);
  });

  //all close
  $('.click_portion .negative_sign a').click(function(e) {
      e.preventDefault();
      var $title = $('.detail_country h4 span'),
          $target = $('.subInner');
      $title.removeClass(openClass);
      $target.slideUp(slideSpeed);
      $target.removeClass(stateClass);
      $('.detail_country .pagetop').fadeOut(slideSpeed - 500);
  });

  //ckick title
  $('.detail_country h4 span').click(function(e) {
    var $this = $(this),
        $parents = $this.parents('.detail_country');
    $this.toggleClass(openClass);
    $parents.find('.subInner').slideToggle();
    $parents.find('.subInner').toggleClass(stateClass);
    $parents.find('.pagetop').fadeToggle(slideSpeed - 500);
  });

  //print
  $('#printNavi a').click(function(e) {
    $('body').addClass('print_preview');

  });

});