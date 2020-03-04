function convertFormToJson(form) {
  var array = jQuery(form).serializeArray();
  var json = {};
  
  jQuery.each(array, function() {
    json[this.name] = this.value || '';
  });
  
  return json;
}

$(document).ready(function(){
  $("p").click(function(){
    $(this).hide();
  });
});

$(document).ready(function(){
  $("form").submit(function(event){
    event.preventDefault();
    
    var form = this;
    var json = convertFormToJson(form);
    
    var time_sent = new Date().toString();
    json.time_sent = time_sent;
    
    $.post(
      "http://localhost:5000/",
      json,
      function(data,status){
        responseField.innerHTML = `<p>You've submitted a response!<br>Status: ${status}<br>Response: ${data.response}</p>`;
    });
  });
});