$(document).ready(function() {
    var keywordClicked;
    var subClicked;
    var predClicked;
    $('.degi').click(function() {
        keywordClicked = ($(this).data('keyword'));
        subClicked = $(this).data('subject');
        predClicked = $(this).data('predicate');
        $('#result-terms').children().removeClass('clicked');
        $(this).addClass("clicked");
        $.ajax({
            url: '/get-link',
            type: 'GET',
            dataType: 'json',
            data: {
                'key': $(this).data('keyword'),
                'filter': false,
                'sub': subClicked,
                'pred': predClicked
            },
            success: function(result_data) {
                $('.degi').clearFilterInputs();
                $('#filterText').text("");
                $('.degi').resultHandlerFunction(result_data);
            }
        });
    });


  $('#filter').click(function(){
      //$('#filter').myfunction();
	  
	  var selected_dateType = $('input:radio[name=DateSearchType]:checked').val();
	  var year1=$('#year_input').val();
	  var year2="";
	  console.log(selected_dateType);
	  if(selected_dateType == "range"){
		year2=$('#year_input2').val();
		if(year2.trim()!=""){
		  if((year2 > 9999) || (year2 < 1000)){
			$('#year_input2').addClass("errorBorder");
			return;
		}
		if(year1>year2){
			$('#year_input2').addClass("errorBorder");
			return;
		}
		}
	  }
	  
	  if(year1.trim()!=""){
		  if(($('#year_input').val() > 9999) || ($('#year_input').val() < 1000)){
			$('#year_input').addClass("errorBorder");
			return;
		  }
		  else{
			if($('#year_input').val().trim() != ""){
				$('#filterText').text(" Filtered on " + $('#year_input').val());
			}
			$.ajax({
			  url: '/get-link',
			  type: 'GET',
			  dataType: 'json',
			  data: {'key' : keywordClicked, 'sub': subClicked, 'pred' : predClicked, 'filter':true, 'year' : $('#year_input').val(), 'year2' : $('year_input2')},
			  success: function(result_data){
			  $('.filter').resultHandlerFunction(result_data);
			  }
			});
			$('#year_input').clearFilterInputs();
		  }
	   }
  });

    (function($) {
        $.fn.resultHandlerFunction = function(result_data) {
            $("#results-div").empty();
            if (result_data.length > 0) {
                jQuery.each(result_data, function(index, item) {
                    var block_tag = document.createElement("blockquote");
                    var anchor_tag = document.createElement("a");
                    var p_tag = document.createElement("p");
                    $(anchor_tag).append("This is a dummy heading tag");
                    $(anchor_tag).attr("href", result_data[index].value);
                    $(anchor_tag).attr("target", '_blank');
                    var break_tag = document.createElement("br");
                    //$(p_tag).append(result_data[index].key);
                    var matchStr = result_data[index].key;
                    var matchesarr = result_data[index].queryEntries; //matchStr.match(regexp);
                    jQuery.each(matchesarr, function(index, item) {
                        matchStr = matchStr.replace(item.toLowerCase(), "<b>" + item.toLowerCase() + "</b>" + " ");
                        matchStr = matchStr.replace(item.toUpperCase(), "<b>" + item.toUpperCase() + "</b>" + " ");
                        matchStr = matchStr.replace(item[0].toLowerCase() + item.slice(1), "<b>" + item[0].toLowerCase() + item.slice(1) + "</b>" + " ");
                    });
                    $(p_tag).append(matchStr);
                    $(block_tag).append(anchor_tag);
                    $(block_tag).append(p_tag);
                    $(block_tag).append(break_tag);
                    $("#results-div").append(block_tag);
                    //console.log("Done");
                });
            } else {
                var p_tag = document.createElement("p");
                var block_tag = document.createElement("blockquote");
                $(p_tag).append("No Results to show");
                $(block_tag).append(p_tag);
                $("#results-div").append(block_tag);
            }

            return this;
        };
        $.fn.clearFilterInputs = function() {
            $('#year_input').removeClass("errorBorder");
            $('#year_input').val('');
        };
    })(jQuery);

    $("#year_input").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
	
	$(".questionFormat").click(function(){
		$('input[name="triple1"]').val("Alzheimer's disease");
		var selectedObject = $(this).data("value");
		if(!($.isNumeric(selectedObject)))
			$('input[name="triple3"]').val(selectedObject);
		else
			  $('input[name="triple3"]').val('');
		var selectedVerb = $(this).data("verb");
		$('input[name="triple2"]').val(selectedVerb);
	});
	
	
	$('input[name="DateSearchType"]').click(function(){
		var selected_dateType = $('input:radio[name=DateSearchType]:checked').val();
		
		if(selected_dateType == "range"){
			alert("here");
			$('input[name="year_input2"]').prop("disabled",false);
		}
	});
	
});

