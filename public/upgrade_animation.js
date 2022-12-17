
(function($) {
	'use strict';
	
	/*===================================*
	01.LOADING JS
	/*===================================*/
	$(window).on('load',function(){
		var preLoder = $(".preloader");
		preLoder.delay(700).fadeOut(500);
	});


	/*===================================*
	03.START MENU JS
	*===================================*/
	
	var anima;
    var anim1 = document.getElementById('bodymovina')
    var animation = {
        container: anim1,
        renderer: 'svg',
        loop: false,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
        progressiveLoad: false},
        path: 'dataa.json',
        name: 'myAnimation',
    };
    anima = lottie.loadAnimation(animation);


    // SCROLLING DOWN
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovina'),
     handler: function(direction) {
       if (direction === 'down') {
         anima.goToAndPlay(1, true);
       }
     },
       offset: '40%'
    })

    // SCROLLING DOWN
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovina'),
     handler: function(direction) {
       if (direction === 'down') {
         // $('#lottie').css('opacity', 0); // for making animation invisible after scrolling past 30% of original vh
       }
     },
       offset: '-30%'
    })

    // SCROLLING UP
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovina'),
     handler: function(direction) {
       if (direction === 'up') {
         // $('#lottie').css('opacity', 1); // fpr making animation visible again triggered at 5% of vh from the top
         anima.goToAndPlay(1, true);
       }
     },
       offset: '5%'
    })
	
	
	
	





	var animc;
    var anim3 = document.getElementById('bodymovinc')
    var animation = {
        container: anim3,
        renderer: 'svg',
        loop: false,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
        progressiveLoad: false},
        path: 'datac.json',
        name: 'myAnimation',
    };
    animc = lottie.loadAnimation(animation);


    // SCROLLING DOWN
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovinc'),
     handler: function(direction) {
       if (direction === 'down') {
         animc.goToAndPlay(1, true);
       }
     },
       offset: '70%'
    })

    // SCROLLING DOWN
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovinc'),
     handler: function(direction) {
       if (direction === 'down') {
         // $('#lottie').css('opacity', 0); // for making animation invisible after scrolling past 30% of original vh
       }
     },
       offset: '-30%'
    })

    // SCROLLING UP
    var waypoint = new Waypoint({
     element: document.getElementById('bodymovinc'),
     handler: function(direction) {
       if (direction === 'up') {
         // $('#lottie').css('opacity', 1); // fpr making animation visible again triggered at 5% of vh from the top
         animc.goToAndPlay(1, true);
       }
     },
       offset: '5%'
    })



			
})(jQuery);

