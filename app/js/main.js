var body = document.body;
var wrapMain = document.getElementById('main');
var scrollOffsetMain = $(window).scrollTop();
var btnProjects = $('._header__projects');
var btnMail = $('._header__mail');
var disableActiveLink = false;
var cases = $('._case');
var nav = $('.header-nav');
var sections = $('._menu');
var windowWidth = window.innerWidth || document.documentElement.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight;
var sectionMainHeight = document.getElementsByClassName('_section_main')[0].offsetHeight;
var headerMobile = document.getElementsByClassName('_header-mobile')[0];
var header = document.getElementsByClassName('_header')[0];
var headerFixed = document.getElementsByClassName('_header-fixed')[0];
var menuLineWrap = document.getElementsByClassName('_menu-line-wrap')[0];
var headerNav = document.getElementsByClassName('_header-nav')[0];
var modal = document.getElementById('modal-projects');
var caseTop = document.getElementsByClassName('case-top')[0];
var caseWrap = document.getElementsByClassName('_case-wrap');
var btnScrollToCase = document.getElementsByClassName('_scroll_to_case');
var caseSingleHeight = document.getElementsByClassName('case_single')[0].offsetHeight;
var isRetina = window.devicePixelRatio > 1 ? true : false;
var currentScrollPos = 0;

$(document).ready(function() {
  init();
  var hash = location.hash.slice(1);

  if (hash == '' || hash == 'main') {
    openMainPage(false);
  } else if (/case-/i.test(hash)) {
    openCasePage(hash);
  } else if (hash == 'projects' || hash == 'partners' || hash == 'services' || hash == 'contacts') {
    $(body).animate({ opacity: '1' }, 0);
    openMenuItem('#' + hash);
  }

  $('.nav__link, .nav__logo').on('click', function(event) {
    event.preventDefault();
    clickOnLink(this);
  });

  $('._anchor').on('click', function() {
    clickOnLink(this);
  });

  $('._link-back').on('click', function() {
    var hash = window.location.hash + '-preview';

    scrollOffsetMain = $('' + hash).offset().top;
    $(body).animate({ opacity: '0' }, 400);
    setTimeout(() => {
      closeModalProjects();
      $('.modal-window_open').removeClass('modal-window_open');
      closeMobileMenu();
      location.hash = '';
      if (typeof window.history.replaceState == 'function') {
        history.replaceState({}, '', location.href.slice(0, -1));
      }
      btnProjects.css({ display: '' });
      btnMail.css({ display: '' });
    }, 400);
  });

  $(window).on('scroll', function() {
    if(!($('body, html').hasClass('not-scroll')))
      currentScrollPos = window.scrollY;
    fixedMenu();
    changeActiveLink();
    scrollCaseTop();
  });

  $(caseTop).on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 400);
  });

  $(window).on('popstate', function(e) {
    e.preventDefault();
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    var hash = location.hash.slice(1);

    if (hash == '') {
      $(body).animate({ opacity: '0' }, 400);
      openMainPage(false);
    } else if (/case-/i.test(hash)) {
      $(body).animate({ opacity: '0' }, 400);
      openCasePage(hash);
    } else if (hash == 'projects' || hash == 'partners' || hash == 'services' || hash == 'contacts') {
      $(body).animate({ opacity: '1' }, 0);
      for (var i = 0; i < caseWrap.length; i++) {
        caseWrap[i].classList.add('hidden');
      }
      wrapMain.classList.remove('hidden');
      // openMenuItem('#' + hash);
      disableActiveLink = false;
    } else if (hash == 'main') {
      $(body).animate({ opacity: '1' }, 0);
      for (var i = 0; i < caseWrap.length; i++) {
        caseWrap[i].classList.add('hidden');
      }
      wrapMain.classList.remove('hidden');
      // openMenuItem('#' + hash);
      disableActiveLink = false;
    }
  });

  for (var i = 0; i < btnScrollToCase.length; i++)
    btnScrollToCase[i].addEventListener('click', scrollToCase, false);

  /*==========
  block form
  ==========*/

  $("#form").submit(function(e) {
    e.preventDefault();
    var form = $(this);
    jQuery.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
      success: function() {
        form[0].reset();
      },
      error: function() {
      }
    });
  });

  $("#form-footer").submit(function(e) {
    e.preventDefault();
    var form = $(this);
    jQuery.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
      success: function() {
        form[0].reset();
      },
      error: function() {
      }
    });
  });
});

