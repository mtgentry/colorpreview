$(document).on('ready', function(){ 
/*$.cookie('example','foo') 
   var countries = [
        "Australia",
        "Austria",
        "Belgium",
        "Canada",
        "Czech Republic",
        "Denmark",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Iceland",
        "Ireland",
        "Israel",
        "Italy",
        "Japan",
        "Luxembourg",
        "Malta",
        "Monaco",
        "Netherlands",
        "New Zealand",
        "Norway",
        "Poland",
        "Portugal",
        "Spain",
        "Sweden",
        "Switzerland",
        "United Kingdom",
        "United States"
        ];
      
        var country,
          popupEnable     = true,
          timesShowPopup  = 9,  //times to show popup
          dayNotShowPopup = 60; //set how many days don't show popup after lash show
    function popUp(){
    }

    $(function() {
        var ip = $('#client-ip').data('ip');
        var getIpEndPoint = "http://api.ipstack.com/" + ip + "?access_key=f7184f39b14cee621b1dd7458bf79738&output=json&legacy=1";
        $.getJSON(getIpEndPoint, function (data) {
          country = data.country_name;
          //var ip = data.ip; 
        popupEnable = (countries.indexOf(country) > -1);
        if (popupEnable) {
            var cookiePopupEnable = $.cookie('popupEnable');
            if (typeof cookiePopupEnable === 'undefined') {
              $.cookie("popupEnable", timesShowPopup, { expires: dayNotShowPopup, path: '/'});
              popUp();
            } else if (cookiePopupEnable > 0) {
              popUp();
            };
          }
        })
    });
*/

    
    $(".modal-popup").on("click",function(e){
        if (e.target === this)
        {
          $(".modal-popup").removeClass("form-show");
          $(".modal-popup").addClass("form-hide");
        }
    });
    $(document).on('click','.color-wheel-preview',function(){
      var key = $(this).data('key')
      var name = $(this).data('name')
      var description = $(this).data('description')

      colorwheel = colorwheels[key] || colorwheels['split']
      window.modules.colorwheel.drawColorChart(colorwheel, 'small')
      
      $('.colors-modal-header').text(name)
      $('.colors-modal-text').text(description)
      $('#color-modal').appendTo("body").modal('show')
    })  

    $(".icon-close").on("click",function(){
      $(".modal-popup").removeClass("form-show");
      $(".modal-popup").addClass("form-hide");
      $(".modal-popup").fadeOut('fast');
      $(".backdrop-course").addClass('hide');
    });
    $(".form-close").on("click",function(){
      $(".form-overlay").removeClass("form-show");
      $(".form-overlay").addClass("form-hide");
      $(".form-overlay").fadeOut('fast');     
    }); 

    $('.trigger-how-activate').on('click',function(){
      $('#modal-how-activate').appendTo("body").modal('show');
    });

    $('.alert-close-icon').on('click',function(){
      $('.alert-activate').addClass('dismiss');
      $('.alert-color').hide()
      $('.notification-message').removeClass('active');
    })

    $('#modal-how-activate').on('hidden.bs.modal',function(){
      setTimeout(function(){
        $('.alert-activate').addClass('dismiss');
        $('.notification-message').removeClass('active');
      },500);    
    })

    $('.alert-close-icon.colors-how').on('click',function(){
      $('.alert-color').addClass('dismiss');
      document.cookie = "popupalert=false;"    
    })

    $('.trigger-how-color').on('click',function(){
      $('#modal-how').appendTo("body").modal('show');
    })

    $('#modal-how').click(function(){
      setTimeout(function(){
        $('.alert-activate').addClass('dismiss');
      },500)
    })

    setTimeout(function(){
        $('#modal-account').appendTo("body").modal('show');
    },500)

    $('#modal-account').on('hidden.bs.modal',function(){
      setTimeout(function(){
        $('.alert-activate').addClass('dismiss');
        $('.notification-message').removeClass('active');
      },500);    
    })
    $('.alert-close-icon.favorite-upgrade').click(function(){
      setTimeout(function(){
        $('.alert-upgrade').addClass('dismiss');
      },500)
      document.cookie = "popupfavorite=false;"    
      
    })

    $('.tip-close').click(function(){
      $('.modal-tip').fadeOut()
    })
    
    // var click;
    // // $.cookie('modalusage',click)
    // var get_cookie;
    // if ($.cookie('modalusage')) {
    //   get_cookie = parseInt($.cookie('modalusage'))
    //   click = parseInt($.cookie('modalusage'))
    // }else{
    //   $.cookie('modalusage', 0)
    //   get_cookie = 0;
    //   click = 0;
    // }

    // COOKIE LIMIT POPUP

    // FOR TESTER COOKIES REMOVED
    // var date = new Date();
    // var minutes = 1; 1 = 1 MINUTE
    // date.setTime(date.getTime() + (minutes * 60 * 1000));

    var expiration = new Date();
        expiration.setHours(23,59,59,0); //set expiration at the end of the day

    var cookie_count;
    cookie_count = parseInt($.cookie('counter'))

    if(!$.cookie('status')){
      $.cookie('status', true, { expires: expiration, path: "/" })
      if ($.cookie('counter')) {
        cookie_count++;
        $.cookie('counter', cookie_count, { expires: 20*365, path: "/" })
      }
      else{
        $.cookie('counter', 1, { expires: 20*365, path: "/" })
      }
    }

    if($.cookie('status') == 'true' && !$.cookie('counter')){
      $.cookie('status', true, { expires: expiration })
      $.cookie('counter', 1, { expires: 20*365, path: "/" })
    }
      
    //COOKIE EMAIL POPUP
    var visit;
    visit = parseInt($.cookie('visitcount'), {path: "/"})
    visit_nopath = parseInt($.cookie('visitcount'))

    if ($.cookie('visitcount') && $.cookie('visit')) {
      visit++;
      $.cookie('visitcount', visit, { expires: expiration, path: '/' });
    } else{
      $.cookie('visit',true, {path: "/"})
      $.cookie('visitcount', 0, { expires: expiration, path: '/' });
    }

    if (visit > 2) {
      $.cookie('visit', false, {expires: 1, path: "/"});
    }
    
    // POPUP FREE DESIGN
    if ($.cookie('visit') == 'true') {
      setTimeout(function() {
          // var popup = $('.mailing_list_popup');
          // popup.addClass('show');
          $(".modal-popup").removeClass("form-hide");
          $(".modal-popup").addClass("form-show");
          $(".modal-popup").fadeIn();
          $('.modal-popup').css({
          'visibility' : 'visible',
          'opacity' : '1',
          'transition' : 'opacity 100ms linear'
          });
          $(".backdrop-course").removeClass('hide');
      },40000);// after 40 seconds, show mailing list popup  (40 seconds = 40000 )
    }

    // POPUP USER LIMIT
    function modalLimit(amount,p){
      $('.modal-usage-limit .img-tip').attr('src',amount)
      $('.modal-usage-limit#modal-usage-limit').mouseover(function(){
        if (cookie_count == 8) {
          $('.modal-usage-reached .title-modal').text(p)
          $('.modal-usage-limit-message').addClass('hide')
        }
        else{
          $('.modal-usage-limit-message .img-tip').attr('src',amount)
          $('.modal-usage-limit-message .text-tip').text(p)
        }
      })
    }
    // if (cookie_count == 1){
    //   var p = "You have 6 sessions left."
    //   modalLimit('/timer_1.svg',p)
    // }
    // else if(cookie_count == 2){
    //   var p = "You have 5 sessions left."
    //   modalLimit('/timer_2.svg',p)
    // }
    // else if(cookie_count == 3){
    //   var p = "You have 4 sessions left."
    //   modalLimit('/timer_3.svg',p)
    // }
    // else if(cookie_count == 4){
    //   var p = "You have 3 sessions left."
    //   modalLimit('/timer_4.svg',p)
    // }
    // else if(cookie_count == 5 ){
    //   var p = "You have 2 sessions left."
    //   modalLimit('/timer_5.svg',p)
    // }
    // else if(cookie_count == 6){
    //   var p = "You have 1 session left."
    //   modalLimit('/timer_6.svg',p)
    // }
    if(cookie_count >= 7){
      // var p = "Free trial ended."
      $('.modal-usage-limit, .header__modal-limit').removeClass('hide') 
      $('.modal-usage-reached').removeClass('hide')
      $('.backdrop-usage').removeClass('hide')
			document.cookie = "promotion=true";
      // modalLimit('/timer_7.svg',p)
    }
    
    $('.modal-usage-limit, .header__modal-limit').click(function(){
      $('.modal-usage-limit-message, .header__modal-message').removeClass('hide')
      $('.modal-usage-limit, .header__modal-limit').toggleClass('stay')
    }).mouseover(function(){
      $('.modal-usage-limit-message, .header__modal-message').removeClass('hide')
    }).mouseout(function(){
      var stay = $(this).hasClass('stay')
      if(!stay){
        $('.modal-usage-limit-message, .header__modal-message').addClass('hide')
      }
    })

    $('.icon-close-limit, .header__modal-icon').click(function(){
      $('.modal-usage-limit-message, .header__modal-message').addClass('hide')
      $('.modal-usage-limit, .header__modal-limit').removeClass('hide stay')
    })   

    $(window).load(function(){
      $('.modal-usage-limit, .header__modal-limit').removeClass('hide')
      $('.modal-usage-limit, .header__modal-limit').fadeIn('slow')
    }) 
})