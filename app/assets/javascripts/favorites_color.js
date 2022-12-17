$(document).ready(function(){
	function createShareableLink() {
		$.ajax({
			type: "POST",
			dataType:"json",
			data: {},
			url: "/shared_favorites",
			success: function(data){
				// SET VALUE LINK
				$("input.link-form").val(window.location.origin +'/s/' + data.link);
				// TOGGLE CHECKBOX AND LINK FORM
				$('.form_link').fadeToggle('fast');
				$('.checkbox_color').fadeToggle('fast');
				$('.select_color_button').fadeToggle('fast');
				// SET SHAREDFAVORITE ID
				$('.checkbox_color input').each(function(){
					$(this).attr('data-shared-favorite-id', data.id)
				});
				$('.button-select').each(function(){
					$(this).attr('data-shared-favorite-id', data.id)
				})
			}
		});
	};

	function sharedFavoritesCreate(favorite_ids){
		$.ajax({
			type: "GET",
			dataType:"json",
			data: {
				favorite_ids: favorite_ids
			},
			url: "/shared_favorites/create_fav",
			success: function(response){
				var link = response.link
				$('input.link-form').val(window.location.origin +'/s/' + link);
			}
		});
	}

	// var color_fav;
	// var before = [null, null, null, null];

	// if($.cookie('favorites')){
	// 	color_fav = JSON.parse($.cookie('favorites'));
	// }else{
	// 	color_fav = [{
	// 		id: 1,
	// 		colors: ["#f74703", "#e9eb2e", "#50b490", "#2e5ec0"]
	// 	}, null, null, null, null, null, null, null, null, null];

	// }
	// var color_favorites = JSON.stringify(color_fav)
	// $.cookie('favorites', color_favorites)

	// $('.favorite-trial').click(function(){
	// 	if(color_fav.includes(null) == true){
	// 		var color_1 = $('.btn-square.colors_1').attr('data-color'),
	// 				color_2 = $('.btn-square.colors_2').attr('data-color'),
	// 				color_3 = $('.btn-square.colors_3').attr('data-color'),
	// 				color_4 = $('.btn-square.colors_4').attr('data-color');

	// 		var color = []
	// 		if (color_1) {
	// 			color.push(color_1)
	// 		}
	// 		if(color_2){
	// 			color.push(color_2)
				
	// 		}
	// 		if(color_3){
	// 			color.push(color_3)
				
	// 		}
	// 		if(color_4){
	// 			color.push(color_4)
				
	// 		}

	// 		var i = color_fav.indexOf(null)
	// 			color_fav.unshift({
	// 					id: i + 1,
	// 					colors: color	
	// 				})
	// 				color_fav.splice(-1)
	// 		// console.log(color_fav)
	// 		// var color_favorites = JSON.stringify(color_fav)

	// 		// $.cookie('favorites', color_favorites)
	// 		// check color is already exist
	// 		var favorites = JSON.parse($.cookie('favorites'));
	// 		var color_favorites = JSON.stringify(color_fav)
	// 		var status = []

	// 		for(i=0;i<favorites.length;++i){
	// 			if(favorites[i] != null){
	// 				if(JSON.stringify(color) == JSON.stringify(favorites[i].colors)){
	// 					status.push(true)
	// 				}else{
	// 					status.push(null)
	// 				}
	// 			}else{
	// 				status.push(null)
	// 			}
	// 		}

	// 		if(status.indexOf(true) == -1){
	// 			$.cookie('favorites', color_favorites)
	// 		}else{
	// 			console.log('color already be favorited')
	// 		}
		
	// 	}

	// 	else{
	// 		console.log('Favorites color full')
	// 	}
	
	// })

	// $('.selector_badge').click(function(){
	// 	var getid = $(this).attr('data-position')
	// 	$(this).index(getid)
	// 	$('.button-remove-trial').attr('data-position',getid)
	// })
	
	// var getid = $('.color_selector:first').parent().data('position')
	// $('.button-remove-trial').attr('data-position',getid)

	// $('.button-remove-trial').click(function(){

	// 	var color1 = $(this).attr('data-color1')
	// 	var color2 = $(this).attr('data-color2')
	// 	var color3 = $(this).attr('data-color3')
	// 	var color4 = $(this).attr('data-color4')
	// 	var color_remove = [color1 ,color2 ,color3 ,color4]
	// 	var arr_remove = parseInt($(this).attr('data-position') -1)
	// 	color_fav.splice(arr_remove,1);
	// 	color_fav.push(null)	

	// 	var color_update = JSON.stringify(color_fav)
	// 	$.cookie('favorites', color_update)

	// 	setTimeout(function(){
	// 		location.reload()
	// 	},500)
	// })

	$('.icon_link').click(function(){
		$('.form_link_container').addClass('pad');
		$(this).toggleClass('active')
		setTimeout(function() {
			createShareableLink();
		},500)
		if (!$('.title_fav img#link').hasClass('active')) {
			setTimeout(function(){
				$('.form_link_container').removeClass('pad');
			},1100)
		}
	})


	$('.btn-copy').click(function(){
		var copyText = $("input.link-form");
		copyText.select();
		document.execCommand("copy");
	})

	$('.select_color_button').click(function(){
		$('.button-select').toggleClass('hide');
	})

	$('#custom_title').blur(function() {
		$.ajax({
			type: "GET",
			dataType:"json",
			data: {
				shared_link: {
					title: $(this).val(),
					link: $(this).attr('data-shared-link')
				}
			},
			url: '/s/update_title',
			success: function(response){
			}
		})
	})

	// CREATE SHARED FAVORITES
	$('button.select').click(function(){
		$('.checkbox_color input').prop('checked',true)

		fav_ids = $('.checkbox_color input:checkbox').map(function(){
			$(this).addClass('checked')
			return $(this).attr('data-favorite-id')
		}).get();

		sharedFavoritesCreate(fav_ids)
	})

	$('button.deselect').click(function(){
		$('.checkbox_color input').prop('checked',false)
		
		$('.checkbox_color input:checkbox').map(function(){
			$(this).removeClass('checked')
		})

		fav_ids = []
		sharedFavoritesCreate(fav_ids)
	})

	$('.checkbox_color input').on('change', function(){
		var favorite_id = $(this).data('favorite-id');
		var checked = this.checked

		if (checked) {
			$(this).addClass('checked')
		}else{
			$(this).removeClass('checked')
		}

		if($('input:checkbox.checked').size() == $('input:checkbox').size()){
			$('button.deselect').removeClass('hide')
			$('button.select').addClass('hide')
		}else{
			$('button.deselect').addClass('hide')
			$('button.select').removeClass('hide')
		}

		// get all color
		fav_ids = $('input:checkbox.checked').map(function(){
			return $(this).attr('data-favorite-id')
		}).get();
		
		sharedFavoritesCreate(fav_ids)
	})

	// var color_favorites = JSON.stringify(color_fav)
	// $.cookie('favorites', color_favorites)

	//Resize width input
	$(function(){
	  $('#hide_text').text($('#custom_title').val());
	  $('#custom_title').width($('#hide_text').width());
	})
	.on('input', function () {
	  $('#hide_text').text($('#custom_title').val());
	  $('#custom_title').width($('#hide_text').width());
	});


	//tooltip
	$('#custom_title').mouseenter(function() {
		$('.tooltip').fadeIn()
	});

	$('#custom_title').mouseleave(function() {
		$('.tooltip').fadeOut()
	});

	//Custom title
	if ($('input#custom_title').hasClass('free')) {
		$('#custom_title').keyup(function(){
			var gtval = $('#custom_title').val()
			$.cookie('favTitle',gtval)
		})
	}

})