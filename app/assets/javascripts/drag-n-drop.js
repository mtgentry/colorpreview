$(document).on('ready', function(){
  var options = { 
    group: "omega", 
    handle: ".color-card-container", 
    animation: 150,
    onEnd: function (evt) {
      var params = []
      $('#selected .color-card-container').each(function(i, el){
        params.push({id: $(el).data('id'), index: i})
      })
      axios.post('/library', { colors: params })
    },
  }
  
  // Grouping
  var foo = document.getElementById("selected");
  var bar = document.getElementById("other");
  
  if(foo && bar){
    Sortable.create(foo, options);
    Sortable.create(bar, options);
  } else if (foo) {
    Sortable.create(foo, options);
  }

  $('.color-card-container').each(function(el) { 
    var id = $(this).data('id')
    var alias = $(this).data('alias')
    colorwheel = colorwheels[alias] || colorwheels['split']
    window.modules.colorwheel.drawColorChart(colorwheel, 'tiny', '#colorwheel' + id)
  })
})