///////////////////////////////////////////////////////////////////
// Draws a pie sector
//
///////////////////////////////////////////////////////////////////
function drawPieSector(snap, centre,
                        rIn, rOut, startDeg, delta, attr) {

  var startOut = {
    x: centre.x + rOut * Math.cos(Math.PI*(startDeg)/180),
    y: centre.y + rOut * Math.sin(Math.PI*(startDeg)/180)
  };

  var endOut = {
    x: centre.x + rOut * Math.cos(Math.PI*(startDeg + delta)/180),
    y: centre.y + rOut * Math.sin(Math.PI*(startDeg + delta)/180)
  };

  var startIn = {
    x: centre.x + rIn * Math.cos(Math.PI*(startDeg + delta)/180),
    y: centre.y + rIn * Math.sin(Math.PI*(startDeg + delta)/180)
  };

  var endIn = {
    x: centre.x + rIn * Math.cos(Math.PI*(startDeg)/180),
    y: centre.y + rIn * Math.sin(Math.PI*(startDeg)/180)
  };

  var largeArc = delta > 180 ? 1 : 0;

  var path = "M" + startOut.x + "," + startOut.y +
          " A" + rOut + "," + rOut + " 0 " +
          largeArc + ",1 " + endOut.x + "," + endOut.y +
          " L" + startIn.x + "," + startIn.y +
          " A" + rIn + "," + rIn + " 0 " +
          largeArc + ",0 " + endIn.x + "," + endIn.y +
          " L" + startOut.x + "," + startOut.y + " Z";

  var path = snap.path(path);

  path.attr(attr);

  return path;
}

///////////////////////////////////////////////////////////////////
// Draws a pie chart
//
///////////////////////////////////////////////////////////////////
function drawPie(snap, centre, rIn, rOut, data) {

  var total = 0;

  for(var key in data){

    total += data[key].value;
  }

  var delta = 359.99 * data[key].value / total;
  var startDeg = -90 - (delta / 2);

  var pie = snap.group();

  for(var key in data){

    delta = 359.99 * data[key].value / total;
    var sector = drawPieSector(snap, centre,
            rIn, rOut, startDeg, delta, data[key].attr);

    pie.add(sector);

    startDeg += delta;
  }

  return pie;
}

///////////////////////////////////////////////////////////////////
// Draws the color chart
//
///////////////////////////////////////////////////////////////////
var chart = null;

var drawColorChart = function(colors, size, el) {  
  el = el || '#colorwheel'
  // TODO: get real data  
  var data = colors.map(function(color) { 
    return {
      value: 200,
      attr: {
        stroke: color,
        fill: color,
        fillOpacity: 1,
        strokeWidth: 0
      }
    }
  })

  $(el).empty();
  var snap = Snap(el);

  // if(chart && el == '#colorwheel') chart.remove();
  if(size && size == 'tiny'){    
    chart = drawPie(snap,
      {x:81, y:68},
      26, 60, data);
  } else if (size && size == 'small') {
    chart = drawPie(snap,
      {x:120, y:120},
      52, 120, data);
  } else {
    chart = drawPie(snap,
      {x:217, y:217},
      100, 217, data);
  }  
}

var colorwheel = { 
  drawColorChart: drawColorChart
}

window.modules = window.modules || {}
window.modules.colorwheel = colorwheel
