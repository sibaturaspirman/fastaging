$(function () {

  var openClass = 'is-open',
      stateClass = 'is-active',
      pulldownSpeed = 300,
      slideSpeed = 700,
      scrollSpeed = 1000;

  //pulldown menu
  $('.meswjs-menuBox').bind({
    mouseenter: function () {
      $(this).find('.meswjs-subMenu').stop(true, true).slideToggle(pulldownSpeed);
      var btnHeight = $(this).find('.meswjs-areaButton').outerHeight();
      $(this).find('.meswjs-subMenu').css('top', btnHeight);
    },
    mouseleave: function () {
      $(this).find('.meswjs-subMenu').stop(true, true).slideToggle(pulldownSpeed);
    }
  });

  //ckick pulldown
  $('.meswjs-menuLink').on("click", function (e) {
    e.preventDefault();
    var $this = $(this),
      hash = this.hash,
      $parents = $(hash).parents('.meswjs-countryBox');

    $parents.find('.meswjs-titleButton').addClass(openClass);
    $parents.find('.meswjs-subInner').not('.' + stateClass).slideToggle(0);
    $parents.find('.meswjs-subInner').addClass(stateClass);
    var href = $this.attr('href'),
      target = $(href == '#' || href == '' ? 'html' : href),
      position = target.offset().top;
    $('html, body').stop(false, false).animate({ scrollTop: position }, scrollSpeed, 'swing');
    return false;
  });

  //all open
  $('.meswjs-positive').on("click", function (e) {
    e.preventDefault();
    var $title = $('.meswjs-titleButton'),
      $target = $('.meswjs-subInner');
    $title.addClass(openClass);
    $target.slideDown(slideSpeed);
    $target.addClass(stateClass);
  });

  //all close
  $('.meswjs-negative').on("click", function (e) {
    e.preventDefault();
    var $title = $('.meswjs-titleButton'),
      $target = $('.meswjs-subInner');
    $title.removeClass(openClass);
    $target.slideUp(slideSpeed);
    $target.removeClass(stateClass);
  });

  //ckick title
  $('.meswjs-titleButton').on("click", function () {
    var $this = $(this),
      $parents = $this.parents('.meswjs-countryBox');
    $this.toggleClass(openClass);
    $parents.find('.meswjs-subInner').slideToggle();
    $parents.find('.meswjs-subInner').toggleClass(stateClass);
  });

});