$(document).on('ready', function(){
  if(!document.getElementById('mycolormodal')) return false
  var waypoint = new Waypoint({
    element: document.getElementById('mycolormodal'),
    handler: function(direction) {
      // if (direction === 'down') {
      
      // }
    },
      offset: '70%'
  })
 
  var anima;
    var anim1 = document.getElementById('mycolormodal')
    var animation = {
        container: anim1,
        renderer: 'svg',
        loop: true,
        autoplay: true,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
        progressiveLoad: false},
        path: '/how_to.json', /*WHERE THE ANIMATION IS*/
        name: 'myAnimation',
    };

    anima = lottie.loadAnimation(animation);
})