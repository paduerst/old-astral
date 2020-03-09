const url = 'http://localhost:8080';

$(document).ready(function(){
  $("p").click(function(){
    $(this).hide();
  });
});

function convertFormToJson(form) {
  var array = jQuery(form).serializeArray();
  var json = {};
  
  jQuery.each(array, function() {
    json[this.name] = this.value || '';
  });
  
  return json;
}

const handleResponse = (data, status) => {
  responseField.innerHTML = `<p>You've submitted a response!<br>Status: ${status}<br>Response: ${data.message}</p>`;
}

$(document).ready(function(){
  $("form").submit(function(event){
    event.preventDefault();
    
    var form = this;
    var json = convertFormToJson(form);
    var query = `?command=${json.command}&val1=${json.val1}&val2=${json.val2}`;
    // responseField.innerHTML = `<p>Query: ${query}</p>`;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${url}/${query}`, true);
    xhr.onreadystatechange = function () {
      responseField.innerHTML = `<p>Response: ${xhr.readyState}, Status: ${xhr.status}</p>`;
      if (xhr.readyState === 4 && xhr.status === 200) {
        responseField.innerHTML = `<p>Response: ${xhr.responseText}</p>`;
      }
    };
    xhr.send();
    // $.get(`${url}/${query}`, function(data){alert(`Data: ${data}`);});
  });
});