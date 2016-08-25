'use strict';
if (this.ToDo === undefined) this.ToDo = {};

(function(context) {
  var itemEntry;
  var promise;
  var guestId;


//
  function getListItem(){
    itemEntry = $('#item-input');
    ajaxCall();
    itemEntry.val(' ');
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
      var templateHtml = $('#templateStuff').html();
      var templateFunc = _.template(templateHtml);
      var html = templateFunc(
        {
          item: itemValue,
          guestId: result.id
        });
      $('.list').append(html);

    })

  }

  function deleteClicked(evt) {
    var $target = $(evt.target);
    var id = $target.data('id');
    console.log('id', id);
    alert('You have just deleted item number:', id);

    $.ajax({
      url: '/api/todo/' + id,
      method: 'DELETE'
    });
  }

  function start() {

    $('#item-input').keyup(function (e) {
      if (e.which == 13) {
        getListItem();
      }
    })

    $('.list').on('click', deleteClicked),

    $.ajax({
      url: '/api/todo',
      method: 'GET',
    })
    .done(function(data){
      for (var i=0; i<data.list.length; i++){
        var templateHtml = $('#templateStuff').html();
        var templateFunc = _.template(templateHtml);
        var html = templateFunc(
          {
            item:data.list[i].text,
            guestId: data.list[i].id
          });
        $('.list').append(html);
      }
    })


  };

  context.start = start;

})(window.ToDo);
