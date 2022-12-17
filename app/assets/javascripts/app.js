
/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
  "use strict"; // Start of use strict

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: ($($anchor.attr('href')).offset().top - 50)
      }, 1250, 'easeInOutExpo');
      event.preventDefault();
  });

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 51
  })

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
      $('.navbar-toggle:visible').click();
  });

  // Fit Text Plugin for Main Header
  $("h1").fitText(
      1.2, {
          minFontSize: '35px',
          maxFontSize: '65px'
      }
  );

  // Offset for Main Navigation
  $('#mainNav').affix({
      offset: {
          top: 100
      }
  })

  // Initialize WOW.js Scrolling Animations
  new WOW().init();

})(jQuery); // End of use strict


	function get_language() {
		return $("#color_picker_label").data("language")
	}

	function get_intro_condition() {
		// mmcguire
		// reads intro-choice and adds 'no_intro' class to body, to hide intro and show colorwheel
		var body = $('body');
		if (localStorage) {
			var condition = localStorage.getItem("introCondition");
			body.addClass(condition);
		}
	}

	function set_intro_condition() {
		// mmcguire
		// saves setting in local storage
		if (localStorage) {
			localStorage.setItem("introCondition", "no_intro");
		}
	}

	// var nID;
	function scroll_intro() {
		// mmcguire
		// uses css to close intro, show scrollwheel, and activate scrolling animations
		var intro 		= $('.section.intro');
		var colorwheel	= $('.section.colorwheel');

		intro.addClass('scroll');
		colorwheel.addClass('show');
		setTimeout(function() {
			new WOW().init();
		},1000);

		// nID = setInterval(autoScroll,2000);
	}
	// function autoScroll(){
	// 	$("body").animate({ scrollTop: $(window).scrollTop() + 150 }, "slow");
	// 	if ($(window).scrollTop()+$(window).height() >= $(document).height())
	// 		clearInterval(nID);
	// }
	// function close_popup() {
	// 	var popup = $(this).closest('.popup');
	// 	if (popup.hasClass('mailing_list_popup')) {
	// 		setTimeout(function() {
	// 			popup.removeClass('show');
	// 		},500);
	// 	} else {
	// 		popup.removeClass('show');
	// 	}
	// }

	function process_email() {
		var button 		= $(this);
		var popup 		= button.closest('.popup');
		var popupContent= popup.find('.popup_content');
		var form		= popup.find('.form');
		var url			= form.attr('action');
		
		$.ajax({
			url: url,
			type:'POST',
			data:form.serialize
		}).done(function(){

		}).fail(function() {

		});
		return false;
	}


	$(document).ready(function() {
		if($("#favorites_index").length) {
			favoriteLoad()
		}

		$("#sq1, #sq2, #sq3, #sq4").click(function(){
			var el = $(this);

			var $temp = $("<input>");
			$("body").append($temp);
			$temp.val(el.text()).select();
			document.execCommand("copy");
			$temp.remove();

			el.addClass("copied")

			setTimeout(function() {
				el.removeClass("copied")
			}, 700)
		})

		// mmcguire
		var numColors = 2;
		var body = $('body');
		body.addClass('show');	// the browser needs a moment to process the page before showing body, otherwise intro flashes

		get_intro_condition();

		// old pop up code removed 
		function getSelectedColorwheels() {
			var c = {}
			if($('#selected_colorwheels > div').length === 0) {
				color_obj = {
					split: {
						colors: colorwheels["split"],
						name: { en: "Complementary", jp: "補色する" }
					},
					analogous: {
						colors: colorwheels["analogous"],
						name: { en: "Analogous", jp: "アナロジー" }
					},
					triad: {
						colors: colorwheels["triad"],
						name: { en: "Triad", jp: "トライアド" }
					},
					splitc: {
						colors: colorwheels["splitc"],
						name: { en: "Split-Complement'", jp: "補色を分ける" }
					},
					square: {
						colors: colorwheels["square"],
						name: { en: "Square", jp: "スクエア" }
					},
					fresh: {
						colors: colorwheels["fresh"],
						name: { en: "Fresh", jp: "フレッシュ" }
					},
					manga: {
						colors: colorwheels["manga"],
						name: { en: "Manga", jp: "マンガ" }
					},
					nature: {
						colors: colorwheels["nature"],
						name: { en: "Nature", jp: "ネイチャー" }
					},
					painters: {
						colors: colorwheels["painters"],
						name: { en: "Painters", jp: "ペインター" }
					},
					rich: {
						colors: colorwheels["rich"],
						name: { en: "Rich", jp: "リッチ" }
					}
				}

				if($.cookie('colorWheel')){
					var current_wheel = JSON.parse($.cookie('colorWheel')).name[get_language()];

					var filter = Object.keys(color_obj).filter(function(row) {
					  return color_obj[row].name[get_language()] === current_wheel;
					});

					var selected = filter[0]

					var removed = color_obj.selected;
					delete color_obj.selected;
					var newExtend = {[selected]:removed};
					c = $.extend(newExtend, color_obj);
				}else{
					c = color_obj
				}
			} else {
				$('#selected_colorwheels > div').each(function() {
					var id = $(this).data('id')
					var name = $(this).data('name')
					c[id] = { colors: colorwheels[id], name: name }
				})
			}

			return c
		}


		function renderColorwheel() {
			window.modules.colorwheel.drawColorChart(colors)

			$('.colortheory').hide();
			if($('#' + colorwheels_ids[colorwheels_index]).length > 0) {
				$('#' + colorwheels_ids[colorwheels_index]).show();
			} else {
				$('#default').show();
			}
			changeColor(0,0);
			favoriteLoad()
			$("#color_picker_label").text(name);
			if(['split', 'splitc', 'analogous', 'square', 'triad'].includes(colorwheels_ids[colorwheels_index])){
				$('.color_selectors').removeClass('custom')
			} else {
				$('.color_selectors').addClass('custom')
			}
			var d = 359.99 / colors.length;
			return d
		}
	
		// ADD TO FAVORITE PAGE

		$('.color_selector').on('click',function(){
			var color = $(this).attr('data-col1');
			var color2 = $(this).attr('data-col2');
			var color3 = $(this).attr('data-col3');
			var color4 = $(this).attr('data-col4');
			var colorauthor	= $(this).find('.author').html();
			color_page_elements(color,color2,color3,color4,colorauthor)
			$('.button-remove-trial').attr('data-color1', color)
			$('.button-remove-trial').attr('data-color2', color2)
			$('.button-remove-trial').attr('data-color3', color3)
			$('.button-remove-trial').attr('data-color4', color4)
		})

		function favoriteLoad(){
			if ($('.color_selector:first').length != 0) {
				var	color = $('.color_selector:first').attr('data-col1'),
						color2 = $('.color_selector:first').attr('data-col2'),
						color3 = $('.color_selector:first').attr('data-col3'),
						color4 = $('.color_selector:first').attr('data-col4'),
						col_autor	= $('.color_selector:first').find('.author').html();
				setTimeout(function(){
					color_page_elements(color,color2,color3,color4,col_autor)
					$('.button-remove-trial').attr('data-color1', color)
					$('.button-remove-trial').attr('data-color2', color2)
					$('.button-remove-trial').attr('data-color3', color3)
					$('.button-remove-trial').attr('data-color4', color4)
				}, 300)
			}
			else{
				var col_badges = "#f3f2f2",
				 		col_badges2 = "#e5e5e5",
				 		col_badges3 = "#dbd9d9",
			 			col_badges4 = "#e5e5e5",
			 			col_author = "#dbd9d9";

			 	var col_squares = "#e5e5e5",
			 			col_squares2 = "#e5e5e5",
			 			col_squares3 = "#e5e5e5",
			 			col_squares4 = "#e5e5e5";

			 	var col_set = "",
			 			col_set2 = "",
			 			col_set3 = "",
			 			col_set4 = "",
			 			col_setauthor = "";


				colorBadges(col_badges,col_badges2,col_badges3,col_badges4,col_author);
				set_main_selection(col_set,col_set2,col_set3,col_set4, col_setauthor);
				color_squares(col_squares,col_squares2,col_squares3,col_squares4);
				color_gradients(color,color2,color3,color4);
				changeWidth(color,color2,color3,color4);
			}
		}

		$('.button-remove').click(function(){
			setTimeout(function(){
				location.reload()
			},500)
		})

		/*$('.favorite').click(function(){
			location.reload()
		})
		*/
		//
		//
		//
		// COLORWHEEL-STARTS
		//
		//
		//

		if($('#main_app').length == 0 && $('#hex_match_app').length == 0) return false
  
		var rotation = Snap.select('#rotate');
		var drag = false;
		var new_angle = 0;
		var cx_cy = 218;
		var myStep = 0;
				
		var bigCircle = Snap.select('#bigcircle');
		var isDragging = false;
		
		var colorwheels_index = 0
		var selected_colorwheels = getSelectedColorwheels()
		var colorwheels_ids = Object.keys(selected_colorwheels)
		var zeroPoint;
		var zeroPointBefore;
		
		if($('#main_app').length) {
			selected_colorwheel = selected_colorwheels[colorwheels_ids[colorwheels_index]]
			colors = selected_colorwheel.colors
			name
			if (selected_colorwheel.name[get_language()]) name = selected_colorwheel.name[get_language()];
			else name = selected_colorwheel.name;
			delta = renderColorwheel(colors, name)
			zeroPoint = (360 - (delta/2))
			zeroPointBefore = (zeroPoint - (delta/2))
		}

		colorWheelChange = function(colorwheels_i){
			if($('#main_app').length) {
				
				colorwheels_i
				if(colorwheels_index > colorwheels_ids.length - 1) { colorwheels_index = 0 }
				if(colorwheels_index < 0) { colorwheels_index = colorwheels_ids.length - 1 }

				selected_colorwheel = selected_colorwheels[colorwheels_ids[colorwheels_index]]

				$.cookie('colorWheel', JSON.stringify(selected_colorwheel))

				colors = selected_colorwheel.colors
				name
				if (selected_colorwheel.name[get_language()]) name = selected_colorwheel.name[get_language()];
				else name = selected_colorwheel.name;		
				$('#svg_layout').animate({transform: 'scale(0.95)'}, 80, function() { 
					delta = renderColorwheel(colors, name)
					$('#svg_layout').animate({transform: 'scale(1)'}, 80) 
					rotation.transform("r"+0);
				} )
			}
		}

		var arr_index = -2;
		
		colorSelector = function(e, key){
			var selector	= $('.color_selector');
			var selectors = selector.closest('.color_selectors');
			var col_1;
			var col_2;
			var col_3;
			var col_4;
			var colorauthor;

			//preventing browser scroll 
	  		e.preventDefault();

			//indexing 
			if(key == "up"){
				switch(arr_index){
					case -2:
						arr_index = 21;
						break;
					case 1:
						arr_index = 20;
						break;
					case 0:
						arr_index = 21;
						break;
				}
	  		arr_index -= 2
			}else if (key == "down"){
				switch(arr_index){
					case 18:
						arr_index = -1;
						break;
					case 19:
						arr_index = -2;
						break;
				}
				arr_index += 2;
			}

			//color selector 
			var select = $('.color_selector:eq('+ arr_index +')');

			selector.addClass('fadeout');
			selector.css('transform', 'scale(1)');
			select.removeClass('fadeout');
			select.css('transform', 'scale(1.15)')
			selectors.find('.color_selector').not(selector).addClass('fadeout');
			col_1	= select.attr('data-col1');
			col_2	= select.attr('data-col2');
			col_3	= select.attr('data-col3');
			col_4	= select.attr('data-col4');
			colorauthor	= select.find('.author').html();
		
			//run function 
			color_page_elements(col_1,col_2,col_3,col_4,colorauthor);
		}		

		//switch color wheel by clicking left/right arrow 
		$(document).on('click', '.color_set_controls__trigger', function(el) {
			$(this).hasClass('right') ? colorWheelChange(colorwheels_index++) : colorWheelChange(colorwheels_index--)
		})
		
		var click;
		// $.cookie('modalusage',click)
		var get_cookie;
		if ($.cookie('modalusage')) {
			get_cookie = parseInt($.cookie('modalusage'))
			click = parseInt($.cookie('modalusage'))
		}else{
			$.cookie('modalusage', 0)
			get_cookie = 0;
			click = 0;
		}

		$(document).keydown(function(e){
			switch(e.which) {
			  case 37:
			  	//left key pressed 
	       	colorWheelChange(colorwheels_index--)
        	$('.modal-tip').fadeOut('fast');
			    break;
			  case 39:
			  	//right key pressed 
	       	colorWheelChange(colorwheels_index++)
        	$('.modal-tip').fadeOut('fast');
			    break;
			  case 38:
			  	//up key pressed 
			  	click++;
      		$.cookie('modalusage', click)
        	colorSelector(e, "up")
        	$('.modal-tip').fadeOut('fast');
			    break;
			  case 40:
			  	//down key pressed 
			  	click++;
      		$.cookie('modalusage', click)
        	colorSelector(e, "down")
        	$('.modal-tip').fadeOut('fast');
			    break;
			  default:
			  	return;
			}
		});

		var isTouchDevice = 'ontouchstart' in document.documentElement;

 		if(isTouchDevice){
            if (bigCircle) {
				bigCircle.touchstart(function(ev) {
					ev.preventDefault();			
					isDragging = true;
					drag = Snap.angle(cx_cy,cx_cy, ev.touches[0].clientX, ev.touches[0].clientY);

					var mySelect = $('#color_picker_label').text();
					new_angle = (mySelect === "Analogous") ? 210 : 90;
					var delta = parseInt(drag - new_angle);
					var move_angle = parseInt(delta + 360 ) % 360;
					// move_angle = (mySelect === "analogous") ? move_angle - 105 : move_angle;
					mAngle = move_angle;			
					var step = stepsAngle(move_angle);
					if (myStep != step) { // new segment, update color
						myStep = step;
						changeColor(move_angle, step);
					}

					rotation.transform("r"+move_angle);
				});

				bigCircle.touchmove(function(ev) {
					if (isDragging && drag != false) {
						var angle = Snap.angle(cx_cy,cx_cy, ev.touches[0].clientX, ev.touches[0].clientY);
						var delta = parseInt(angle - new_angle);
						var move_angle = parseInt(delta + 360 ) % 360;
						mAngle = move_angle;
						rotation.transform("r"+move_angle);
						var step = stepsAngle(move_angle);
						if (myStep != step) { // new segment, update color
							myStep = step;
							changeColor(move_angle, step);
						}
					}
				});

				bigCircle.touchend(function(ev) {
					isDragging = false;
					//var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
					//new_angle = parseInt((new_angle + angle -drag + 360) % 360);

					setTimeout(function(){
						move_angle = myStep*delta+1;
						rotation.transform("r"+move_angle);
					}, 100);
					setTimeout(function(){
						move_angle = myStep*delta-1;
						rotation.transform("r"+move_angle);
					}, 200);
					setTimeout(function(){
						move_angle = myStep*delta+1;
						rotation.transform("r"+move_angle);
					}, 300);
					setTimeout(function(){
						move_angle = myStep*delta;
						rotation.transform("r"+move_angle);
					}, 400);
				});
			}
 		}else{
            if (bigCircle) {
				bigCircle.mousedown(function(ev) {
					ev.preventDefault();			
					isDragging = true;
					drag = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);

					var mySelect = $('#color_picker_label').text();
					new_angle = (mySelect === "Analogous") ? 210 : 90;
					var delta = parseInt(drag - new_angle);
					var move_angle = parseInt(delta + 360 ) % 360;
					// move_angle = (mySelect === "analogous") ? move_angle - 105 : move_angle;
					mAngle = move_angle;	
					var step = stepsAngle(move_angle);
					if (myStep != step) { // new segment, update color
						myStep = step;
						changeColor(move_angle, step);
					}
					rotation.transform("r"+move_angle);
				})
				.mousemove(function(ev) {
					if (isDragging && drag != false) {
						var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
						var delta = parseInt(angle - new_angle);
						var move_angle = parseInt(delta + 360 ) % 360;
						mAngle = move_angle;
						rotation.transform("r"+move_angle);
						var step = stepsAngle(move_angle);
						if (myStep != step) { // new segment, update color
							myStep = step;
							changeColor(move_angle, step);
						}
					}
				})
				.mouseup(function(ev) {
					isDragging = false;
					//var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
					//new_angle = parseInt((new_angle + angle -drag + 360) % 360);

					setTimeout(function(){
						move_angle = myStep*delta+1;
						rotation.transform("r"+move_angle);
					}, 100);
					setTimeout(function(){
						move_angle = myStep*delta-1;
						rotation.transform("r"+move_angle);
					}, 200);
					setTimeout(function(){
						move_angle = myStep*delta+1;
						rotation.transform("r"+move_angle);
					}, 300);
					setTimeout(function(){
						move_angle = myStep*delta;
						rotation.transform("r"+move_angle);
					}, 400);

					// drag = false;
					// new_angle = myStep*delta;

					// var color_len = 10;
					// var colID = 'w_step'+myStep;
					// var myShape = colorwheels_ids[colorwheels_index];
					// switch (myShape) {
					// 	case ("split"):
					// 		color_len = split[colID].length;
					// 	break;
					// 	case ("splitc"):
					// 		color_len = splitc[colID].length;
					// 	break;
					// 	case ("analogous"):
					// 		color_len = analogous[colID].length;
					// 	break;
					// 	case ("triad"):
					// 		color_len = triad[colID].length;
					// 	break;
					// 	case ("square"):
					// 		color_len = square[colID].length;
					// 	break;
					// 	default: 
					// 		color_len = square[colID].length;
					// }

				})
				.mouseout(function(ev){
					isDragging = false;
				});
			}
 		}


		

		// make radio buttons interactive
		// $('.radio-primary').on('click', function(ev) {
		// 	var radio = $(this).find('input');
		// 	var mySelect = $('input[name=optionsColor]:checked').val();
		// 	numColors = radio.attr('data-numcolors');
		// 	new_angle = 0;
		// 	rotation.transform("r"+new_angle);
		// 	$('.colortheory').hide();
		// 	$('#'+mySelect).show();
		// 	changeColor(new_angle);
		// });

		function stepsAngle(degree) {
			degree = parseInt((degree + 360) % 360);
			if (degree > parseInt(zeroPoint)) { return 0 }; // step0 angle is from 346-359, 0-15 degree
			var step = 0;
			// NB
			for (var i = 15; i < degree; i += delta) {
				var j = 15;
				step++;
			}
			return step;
		}


		//
		//
		//
		// COLORWHEEL-ENDS
		//
		//
		//


		// sets 'hover' effect class to manage other links when 'this' link is hovered-on
		function handle_color_selector_hover() {
			var selector	= $(this);
			var selectors 	= selector.closest('.color_selectors');
			selector.removeClass('fadeout');
			arr_index = selector.index();
			selectors.find('.color_selector').not(selector).addClass('fadeout');
			selectors.find('.color_selector').not(selector).css('transform', 'scale(1)');
			selector.css('transform', 'scale(1.15)');
		}
		function handle_color_selector_unhover() {
			var selector	= $(this);
			var selectors 	= selector.closest('.color_selectors');
			selectors.find('.color_selector').removeClass('fadeout');
			selector.css('transform', 'scale(1)');
		}


		function handle_color_selector() {
			var col_1		= $(this).attr('data-col1');
			var col_2		= $(this).attr('data-col2');
			var col_3		= $(this).attr('data-col3');
			var col_4		= $(this).attr('data-col4');
			var colorauthor	= $(this).find('.author').html();

			color_page_elements(col_1,col_2,col_3,col_4,colorauthor);
			$('.bottom_sq').removeClass('hide')
			
			return false;
		}



		/*	---------------------------------------------------------------------------------
										COLORCHANGE FUNCTION
			---------------------------------------------------------------------------------*/
		function changeColor(degree, step) {
			// originally using a 20-step slider (0-19) for color heues, replaced with a 20-count loop or uses passed value from clicking on selector-link.
			$('.color_selectors').empty();
			arr_index = -2;

			for (var colorLoop = 0; colorLoop<20; colorLoop++) {
				// sets the number of colors as a class name on .colorwheel to style/hide elements for a greater number of colors */
				var colorwheel = $('#colorwheel');
				colorwheel.removeClass('colors_2 colors_3 colors_4');
				colorwheel.addClass('colors_'+numColors);
				
				step = step || stepsAngle(degree);
				var myHex = "c10"; // default
				//var Slider = parseInt(verticalSlider.noUiSlider.get())-1;
				var Slider = colorLoop;
				shape = colorwheels_ids[colorwheels_index];
				var max_step = Object.keys(colorsets[shape]).length
				var colID = 'w_step'+((step == max_step ? step-1 : step));

				var colors = [];
				if(!colorsets[shape][colID][Slider]) return false
				colors[0] = colorsets[shape][colID][Slider][0];
				colors[1] = colorsets[shape][colID][Slider][1];
				colors[2] = colorsets[shape][colID][Slider][2] || "";
				colors[3] = colorsets[shape][colID][Slider][3] || "";				
				color_len = colorsets[shape][colID][Slider].length;
				
				if (colorLoop == 0) {	// 9 = center of 0-19 range
					var t = colorauthor[shape] && colorauthor[shape][colID] ? colorauthor[shape][colID][Slider] : ''
					color_page_elements(colors[0],colors[1],colors[2],colors[3], t);
				}
				if (colorLoop <20) {
					if (colorauthor[shape] && colorauthor[shape][colID] && colorauthor[shape][colID][colorLoop]) {
						var colorAuthor = '<span class="author_dot"><span class="dot"></span></span>';
						var colorAuthorName = colorauthor[shape][colID][colorLoop]
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

		function changeColor2(color, percent) {
			var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
			return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
		}


		// calls function to set colors for each page element
		function color_page_elements(col_1,col_2,col_3,col_4, colorauthor) {
			colorBadges(col_1,col_2,col_3,col_4);
			color_squares(col_1,col_2,col_3,col_4);
			color_gradients(col_1,col_2,col_3,col_4);
			set_main_selection(col_1,col_2,col_3,col_4, colorauthor);
			changeWidth(col_1,col_2,col_3,col_4);
		}

		function set_main_selection(col_1,col_2,col_3,col_4, colorauthor) {
			$('#sq1').text(col_1);
			$('#sq2').text(col_2);
			$('#sq3').text(col_3);
			$('#sq4').text(col_4);
			$('#designer').html(colorauthor);
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
			$('.color_sqg #designer').css('width', '58%')
			
			if(!col_3){
				$('.flushright .sq3').css('display', 'none')
				$('.bottom-square.colors_3').addClass('hide')
			} else {
				$('.flushright .btn-square').css('width', '25%')
				$('.color_sqg #designer').css('width', '75%')
				$('.bottom-square.colors_3').removeClass('hide')
			}

			if(!col_4){
				$('.flushright .sq4').css('display', 'none')
				$('.bottom-square.colors_4').addClass('hide')
			} else {
				$('.flushright .btn-square').css('width', '24%')
				$('.color_sqg #designer').css('width', '100%')
				$('.bottom-square.colors_4').removeClass('hide')
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

			if (!col_3) {
				$('.gs3').css('background', '#f3f1f1');
				$('.gs4').css('background', '#f3f1f1');
				$('.gs7').css('background', '#f3f1f1');
				$('.gs8').css('background', '#f3f1f1');
			} else if (!col_4) {
				$('.gs4').css('background', '#f3f1f1');
				$('.gs8').css('background', '#f3f1f1');
			}

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
				if (svgdoc == undefined) { return };
				var myStyle = svgdoc.getElementsByTagName('style'); // <style> array
				var element = svgdoc.getElementById("triangles_group"); // get Triangle badge
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
					if (element) {
						css = css.replace(/st2.fill......../, "st2{fill:"+c1);
					}else {
						css = css.replace(/st2.fill......../, "st2{fill:"+c2);
					}
				}
				if (c4) {
					css = css.replace(/st3.fill......../, "st3{fill:"+c4);
				} else {
					css = css.replace(/st3.fill......../, "st3{fill:"+c2);
				}
				myStyle[0].textContent = css;
				$('.load_fading').css('opacity', 1)
			});
			}, 0)
		}

		function changeWidth(col_1, col_2, col_3, col_4) {
			window_width = $(window).width();

			if(window_width >= 301 && window_width <= 768) {
				$('.flushright .btn-square').css('width', '24%')

				if(!col_3){
					$('.flushright .sq3').css('display', 'none')
				}

				if(!col_4){
					$('.flushright .sq4').css('display', 'none')
				}
			}else if(window_width <= 300) {
				$('.flushright .btn-square').css('width', '23%')

				if(!col_3){
					$('.flushright .sq3').css('display', 'none')
				}

				if(!col_4){
					$('.flushright .sq4').css('display', 'none')
				}
			}
		}

		/* -----------------------------------------------------------
							EVENT HANDLERS
			----------------------------------------------------------*/
		body.on('click', '.section_close', 		scroll_intro 				);	// closes intro with either button click
		body.on('click', '.set_condition', 		set_intro_condition 		);	// sets 'don't show intro'
		// body.on('click', '.close_popup', 		close_popup					);	// close the nearest popup

		body.on('click', '.color_selector', 	handle_color_selector		);	// clicking a color-combination link shanges site's examples to follow
		body.on('mouseover', '.color_selector',	handle_color_selector_hover	);	// minor function to handle other link's opacity (css-only solution was flakey)
		body.on('mouseout', '.color_selector',	handle_color_selector_unhover);	// minor function to handle other link's opacity (css-only solution was flakey)
		$(document).ready(function() {
			window_width = $(window).width();
			
			if(window_width <= 768) {
				changeWidth();
			}
		})
	});
	
	function setCookie(cname,cvalue,exdays) {
	  var d = new Date();
	  d.setTime(d.getTime() + (exdays*24*60*60*1000));
	  var expires = "expires=" + d.toGMTString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i < ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}

	function checkCookieAlert() {
	  var popupalert = getCookie("popupalert");
	  if (popupalert != false) {
	  	return;
	  } else {
	     setCookie("popupalert", "true", 1);
	     if (popupalert != "" && popupalert != null) {
	       	setCookie("popupalert", "true", 1);
	     }
	  }
	}	

	function checkCookieTips(){
		var popuptips = getCookie("popuptips");
	  if (popuptips != false) {
	  	return;
	  } else {
	     setCookie("popuptips", "true", 1);
	     if (popuptips != "" && popuptips != null) {
	       	setCookie("popuptips", "true", 1);
	     }
	  }
	}

	$(document).ready(function() {
	 	var click = 0;
	 	$(".color_set_controls__trigger").on("click", function(){
  		click++;
  		if (click == 7) {
	  		$.ajax({
	        type: "GET",
	        dataType:"json",
	        url: "/main/click_modal",
	        success: function(result){
	          if (result == true) {
	          	$('.modal-tip').removeClass('hidden-tip')
	          	$('.modal-tip').fadeIn('slow');
	          	setCookie("popuptips", "false", 1);
	          }
	        }
	     });
  		}
  	});
	});
	
	checkCookieAlert()
	checkCookieTips();

