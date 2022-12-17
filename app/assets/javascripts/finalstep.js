$(document).on('ready', function(){
  if(!document.getElementById('finalstepdiv')) return false
  var waypoint = new Waypoint({
    element: document.getElementById('finalstepdiv'),
    handler: function(direction) {
      // if (direction === 'down') {
      // }
    },
      offset: '70%'
  })
 
  var anima;
    var anim1 = document.getElementById('finalstepdiv')
    var animation = {
        container: anim1,
        renderer: 'svg',
        loop: true,
        autoplay: true,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
        progressiveLoad: false},
        path: '/finalstep.json', /*WHERE THE ANIMATION IS*/
        name: 'myAnimation',
    };

    anima = lottie.loadAnimation(animation);


})