function scrollToCase() {
  $('html, body').animate({
    scrollTop: caseSingleHeight
  }, 400);
}

function openMainPage(isClickedOnLink) {
  setTimeout(() => {
    for (var i = 0; i < caseWrap.length; i++) {
      caseWrap[i].classList.add('hidden');
    }
    wrapMain.classList.remove('hidden');
    if (!isClickedOnLink) {
      $('html, body').animate({
        scrollTop: scrollOffsetMain
      }, 0);
    }
    $(body).animate({ opacity: '1' }, 400);
    disableActiveLink = false;
    caseTop.classList.remove('case-top_visible');

  }, 400);

}

function openCasePage(hash) {
  setTimeout(() => {
    $(window).scrollTop(1);
    // $(window).scrollTop(0);
    wrapMain.classList.add('hidden');
    for (var i = 0; i < caseWrap.length; i++) {
      caseWrap[i].classList.add('hidden');
    }
    $('.' + hash.toString()).removeClass('hidden');
    $(body).animate({ opacity: '1' }, 400);
    disableActiveLink = true;
  }, 400)
}

function openMenuItem(hash) {
  caseTop.classList.remove('case-top_visible');
  $('html, body').animate({
    scrollTop: $(hash).offset().top
  }, 0);
}

function init() {
  fixedMenu();
  clickOnCase();
  changeActiveLink();
  addAttrToImages();
  lazyload();
  initSwiper();
}


/*==========
cases
==========*/


function clickOnCase() {
  cases.each(function(idx, el) {
    $(el).on('click', function(event) {
      event.preventDefault();
      var caseHash = $(el).data('hash');
      location.hash = caseHash;
      closeModalProjects();
    });
  });
}

function scrollCaseTop() {
  var hash = location.hash.slice(1);
  if (/case-/i.test(hash)) {
    var top = $(this).scrollTop();
    if (top > windowHeight) {
      caseTop.classList.add('case-top_visible');
    } else {
      caseTop.classList.remove('case-top_visible');
    }
  } else {
    caseTop.classList.remove('case-top_visible');
  }
}

function changeActiveLink() {
  var cur_pos = $(this).scrollTop();

  nav.find('a').removeClass('nav__link_active');
  if (disableActiveLink == false) {
    sections.each(function() {
      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();

      if (cur_pos >= Math.floor(top) && cur_pos <= Math.floor(bottom)) {
        var hash = $(this).attr('id');
        nav.find('a').removeClass('nav__link_active');
        $(this).addClass('nav__link_active');
        nav.find('a[href="#' + hash + '"]').addClass('nav__link_active');
      }
    });
  }
}

function clickOnLink(link) {
  var $el = $(link);
  var id = $el.attr('href');

  var hash = location.hash.slice(1);;
  var linkHref = id.slice(1);
  if (/case-/i.test(hash)) {
    $(body).animate({ opacity: '0' }, 400);
    openMainPage(true);

    setTimeout(() => {
      closeModalProjects();
      $('html, body').animate({
        scrollTop: $(id).offset().top
      }, 0).promise().then(function() {
        $('.modal-window_open').removeClass('modal-window_open');
        closeMobileMenu();
        location.hash = linkHref;
        btnProjects.css({ display: '' });
        btnMail.css({ display: '' });
      });
    }, 400);
  } else {
    openMainPage(true);
    closeModalProjects();
    $('html, body').animate({
      scrollTop: $(id).offset().top
    }, 500).promise().then(function() {
      $('.modal-window_open').removeClass('modal-window_open');
      closeMobileMenu();
      location.hash = linkHref;
      btnProjects.css({ display: '' });
      btnMail.css({ display: '' });
    });
  }
}