// Show Hide Password

	$(document).ready(function(){
		var x = $("#password");
		$('.form_icon').click(function(){
		  if (x.attr('type') == "password") {
		    $(x).attr('type','text')
		  }
		   else {
		    $(x).attr('type','password')
		  }

		  $('.form_icon').toggle();
		})	
	})

	// VIDEO EMBED 
	$(document).on('click','.js-videoPoster',function(e) {
	  e.preventDefault();
	  var poster = $(this);
	  var wrapper = poster.closest('.js-videoWrapper');
	  videoPlay(wrapper);
	});
	function videoPlay(wrapper) {	
	  var iframe = wrapper.find('.js-videoIframe');
	  var src = iframe.data('src');
	  wrapper.addClass('videoWrapperActive');
	  iframe.attr('src',src);
	}

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api?";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'cYd5X7Dk8GI',
      playerVars: { 
        'controls': 0 
  		},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
		$('iframe#player').attr('allow','accelerometer; encrypted-media; gyroscope; picture-in-picture')
  }
  function onPlayerReady(event) {
  	$('.video_wrapper').click(function(){
   	 	event.target.playVideo();
  	})
  }

  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo,35000);
      done = true;
    }
  }
  function stopVideo() {
    player.stopVideo();
  }


  // END VIDEO EMBED

	/*
						RESET LOCALSTORAGE FOR INTRO CONDITION TESTING	-- mmcguire
						remove or comment-out for production
	$(function() {
		var body = $('body');
		var resetButton = '<button class="reset_intro" style="position: absolute; top: 1vh; right: 1vw; z-index: 100;" type="button">reset intro condition</button>';
		body.append(resetButton);
		body.on('click', '.reset_intro', function() {localStorage.setItem("introCondition", ""); location.reload();})
	});
	*/