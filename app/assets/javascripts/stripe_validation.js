var this_script_tag = document.querySelector('script[data-id][data-get="stripe_form"]');
var stripe_id;

var product = {};

product["id"] = $('.plan_id').val();
product["price"] = $('.plan_id').attr('data-price');
product["amount"] = $('.plan_id').attr('data-price');
product["coupon"] = $('.coupon').val();

if (this_script_tag) {
  stripe_id = this_script_tag.getAttribute('data-id');
  
  var stripe = Stripe(stripe_id);
  var elements = stripe.elements({
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans',
      }
    ]
  });

  var elementStyles = {
    base: {
      color: '#00bbff',
      fontFamily: 'IBM Plex Sans, sans-serif',
      letterSpacing: '.5px',
      fontSize: '20px',
      fontSmoothing: 'antialiased',

      ':focus': {
        color: '#00bbff',
      },

      '::placeholder': {
        color: '#E5E5E5',
      },

      ':focus::placeholder': {
        color: '#E5E5E5',
      },
    },
    invalid: {
      color: '#FA755A',
      ':focus': {
        color: '#FA755A',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  };

  var elementClasses = {
    focus: 'focus',
    empty: 'empty',
    invalid: 'invalid',
  };

  var cardNumber = elements.create('cardNumber', {
    style: elementStyles,
    classes: elementClasses,
    placeholder: "0000 0000 0000 0000"
  });
  cardNumber.mount('#cardNumber');

  var cardExpiry = elements.create('cardExpiry', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardExpiry.mount('#expDate');

  var cardCvc = elements.create('cardCvc', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardCvc.mount('#cvcNumber');

  cardNumber.on('change', function(event) {
    disabledEnabledButtonOnCardChange(event)
  });

  cardExpiry.on('change', function(event) {
    disabledEnabledButtonOnCardChange(event)
  });
  
  cardCvc.on('change', function(event) {
    disabledEnabledButtonOnCardChange(event)
  });

  function disabledEnabledButtonOnCardChange(event) {
    if (event.complete) {
      $('#btn-save-subscription').prop("disabled", false);
      $('#btn-save-subscription').removeClass("btn-wait");
      $('#process_message').addClass('hide_process')
    } else if (event.error) {
      $('#btn-save-subscription').prop("disabled", true);
      $('#btn-save-subscription').addClass("btn-wait");
      $('#process_message').addClass('hide_process')
    }
  }

  $(".account-form").blur(function(){
    var password = $(".password").val();
    var email    = $(".email").val();
    if(email && password){
      $.ajax({
        type: "GET",
        dataType:"json",
        data: {
          email: email,
          password: password
        },
        url: "/account_valid_stripe",
        success: function(result){
          if(result.message == 'valid'){
            $('#btn-save-subscription').prop("disabled", false);
            $('.account-form').removeClass('error')
            $(".error_message").empty()
          }else if(result.message == 'not valid'){
            $('.account-form').addClass('error')
            $(".error_message").text("Email and password isn't valid")
            $('#btn-save-subscription').prop("disabled", true);
          }else if(result.message == 'not registered'){
            $('.email').removeClass('error')
            $(".error_message").empty()
            $('#btn-save-subscription').prop("disabled", false);
          }else if(result.message == 'is already registered'){
            $('.email').addClass('error')
            $(".error_message").text("Ooops! This email address is already registered. Please log in.")
            $('#btn-save-subscription').prop("disabled", true);
          }
        }
      });
    }
  });

  var form = document.getElementById("payment-form");

  form.addEventListener("submit", function(e) {
    paymentIntent()
  });

  $(document).on("ajax:beforeSend", "form#payment-form", function (e, data, status, xhr) {
    return false;
  });

  function paymentIntent() {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
      .then(function(result) {
        return result.json();
      })
      .then(function(data) {
        // Form submit
        $('#btn-save-subscription').prop("disabled", true);
        $('#btn-save-subscription').addClass('btn-wait');
        $('#btn-save-subscription').val('Payment on process')
        $('#process_message').removeClass('hide_process')

        payWithCard(stripe, cardNumber, data.clientSecret);
      })
  }

  function userRegistration(result) {
    $.cookie('favorites', JSON.stringify([null, null, null, null, null, null, null, null, null, null]))

    var form$ = $("#payment-form");
    
    form$.append("<input type='hidden' name='user_attributes[email]' value='" + $(".email").val() + "'/>");
    form$.append("<input type='hidden' name='user_attributes[password]' value='" + $(".password").val() + "'/>");
    form$.append("<input type='hidden' name='user_attributes[favorites_color]' value='" + $(".favorites_color").val() + "'/>");

    if (form$.attr('data-remote')) {
      form$.trigger("submit.rails");
    } else {
      form$.get(0).submit();
    }

    var user_email = $(".email").val()

    setTimeout(function() {
      var path = "/checkout_webhook",
          email = "?email="+ user_email,
          payment_id = "&payment_id=" + result.paymentIntent.id,
          plan_id = "&plan_id=" + product["id"],
          price = "&price=" + product["price"],
          amount = "&amount=" + product["amount"],
          coupon = "";

      if($('.coupon').length) {
        coupon = "&coupon=" + product["coupon"];
      }

      window.location.replace(path + email + payment_id + plan_id + price + amount + coupon);
    }, 1000)
  }

  var payWithCard = function(stripe, card, clientSecret) {
    var user_email = $(".email").val()

    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user_email
          }
        }
      })
      .then(function(result) {
        if (result.error) {
          console.log(result);
          // Show error to your customer
          $('#process_message').addClass("error_message");
          $('#process_message').text("Payment failed! " + result.error.message);

          var data = {};
          data['payment_attempt'] = {}
          data['payment_attempt']['email'] = user_email
          data['payment_attempt']['type_error'] = result.error.type
          data['payment_attempt']['code'] = result.error.code
          data['payment_attempt']['message'] = result.error.message

          fetch("/payment_attempts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
        } else {
          // The payment succeeded!
          $('#btn-save-subscription').prop("disabled", false);
          $('#btn-save-subscription').text("Completed");
          $('#btn-save-subscription').removeClass('btn-wait');
          $('#process_message').removeClass("error_message");
          $('#process_message').addClass("success_message");
          $('#process_message').text("Payment succeed!");

          $(document).on("ajax:beforeSend", "form#payment-form", function (e, data, status, xhr) {
            return true;
          });
          
          userRegistration(result);
        }
      });
  };

  $('.form_payment.coupon').keyup(function(){
    if($(this).val().length) {
      $('.coupon-apply').prop('disabled', false)
    } else {
      $('.coupon-apply').prop('disabled', true)
      $('.btn_next_payment').prop('disabled', false);
    }

    $('.price-display').css('text-decoration', 'none');
    $('.price-off').remove();
    var current_price = $('.btn_next_payment').data('price');
    product["price"] = current_price * 100;

    $('.coupon_message').text("")
  })

  $('.coupon-apply').click(function(){
    var coupon = $('.form_payment.coupon').val();
    $('.btn_next_payment').prop('disabled', true);

    $.ajax({
      type: "GET",
      dataType:"json",
      data: {
        coupon: coupon
      },
      url: "/check_coupon",
      success: function(result){
        if(result){
          if(result.valid) {
            if(result.amount_off) {
              $('.coupon_message').text('Thanks! $' + result.amount_off + ' off coupon will be applied.');
              
              var current_price = $('.btn_next_payment').data('price');
              var off           = result.amount_off;
              var amount        = current_price - off;
              amount = Math.round((amount + Number.EPSILON) * 100) / 100

              couponAppliedtoPrice(amount, coupon)
            } else if (result.percent_off) {
              $('.coupon_message').text('Thanks! ' + result.percent_off + '% coupon will be applied.');

              var current_price = $('.btn_next_payment').data('price');
              var off           = result.percent_off;
              var amount        = current_price - (current_price * off/100);
              amount = Math.round((amount + Number.EPSILON) * 100) / 100

              couponAppliedtoPrice(amount, coupon)
            }
          } else {
            $('.coupon_message').removeClass('success_message');
            $('.coupon_message').addClass('error_message');
            $('.coupon_message').text('Your coupon is invalid, please try another coupon');
            $('.btn_next_payment').prop('disabled', true);  
          }
        } else {
          $('.coupon_message').removeClass('success_message');
          $('.coupon_message').addClass('error_message');
          $('.coupon_message').text('Coupon invalid');
          $('.btn_next_payment').prop('disabled', true);
          $('.price-display').css('text-decoration', 'none');
          $('.price-off').remove();
        }
      }
    });
  })

  function couponAppliedtoPrice(price, coupon) {
    $('.coupon_message').removeClass('error_message')
    $('.coupon_message').addClass('success_message')

    if(!$('.email').hasClass("error")){
      $('.btn_next_payment').prop('disabled', false)
    }

    $('.plan_id').attr('data-price', price * 100)
    $('.plan_id').attr('data-coupon', coupon)
    product["amount"] = price * 100;
    product["coupon"] = $('.coupon').val();

    $('.price-display').css('text-decoration', 'line-through');
    $('.price-off').remove();
    $('.btn_next_payment').append('<span class="price-off">$' + price + '</span>');
  }
}