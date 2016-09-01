'use strict';
if (this.ToDo === undefined) this.ToDo = {};

(function(context) {
  var itemEntry;
  var promise;
  var guestId;

  function getListItem(){
    itemEntry = $('#item-input');
    ajaxCall();
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
        item: itemValue,
        guestId: id,
        className: className
      });
    $('.list').append(html);
  }



  function ajaxCall() {
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
    }); //done
  }

  function deleteClicked(evt) {
    var $target = $(evt.target);
    var id = $target.data('id');
    console.log('id', id);
    // alert('You have just deleted item number:' + id);

    $.ajax({
      url: '/api/todo/' + id,
      method: 'DELETE'
    });

    $target.parent().remove();
  }

  function completedTask(evt){
    var $target = $(evt.target);
    var id = $target.data('id');

    $.ajax({
      url: 'api/todo' + id,
      method: 'PUT'
    })

    $target.parent().toggleClass('completed');
  }

  function start() {

    $('#item-input').keyup(function (e) {
      if (e.which == 13) {
        getListItem();
      }
    })

    $('.list').on('click','.trash-can', deleteClicked),

    $('.list').on('click','.pencil', completedTask),


    $.ajax({
      url: '/api/todo',
      method: 'GET',
    })
    .done(function(data){
      for (var i=0; i<data.list.length; i++){
        template(data.list[i].text, data.list[i].id, true)
      }
    });
  };

  context.start = start;

})(window.ToDo);
