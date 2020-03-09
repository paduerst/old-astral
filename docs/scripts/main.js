const defaultUrl = 'http://localhost:8080';
let url = defaultUrl;

function convertFormToJson(form) {
  var array = jQuery(form).serializeArray();
  var json = {};
  json["command"] = form.name;
  jQuery.each(array, function() {
    json[this.name] = this.value || '';
  });
  return json;
}

function updateUrl(json) {
  const subdomain = json.subdomain;
  const rootdomain = json.rootdomain;
  url = `https://${subdomain}.${rootdomain}`;
  urlField.innerHTML = `<h4>Submitting to: ${url}</h4>`;
}

$(document).ready(function(){
  $("form").submit(function(event){
    event.preventDefault();
    var form = this;
    if (form.id === "form_external") {
      var json = convertFormToJson(form);
      var query = `?command=${json.command}&val1=${json.val1}&val2=${json.val2}`;
      outputField.innerHTML = `<p>Last submission: ${url}/${query}</p>`;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${url}/${query}`, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert(`Status 200?!This is unexpected!`);
        }
      };
      xhr.send();
      // $.get(`${url}/${query}`, function(data){alert(`Data: ${data}`);});
    } else {
      const json = convertFormToJson(form);
      updateUrl(json);
    }
  });
});