'use strict';
if (this.ToDo === undefined) this.ToDo = {};

(function(context) {
  var itemEntry;
  var promise;
  var guestId;

  function getListItem(){
    itemEntry = $('#item-input');
    var itemValue = itemEntry.val();
    $.ajax({
      url: '/api/todo',
      method: 'POST',
      data: {
        text: itemValue,
        isComplete: false
      }
    })

    .done(function(result){
      template(itemValue, result.id, false);
    });

    itemEntry.val(' ');
  }



  function template(itemValue, id, isComplete){
    var className = '';
    if (isComplete == 'true') {
      className = "completed";
    }
    var templateHtml = $('#templateStuff').html();
    var templateFunc = _.template(templateHtml);
    var html = templateFunc(
      {
        text: itemValue,
        guestId: id,
        className: className
      });
    $('.list').append(html);
  }


  function completedTask(evt){
    var $target = $(evt.target);
    // console.log('$target', $target); //{img.pencil}
    // $target.addClass('completed');
    var id = $target.data('id');
    // console.log('id', id);            //random number
    var text = $target.data('text');
    // console.log('text', text);        //undefined
    $.ajax({
      url: 'api/todo/' + id,
      method: 'PUT',
        data: {
          text: text,
          id: id,
          isComplete: true
        }
    });

    $target.toggleClass('completed');
  }


  function deleteClicked(evt) {
    evt.stopPropagation();
    var $target = $(evt.target);
    var id = $target.parent().data('id');

    $.ajax({
      url: '/api/todo/' + id,
      method: 'DELETE'
    });

      $target.parent().remove();
  }


  function start() {

    $('#item-input').keyup(function (e) {
      if (e.which == 13) {
        getListItem();
      }
    })

    $('.list').on('click','.trash-can', deleteClicked),

    $('.list').on('click','li', completedTask),



    $.ajax({
      url: '/api/todo',
      method: 'GET',
    })
    .done(function(GETdata){
      for (var i=0; i<GETdata.list.length; i++){
        template(GETdata.list[i].text, GETdata.list[i].id, GETdata.list[i].isComplete);
      }
    });

  };

  context.start = start;

})(window.ToDo);
