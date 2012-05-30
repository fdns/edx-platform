function ${ id }_content_updated() {
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  update_schematics();

  $('#check_${ id }').unbind('click').click(function() {
  $("input.schematic").each(function(index,element){ element.schematic.update_value(); });
  $(".CodeMirror").each(function(index,element){ if (element.CodeMirror.save) element.CodeMirror.save(); });

//  for (var key in codemirror_set) {
//      codemirror_set[key].refresh();
//  }

    var submit_data={};
    $.each($("[id^=input_${ id }_]"), function(index,value){
	    if (value.type==="checkbox"){
		if (value.checked) {
		    if (typeof submit_data[value.name] == 'undefined'){
			submit_data[value.name]=[];
		    }
		    submit_data[value.name].push(value.value);
		}
	    }
	    if (value.type==="radio"){
		if (value.checked) {
		    submit_data[value.name]= value.value;
		}
	    }
	    else{
		submit_data[value.id]=value.value;
	    }
    });
    postJSON('${ MITX_ROOT_URL }/modx/problem/${ id }/problem_check',
      submit_data,
      function(json) {
        switch(json.success) {
        case 'incorrect': // Worked, but answer not 
        case 'correct':
          $('#main_${ id }').html(json.contents);
          ${ id }_content_updated();
          break;
        default:
          alert(json.success);
      }}
    );
    log_event('problem_check', submit_data);
  });

  $('#reset_${ id }').unbind('click').click(function() {
    var submit_data={};
    $.each($("[id^=input_${ id }_]"), function(index,value){
      submit_data[value.id]=value.value;
    });

    postJSON('${ MITX_ROOT_URL }/modx/problem/${ id }/problem_reset', {'id':'${ id }'}, function(html_as_json) {
      $('#main_${ id }').html(html_as_json);
      ${ id }_content_updated();
    });
    log_event('problem_reset', submit_data);
  });

  // show answer button
  // TODO: the button should turn into "hide answer" afterwards
  $('#show_${ id }').unbind('click').click(function() {
    postJSON('${ MITX_ROOT_URL }/modx/problem/${ id }/problem_show', {}, function(data) {
      for (var key in data) {
	  if ($.isArray(data[key])){
	      for (var ans_index in data[key]){
		  var choice_id = 'input_'+key+'_'+data[key][ans_index];
		  $("label[for="+choice_id+"]").attr("correct_answer", "true");   
	      }
	  }
	  $("#answer_"+key).text(data[key]);
    }
  });

    log_event('problem_show', {'problem':'${ id }'});
  });

  $('#save_${ id }').unbind('click').click(function() {
    $("input.schematic").each(function(index,element){ element.schematic.update_value(); });
    var submit_data={};
    $.each($("[id^=input_${ id }_]"), function(index,value) {
      submit_data[value.id]=value.value;
    });
    postJSON('${ MITX_ROOT_URL }/modx/problem/${ id }/problem_save',
      submit_data,
      function(data) {
        if(data.success) {
          alert('Saved');
    }});
    log_event('problem_save', submit_data);
  });
}

function ${ id }_load() {
  $('#main_${ id }').load('${ ajax_url }problem_get?id=${ id }', ${ id }_content_updated);
}

$(function() {
  ${ id }_load();
});
