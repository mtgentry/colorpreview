$(document).ready(function() {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function findClosestColor(selected_color) {
        $('.color_selectors').empty()

        var diff = require('./color-diff');
    
        var color = {};
        color["r"] = hexToRgb(selected_color).r;
        color["g"] = hexToRgb(selected_color).g;
        color["b"] = hexToRgb(selected_color).b;
    
        var all_colors = []
        var results_HEX = [];
        var available_color = []
        var final_result = [];

        Object.entries(window.colors).forEach(palette => {
            Object.entries(palette[1]).forEach(step => {
                step[1].forEach(colors => {
                    all_colors.push({
                        R: hexToRgb(colors[0]).r,
                        G: hexToRgb(colors[0]).g,
                        B: hexToRgb(colors[0]).b
                    })
                })
            })
        })

        var results = diff.closest_wider(color, all_colors);
            
        results.reverse().forEach(result => {
            results_HEX.push(rgbToHex(result["R"], result["G"], result["B"]).toUpperCase())
        })

        Object.entries(window.colors).forEach(palette => {
            var color_palettes = [];

            Object.entries(palette[1]).forEach((step, index) => {
                step[1].forEach(colors => {
                    if (results_HEX.slice(0,20).includes(colors[0])) {
                        color_palettes.push(colors)
                    }
                })
            })

            if(color_palettes.length) {
                available_color.push(color_palettes)
            }
        })

        available_color.forEach((color_set, index) => {
            color_set.forEach(color => {
                final_result.push(color)
            })
        })

        final_result.slice(0,20).forEach(colors_set => {
            var colors_html = ''
            colors_set.forEach((color, index) => {
                if (index < 4) {
                    colors_html += '<span class="cs colors_'+ (index + 1) +'" style="background:'+color+'" ></span>'
                }
            })

            var color1 = colors_set[0],
                color2 = colors_set[1],
                color3 = colors_set[2] || "",
                color4 = colors_set[3] || "";

            $('.color_selectors').append(
                '<div class="color_selector" data-col1="'+color1+'" data-col2="'+color2+'" data-col3="'+color3+'" data-col4="'+color4+'">'+
                    '<a class="selector_link">'+
                        colors_html +
                    '</a>'+
                '</div>'
            );
        })
    }

    if($('#hex_match_app').length) {
        $('.hex_color_picker__color').click(function() {
            var color = $(this).data('color')

            $('.hex_input').val(color)

            if(color) {
                findClosestColor(color)
    
                if (color[0] !== "#") {
                    color = "#" + color
                }

                $('.circle-backdrop').attr('fill', color)
                $('.hex_input').removeClass('hex_error');
                $('.hex_message').hide();
                $('.hex_submit').prop('disabled', false)
            } else {
                $('.hex_input').addClass('hex_error');
                $('.hex_message').show();
            }
        })

        $('.color_picker_toggler').click(function(){
            $('.hex_input').removeClass('hex_error');
            $('.hex_message').hide();
            if ($('.hex_color_picker').hasClass('hex_color_picker--show')) {
                setTimeout(function(){
                    $('.hex_color_picker').removeClass('hex_color_picker--show');
                }, 150)
            } else {
                $('.hex_color_picker').addClass('hex_color_picker--show');
            }
        })

        $(document).click(function(e) {
            var container = $(".hex_color_picker");
            var toggler = $(".color_picker_toggler");
            var selector = $(".color_selectors");

            if (!container.is(e.target) && container.has(e.target).length === 0 &&
                !toggler.is(e.target) && toggler.has(e.target).length === 0 &&
                !selector.is(e.target) && selector.has(e.target).length === 0
            ) {
                $('.hex_color_picker').removeClass('hex_color_picker--show');
            }
        });

        $('.hex_input').keyup(function(){
            var color = $(this).val();

            if(color[0] == "#") {
                color = color.substring(1)
                $(this).val(color)
            }
            
            if(color.length >= 6) {
                findClosestColor(color)
                $('.circle-backdrop').attr('fill', '#' + color)
            }


            // if ($(this).val().length >= 6) {
            //     $('.hex_submit').prop('disabled', false)
            // } else {
            //     $('.hex_submit').prop('disabled', true)
            // }
        })

        $('.hex_input').on("paste", function(){
            setTimeout(function(){
                var color = $('.hex_input').val();
    
                if(color[0] == "#") {
                    color = color.substring(1)
                    $('.hex_input').val(color)
                }

                if(color.length >= 6) {
                    findClosestColor(color)
                    $('.circle-backdrop').attr('fill', '#' + color)
                }
            },100)
        })

        // $('.hex_submit').click(function(){
        //     var color = $('.hex_input').val()
            
        //     if(color) {
        //         findClosestColor(color)
    
        //         if (color[0] !== "#") {
        //             color = "#" + color
        //         }

        //         $('.circle-backdrop').attr('fill', color)
        //         $('.hex_input').removeClass('hex_error');
        //         $('.hex_message').hide();
        //     } else {
        //         $('.hex_input').addClass('hex_error');
        //         $('.hex_message').show();
        //     }
        // })
    }

    $(function() {
      $(window).scroll(function(e) {
        if ($(this).scrollTop() > 400) {
          $(".sidenav_color_combinations").addClass('sidenav_in').removeClass('sidenav_out');
        }
        else {
          $(".sidenav_color_combinations").removeClass("sidenav_in").addClass("sidenav_out"); 
        }
    });
  });
})