function fixedMenu() {
  var top = currentScrollPos > 0 ? currentScrollPos : window.scrollY;

  if (windowWidth >= 480) {
    if (top >= sectionMainHeight) {
      headerFixed.classList.add('header-fixed_open')
    } else
      headerFixed.classList.remove('header-fixed_open');
  } else {
    header.style.display = 'none';
    headerFixed.style.display = 'none';
    headerMobile.style.display = 'block';
  }
}

function displayMobileMenu() {
  menuLineWrap.classList.toggle('_menu-line-wrap_open')
  headerNav.classList.toggle('header-nav_open');
  $('body, html').toggleClass('not-scroll');
  $('body, html').scrollTop(currentScrollPos);
}

function closeMobileMenu() {
  menuLineWrap.classList.remove('_menu-line-wrap_open')
  headerNav.classList.remove('header-nav_open');
  $('body, html').removeClass('not-scroll');
}

function openModal(modalName, fast) {
  var modal = $('#' + modalName);

  btnProjects.css({ display: 'none' });
  btnMail.css({ display: 'none' });
  $('body, html').addClass('not-scroll');
  $('body, html').scrollTop(currentScrollPos);
  if (fast)
    modal.addClass('modal-window_fast');
  modal.addClass('modal-window_open');
}

function closeModal(modalName, fast) {
  var modal = $('#' + modalName);

  $('body, html').removeClass('not-scroll');
  $('body, html').scrollTop(currentScrollPos);
  if (fast)
    modal.addClass('modal-window_fast');
  else
    modal.removeClass('modal-window_fast');
  modal.removeClass('modal-window_open');

  if (fast)
    setTimeout(function() {
      modal.removeClass("modal-window_fast");
    }, 400);

  btnProjects.delay(400).css({ display: '' });
  btnMail.delay(400).css({ display: '' });
}

function openModalProjects() {
  $('body, html').addClass('not-scroll');
  $('body, html').scrollTop(currentScrollPos);
  $('.modal-window_open').removeClass('modal-window_open');
  modal.classList.remove('hidden');
  modal.classList.add('modal-window_open');
}

function closeModalProjects() {
  $('body, html').removeClass('not-scroll');
  $('body, html').scrollTop(currentScrollPos);
  modal.classList.remove('modal-window_open');
}

function nextItem() {
  var items = $('._modal-window-service');

  for (var item of items) {
    if ($(item).hasClass('modal-window_open') && $(item).next().hasClass('_modal-window-service')) {
      var itemId = $(item).prop('id');
      var nextItemId = $(item).next().prop('id');

      closeModal(itemId, true);
      openModal(nextItemId, true);
      break;
    }
  }
}

function prevItem() {
  var items = $('._modal-window-service');

  for (var item of items) {
    if ($(item).hasClass('modal-window_open') && $(item).prev().hasClass('_modal-window-service')) {
      var itemId = $(item).prop('id');
      var prevItemId = $(item).prev().prop('id');

      closeModal(itemId, true);
      openModal(prevItemId, true);
      break;
    }
  }
}


/*==========
slider
==========*/

