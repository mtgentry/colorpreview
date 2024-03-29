function getFormToken() {
  return $('meta[name=csrf-token]').attr('content');
}

function initSortable(sortableItem, disable) {
  var sortable = Sortable.create(sortableItem, {
    swap : true,    
    draggable: ".selector_badge",
    group : 'replace',  
    ghostClass: 'blue-background-class',
    animation : 150,
    ghostClass: "sortable-ghost",
    disabled: disable,
    onEnd: function (evt) {
      // get dragged element item
      element1 = $(evt.item);
      columnIndex1 = element1.data('column-index');
      position1 = element1.data('position');

      // get target element item
      columnIndex2 = element1.parent().data('column-index')
      position2 = columnIndex2 + evt.newIndex + 1
      element2 = $("div[data-position='" + position2 + "']");

      // set attribute between 2 elements (dragged item and target item)
      element1.data('position', position2);
      element1.data('column-index', columnIndex2);
      element2.data('position', position1);
      element2.data('column-index', columnIndex1);

      function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }

      if ($('.favorites-trial').length !== 0) {
        arraymove(color_fav, evt.oldIndex, evt.newIndex)
        $.cookie('favorites', JSON.stringify(color_fav))
      }

      // restore id
      id1 = element1.data('favorite-id');
      id2 = element2.data('favorite-id');

      $.ajax({
        type: "PUT",
        dataType:"json",
        data: {
          favorite:{
            id1: id1,
            position1: position2,
            id2: id2,
            position2: position1
          }
        },
        url: "/favorites/update_index_favorite?authenticity_token=" + getFormToken(),
        success: function(result){
          location.reload();
        }
      });
    },
  })
}

$(document).ready(function() {
  $('#header-trigger').click(function () {
    $('.wrapper').toggleClass('open');
    $('.hamburger').toggleClass('hamburger__open');
    $('.mobile-menu').toggleClass('visible');
    $('.mobile-menu').toggleClass('hidden');
  });

  setTimeout(function() {
    $('.alert').addClass('dismiss')
  }, 2000)

  if(!$('.alert-activate').html()){
    setTimeout(function() {
      $('.notification-message').removeClass('active')
    }, 2000)
  }

  if($('.alert').html() || $('.alert-activate').html()){
    $('.notification-message').addClass('active')
  }

  $(document).on('click','.alert', function() {
    $(this).addClass('dismiss')
  })

  $(document).on('click','.alert-fade', function() {
    $(this).addClass('dismiss')
  })

  $('.close-alert').click(function(){
    $.ajax({
      type: "GET",
      dataType:"json",
      url: "/main/close_alert_active?authenticity_token=" + getFormToken(),
      success: function(result){
        console.log(result)
      }
    });
  });

  $('.add-favorite').click(function(){
    var sq1 = $(".sq1")
    var sq2 = $(".sq2")
    var sq3 = $(".sq3")
    var sq4 = $(".sq4")

    var color1 = $(".sq1.colors_1").attr('data-color');
    var color2 = $(".sq2.colors_2").attr('data-color');
    var color3 = $(".sq3.colors_3").attr('data-color');
    var color4 = $(".sq4.colors_4").attr('data-color');

    if(sq1.css("display") != "none"){
      var color_1 = color1;
    }else{
      var color_1 = "undefined";
    }
    if(sq2.css("display") != "none"){
      var color_2 = color2;
    }else{
      var color_2 = "undefined";
    }
    if(sq3.css("display") != "none"){
      var color_3 = color3;
    }else{
      var color_3 = "undefined";
    }
    if(sq4.css("display") != "none"){
      var color_4 = color4;
    }else{
      var color_4 = "undefined";
    }

    $.ajax({
      type: "POST",
      dataType:"json",
      data: {
        color_1: color_1,
        color_2: color_2,
        color_3: color_3,
        color_4: color_4
      },
      url: "/favorites?authenticity_token=" + getFormToken(),
      success: function(result){
        console.log(result.message);
      }
    });
  });

  $('.button-remove').click(function() {
    $(this).attr('disabled', 'disabled');
    favorite_id = $('.favorite_id').data('id');
    if (favorite_id) {
      $.ajax({
        type: "DELETE",
        dataType:"json",
        url: "/favorites/" + favorite_id + "authenticity_token?" + getFormToken(),
        success: function(result){
          console.log(result.notice);
        }
      });
    } else {
      console.log("Please Select Color First");
    }
  })

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


  var alert = getCookie("popupalert");
  var isTrueSet = (alert == 'true');

  if(isTrueSet == false){
    if($('.alert-activate.dismiss-color').html()){
      $('.notification-message').removeClass('active')
    }
  }

  if($('.link-form').length != 0){
    $('.link-form').keypress(function(e) {
      var key = e.which;
      if (key == 8 || key == 46) {
        e.stopPropagation();
      }
      e.preventDefault();
    });
  }

  // start daterange
  daterange_options = []
  if ($(".daterange").attr('data-auto-input') == 'false') {
    daterange_options["auto_input"] = false;
  } else {
    daterange_options["auto_input"] = true;
  }

  $(".daterange").daterangepicker({
    autoUpdateInput: daterange_options["auto_input"],
  });

  $('.daterange').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    $('#filter-analytic').submit();
  })

  $('.daterange').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('')
  })
  // end daterange

  // start datatable
  var datatable_options = []
  if ($('.datatable').attr('data-table-pagination') == "false") {
    datatable_options["paging"] = false;
  } else {
    datatable_options["paging"] = true;
  }

  var table = $('.datatable').DataTable({
    "paging": datatable_options["paging"],
    "lengthChange": false,
    "info": false,
    "columnDefs": [
      { "type": "num" }
    ]
  });

  $('#datatable-search').on('keyup', function() {
    table.search(this.value).draw();
  });

  $("#datatable-daterange").daterangepicker({
    autoApply: true,
    autoUpdateInput: false
  }, function(start, end, label) {
    minDate = start
    maxDate = end

    table.draw();
  });

  var minDate = null
      maxDate = null;

  $.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
      var min = minDate;
      var max = maxDate;
      var date = new Date( data[1] );

      if (
          ( min === null && max === null ) ||
          ( min === null && date <= max ) ||
          ( min <= date   && max === null ) ||
          ( min <= date   && date <= max )
      ) {
          return true;
      }
      return false;
    }
  );

  $("#resetbutton").click(function(){
    minDate = null
    maxDate = null
    $('#datatable-daterange').val('')
    table.draw();
  })

  $('#datatable-daterange').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'))
  })

  $('#datatable-daterange').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('')
  })
});