$(document).ready(function(){
  if($('#main_yellow-aesthetic').length == 0) return false
  var body = $('body');

  changeColor()

  function handle_color_selector() {
    var col_1   = $(this).attr('data-col1');
    var col_2   = $(this).attr('data-col2');
    var col_3   = $(this).attr('data-col3');
    var col_4   = $(this).attr('data-col4');
    var colorauthor = $(this).find('.author').html();

    color_page_elements(col_1,col_2,col_3,col_4,colorauthor);
    return false;
    }

  function changeColor() {
    for (var colorLoop = 0; colorLoop<20; colorLoop++) {
      
      var colors = [];
      if(!colorsets["triad"]) return false
      colors[0] = colorsets["triad"]["w_step4"][colorLoop][0];
      colors[1] = colorsets["triad"]["w_step4"][colorLoop][1];
      colors[2] = colorsets["triad"]["w_step4"][colorLoop][2] || "";
      colors[3] = colorsets["triad"]["w_step4"][colorLoop][3] || "";        
      color_len = colorsets["triad"]["w_step4"][colorLoop].length;
      
      if (colorLoop == 0) { // 9 = center of 0-19 range
        var t = colorauthor["triad"] && colorauthor["triad"]["w_step4"] ? colorauthor["triad"]["w_step4"][colorLoop] : ''
        color_page_elements(colors[0],colors[1],colors[2],colors[3], t);
      }
      if (colorLoop <20) {
        if (colorauthor["triad"] && colorauthor["triad"]["w_step4"] && colorauthor["triad"]["w_step4"][colorLoop]) {
          var colorAuthor = '<span class="author_dot"><span class="dot"></span></span>';
          var colorAuthorName = colorauthor["triad"]["w_step0"][colorLoop]
        } else {
          var colorAuthor = '';
          var colorAuthorName = '';
        }
        var colors_html = ''
        for (var i = 0; i < color_len; i++) {
          // disable 5 colors support
          if(i >= 4) break
          colors_html += '<span class="cs colors_'+ (i + 1) +'" style="background:'+colors[i]+'" ></span>'
        }

        // create 20 color-selector links
        $('.color_selectors').append(
          '<div class="color_selector" data-col1="'+colors[0]+'" data-col2="'+colors[1]+'" data-col3="'+colors[2]+'" data-col4="'+colors[3]+'">'+
            '<a class="selector_link">'+
            colors_html +
            '</a>'+colorAuthor+
            '<div class="author">'+colorAuthorName+'</div>'+
          '</div>'
        );
      }
    }
  }

  // calls function to set colors for each page element
  function color_page_elements(col_1,col_2,col_3,col_4) {
    colorBadges(col_1,col_2,col_3,col_4);
    color_squares(col_1,col_2,col_3,col_4);
    color_gradients(col_1,col_2,col_3,col_4);
    set_main_selection(col_1,col_2,col_3,col_4);
  }

  function set_main_selection(col_1,col_2,col_3,col_4) {
    $('#sq1').text(col_1);
    $('#sq2').text(col_2);
    $('#sq3').text(col_3);
    $('#sq4').text(col_4);
  }


  function color_squares(col_1,col_2,col_3,col_4) {
    // set colorsquares background colors
    $('.sq1').css('background-color', col_1);
    $('.sq2').css('background-color', col_2);
    $('.sq3').css('background-color', col_3);
    $('.sq4').css('background-color', col_4);
    $('.sq1.colors_1').attr('data-color', col_1);
    $('.sq2.colors_2').attr('data-color', col_2);
    $('.sq3.colors_3').attr('data-color', col_3);
    $('.sq4.colors_4').attr('data-color', col_4);
    $('.flushright .sq3, .flushright .sq4').css('display', 'inline-block')
    $('.flushright .btn-square').css('width', '29%')
    
    if(!col_3){
      $('.flushright .sq3').css('display', 'none')
    } else {
      $('.flushright .btn-square').css('width', '25%')
    }

    if(!col_4){
      $('.flushright .sq4').css('display', 'none')
    } else {
      $('.flushright .btn-square').css('width', '24%')
    }
  }

  function color_gradients(col_1,col_2,col_3,col_4) {
    // set gradient circle colors
    $('.gc1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_2+' 95%)');

    if (!col_3) {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#fff 75%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#fff 75%)');
      $('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#000 75%)');
      $('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#000 75%)');
      $('.gc6').css('background', '#f3f1f1');
    } else if (!col_4) {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
      $('.gc3').css('background', '#f3f1f1');
      $('.gc5').css('background', '#f3f1f1');
      $('.gc6').css('background', '#f3f1f1');
    } else {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
      $('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_4+' 95%)');
      $('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,'+col_4+' 95%)');
      $('.gc6').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_4+' 95%)');
    }


    // set gradient square colors
    $('.gs1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #ffffff 90%)');
    $('.gs2').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #ffffff 90%)');
    $('.gs3').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #ffffff 90%)');
    $('.gs4').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #ffffff 90%)');

    $('.gs5').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #000000 90%)');
    $('.gs6').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #000000 90%)');
    $('.gs7').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #000000 90%)');
    $('.gs8').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #000000 90%)');

  }

  function color_gradients(col_1,col_2,col_3,col_4) {
    // set gradient circle colors
    $('.gc1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_2+' 95%)');

    if (!col_3) {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#fff 75%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#fff 75%)');
      $('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#000 75%)');
      $('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#000 75%)');
      $('.gc6').css('background', '#f3f1f1');
    } else if (!col_4) {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
      $('.gc3').css('background', '#f3f1f1');
      $('.gc5').css('background', '#f3f1f1');
      $('.gc6').css('background', '#f3f1f1');
    } else {
      $('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
      $('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
      $('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_4+' 95%)');
      $('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,'+col_4+' 95%)');
      $('.gc6').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_4+' 95%)');
    }


    // set gradient square colors
    $('.gs1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #ffffff 90%)');
    $('.gs2').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #ffffff 90%)');
    $('.gs3').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #ffffff 90%)');
    $('.gs4').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #ffffff 90%)');

    $('.gs5').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #000000 90%)');
    $('.gs6').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #000000 90%)');
    $('.gs7').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #000000 90%)');
    $('.gs8').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #000000 90%)');

  }

  function colorBadges(c1,c2,c3,c4) {
    var badges =  document.getElementsByTagName('object'); // get all Object
    var argLen = arguments.length;

    var c_def = '#f2f2f2';
    setTimeout(function(){
    $.each(badges, function(key, badge) {
      var svgdoc;
      try {
        svgdoc = badge.getSVGDocument(); // <svg>
      } catch(e) {

      }       
      // console.log($(this).attr('id'), document.getElementById($(this).attr('id')), document.getElementById($(this).attr('id')).getElementsByTagName('style'))
      if (svgdoc == undefined) { return };
      var myStyle = svgdoc.getElementsByTagName('style'); // <style> array
      var css = myStyle[0].textContent;


                               // triangles
      if(argLen == 4) {
        css = css.replace(/g2.display....../, "g2{display:none ");
        css = css.replace(/g3.display....../, "g3{display:none ");
        css = css.replace(/g4.display....../, "g4{display:block");
      }
      else if(argLen ==3) {
        css = css.replace(/g2.display....../, "g2{display:none ");
        css = css.replace(/g3.display....../, "g3{display:block");
        css = css.replace(/g4.display....../, "g4{display:none ");
      }
      else {
        css = css.replace(/g2.display....../, "g2{display:block");
        css = css.replace(/g3.display....../, "g3{display:none ");
        css = css.replace(/g4.display....../, "g4{display:none ");
      }

      css = css.replace(/st0.fill......../, "st0{fill:"+c1);
      css = css.replace(/st1.fill......../, "st1{fill:"+c2);
      if (c3) {
        css = css.replace(/st2.fill......../, "st2{fill:"+c3);
      } else {
        css = css.replace(/st2.fill......../, "st2{fill:"+c1);
      }
      if (c4) {
        css = css.replace(/st3.fill......../, "st3{fill:"+c4);
      } else {
        css = css.replace(/st3.fill......../, "st3{fill:"+c2);
      }
      myStyle[0].textContent = css;
    });
    }, 300)
  }

  body.on('click', '.color_selector',   handle_color_selector   );  // clicking a color-combination link shanges site's examples to follow
  $(window).on('resize', function() {
    window_width = $(window).width();
    
    if(window_width <= 768) {
      changeWidth();
    }
  })

})