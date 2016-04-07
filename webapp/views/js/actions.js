$(document).ready(function(){
  $('.degi').click(function(){
    //alert($(this).data('keyword'));
    $.ajax({
      url: '/get-link',
      type: 'GET',
      dataType: 'json',
      data: {'key' : $(this).data('keyword'), 'filter':false },
      success: function(result_data){
      $('.degi').myfunction(result_data);
      }
    });
  });

  $('#filter').click(function(){
      //$('#filter').myfunction();
      $.ajax({
        url: '/get-link',
        type: 'GET',
        dataType: 'json',
        data: {'key' : $('.degi').data('keyword'), 'filter':true, 'year' : $('#year_input').val()},
        success: function(result_data){
        $('.filter').myfunction(result_data);
        }
      });
  });

  (function( $ ){
   $.fn.myfunction = function(result_data) {
     $("#results-div").empty();
     jQuery.each(result_data, function(index, item) {
       var block_tag = document.createElement("blockquote");
       var anchor_tag = document.createElement("a");
       var p_tag = document.createElement("p");
       $(anchor_tag).append("This is a dummy heading tag");
       $(anchor_tag).attr("href",result_data[index].value);
       $(anchor_tag).attr("target",'_blank');
       var break_tag = document.createElement("br");
       $(p_tag).append(result_data[index].key); //result_data[index].key;
       $(block_tag).append(anchor_tag);
       $(block_tag).append(p_tag);
       $(block_tag).append(break_tag);
       $("#results-div").append(block_tag);
       //console.log("Done");
     });
      return this;
   };
  })( jQuery );
});
