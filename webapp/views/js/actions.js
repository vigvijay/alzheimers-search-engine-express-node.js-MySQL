$(document).ready(function(){
  $('.degi').click(function(){
    //alert($(this).data('keyword'));
    $.ajax({
      url: '/get-link',
      type: 'GET',
      dataType: 'json',
      data: {'key' : $(this).data('keyword') },
      success: function(result_data){
        $("#results-div").empty();
        jQuery.each(result_data, function(index, item) {
          var block_tag = document.createElement("blockquote");
          var anchor_tag = document.createElement("a");
          var p_tag = document.createElement("p");
          $(anchor_tag).append("This is a dummy heading tag");
          var break_tag = document.createElement("br");
          $(p_tag).append(result_data[index].key); //result_data[index].key;
          $(block_tag).append(anchor_tag);
          $(block_tag).append(p_tag);
          $(block_tag).append(break_tag);
          $("#results-div").append(block_tag);
          //console.log("Done");
        });
      }
    });
  });
});
