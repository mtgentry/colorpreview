$(document).ready(function(){
	if($('#main_random-color-generator').length == 0) return false

	var	step 	= Math.floor(Math.random() * Math.floor(12)),
			slide = Math.floor(Math.random() * Math.floor(20));
	
	changeColor(step, slide)

	$('#randomizer').click(function(){
		step = Math.floor(Math.random() * Math.floor(12))
		slide = Math.floor(Math.random() * Math.floor(20))
		changeColor(step, slide)
	})

	function changeColor(step, slide){
		// sets the number of colors as a class name on .colorwheel to style/hide elements for a greater number of colors */
		var colors = [];
		colors[0] = colorsets["triad"]["w_step" + step][slide][0];
		colors[1] = colorsets["triad"]["w_step" + step][slide][1];
		colors[2] = colorsets["triad"]["w_step" + step][slide][2] || "";
		colors[3] = colorsets["triad"]["w_step" + step][slide][3] || "";				
		color_len = colorsets["triad"]["w_step" + step][slide].length;

		color_page_elements(colors[0],colors[1],colors[2],colors[3]);
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

})