function initSwiper() {
  var sliders = $('._slider');
  var nextProjects = $('.next-projects');

  sliders.each(function(idx, slider) {
    var galleryTop = new Swiper($(slider).find('.gallery-top'), {
      slidesPerView: 'auto',
      pagination: {
        el: $(slider).find('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: $(slider).find('.swiper-button-next'),
        prevEl: $(slider).find('.swiper-button-prev'),
      },
    });
    var galleryThumbs = new Swiper($(slider).find('.gallery-thumbs'), {
      centeredSlides: true,
      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true,
    });

    galleryTop.controller.control = galleryThumbs;
    galleryThumbs.controller.control = galleryTop;
  });

  nextProjects.each(function(idx, slider) {
    var swiper = new Swiper($(slider).find('.swiper-container'), {
      slidesPerView: 'auto',
      navigation: {
        nextEl: $(slider).find('.modal-body_arrow-right'),
        prevEl: $(slider).find('.modal-body_arrow-left'),
      }
    });
  });
}


/*==========
lazy load
==========*/

function addAttrToImages() {
  $(caseWrap).each(function(idx1) {
    var id = $(this).data('id');
    var task = $(this).find('.case-task-wrap');
    task.each(function(idx2) {
      if ($(this).hasClass('case-slider') == false) {
        var img = $(this).find('img');
        img.each(function(idx3) {
          $(this).attr('data-task', id + '-task-' + idx2);
        });
      }
    });
  });
}

function lazyload() {
  ! function(window) {
    var $q = function(q, res) {
        if (document.querySelectorAll) {
          res = document.querySelectorAll(q);
        } else {
          var d = document,
            a = d.styleSheets[0] || d.createStyleSheet();
          a.addRule(q, 'f:b');
          for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
            l[b].currentStyle.f && c.push(l[b]);

          a.removeRule(0);
          res = c;
        }
        return res;
      },
      addEventListener = function(evt, fn) {
        window.addEventListener ?
          this.addEventListener(evt, fn, false) :
          (window.attachEvent) ?
          this.attachEvent('on' + evt, fn) :
          this['on' + evt] = fn;
      },
      _has = function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      };

    function loadImage(el, fn) {
      var img = new Image(),
        src = el.getAttribute('data-src');
      if (src != null) {
        img.onload = function() {
          if (!!el.parent)
            el.parent.replaceChild(img, el)
          else
            el.src = src;

          fn ? fn() : null;
        }
        img.src = src;

        // remove hidden class
        el.classList.remove('img_hidden');
      }
    }

    function elementInViewport(el) {
      var rect = el.getBoundingClientRect();

      return (
        Math.abs(rect.top) >= 0 &&
        rect.left >= 0 &&
        Math.abs(rect.top) <= windowHeight &&
        $(el).parents('.case-wrap, #main').hasClass('hidden') != true
      )
    }

    var images = new Array();
    var query = $q('img.lazy');
    var processScroll = function() {
      for (var i = 0; i < images.length; i++) {
        if (elementInViewport(images[i])) {
          loadImage(images[i], function() {
            images.splice(i, i);
          });
        }
      };
    };

    for (var i = 0; i < query.length; i++) {
      // add hidden class
      query[i].classList.add('img_hidden');
      images.push(query[i]);
    }

    initImageAttr(images);
    wrapImageLightbox(images);
    processScroll();
    addEventListener('scroll', processScroll);
  }(this)
}

function initImageAttr(arr) {
  for (var i = 0; i < arr.length; i++) {
    var img = $(arr[i]);
    var imgWidth = img.css('width');
    var imgHeight = img.css('height');
    var preloadImg = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    img.attr({
      'width': imgWidth,
      'height': imgHeight,
      'src': preloadImg
    });

    if (windowWidth < 992) {
      if (windowWidth < 480) {
        replaceImageAttr(img, 'mobile');
      } else if (isRetina) {
        replaceImageAttr(img, 'retina');
      }
    }
  }
}

function replaceImageAttr(img, type) {
  if (img.hasClass('_img_adaptive') && img.attr('data-src') != null) {
    var arr = img.attr('data-src').split('/');
    arr[2] = type;
    var str = arr.join('/');
    img.attr('data-src', str);
  }
}

function wrapImageLightbox(arr) {
  for (var i = 0; i < arr.length; i++) {
    var img = $(arr[i]);

    img.wrap(function() {
      if ($(this).hasClass('_lightbox')) {
        var str = $(this).data('src');
        var task = $(this).data('task');
        if (str != null)
          return '<a href="' + str + '" class="case-photos__img-wrap" data-lightbox="' + task + '"></a>'
        else
          return '<a href="#0" class="case-photos__img-wrap not-active-img"></a>'
      }
    })
  }
}