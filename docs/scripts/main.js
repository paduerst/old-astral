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
      "https://script.google.com/macros/s/AKfycbwTT8iVHgzWdzn5Yrs-83nI4COzPHm6X6lQYmICaal1f-TyXxI/exec",
      json,
      function(data,status){
        responseField.innerHTML = `<p>You've submitted a response!<br>Status: ${status}<br>Data added to row: ${data.row}</p>`;
    });
  });
});