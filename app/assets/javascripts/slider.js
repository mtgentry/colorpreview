$(document).ready(function(){
  if($('#colors_index').html()){
    if(!$.cookie('favorites')){
      $('.one-time').slick({
          speed: 400,
          slidesToShow: 1,
          initialSlide: 0,
          adaptiveHeight: true,
          swipe: false,
          swipeToSlide: false,
          touchMove: false,
          draggable: false,
          adaptiveHeight: true,
          prevArrow: $('.prev-button'),
          nextArrow: $('.next-button')
      });

      $('.color-wheel-preview').click(function(){
        var name = $(this).attr('data-name')
        $('#color-modal').attr('data-name', name)
      })

      var data_length;

      $('#color-modal').on('shown.bs.modal', function (e) {
        var name = $(this).attr('data-name');

        $.ajax({ 
          type: 'GET', 
          url: 'modals/modals.json', 
          dataType: 'json',
          success: function (res) {
            // Reset slider item after slickAdd
            $('.slick-slide:not([data-slick-index="0"])').remove()

            // Slider item default is Complementary
            var data = res.Complementary;

            $.each(res, function(key, item){
              if(name == key){
                // Slider item updated from JSON
                data = item;
              }
            })
            
            // Add slider item from data from JSON
            $.each(data, function(key, item){
              $('.one-time').slick('slickAdd','<div>'+
                '<div class="content-modal-slider">' +
                  '<img src="'+item.image+'" alt="First slide" width="100%"> ' +
                  '<p style="float: right;">Credit: <a href="'+item.creditURL+'">'+item.credit+'</a>.</p> <br>' +
                  '<h4>'+item.title+'</h4>' +
                  '<p style="margin-top: 2%">' + item.desc +
                 '</p>' +
                '</div>' +
              '</div>');
            })

            data_length = Object.keys(data).length;
          },
          error: function(e) {
             console.log(e);
          }
        });
        
        $('.one-time').resize()
      })
    }
  }
  
  if($('#favorites_index').html()){
    if($('.favorites-color').length != 0){
      setTimeout(function(){
        $('.favorites-color').slick({
          slidesToShow: 2,
          slidesToScroll: 2,
          mobileFirst: true,
          responsive: [
            {
              breakpoint: 768,
              settings: 'unslick'
            }
          ],
          dots: true,
          prevArrow: false,
          nextArrow: false
        })
      },250)
    }
  }
});