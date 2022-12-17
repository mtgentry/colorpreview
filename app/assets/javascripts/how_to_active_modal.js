$(document).on('ready', function(){
  if(!document.getElementById('how_activate')) return false
  var waypoint = new Waypoint({
    element: document.getElementById('how_activate'),
    handler: function(direction) {
      // if (direction === 'down') {
      
      // }
    },
      offset: '70%'
  })
 
  var anima;
    var anim1 = document.getElementById('how_activate')
    var animation = {
        container: anim1,
        renderer: 'svg',
        loop: true,
        autoplay: true,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
        progressiveLoad: false},
        path: '/activation_instructions.json', /*WHERE THE ANIMATION IS*/
        name: 'myAnimation',
    };

    anima = lottie.loadAnimation(animation);


})


