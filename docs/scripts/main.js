let subdomain = 'subdomain';
let rootdomain = 'rootdomain';
const defaultUrl = 'http://localhost:8080';
let url = defaultUrl;
let currentPan = 0;
let currentTilt = 0;
let currentZoom = 0;
let memory = {};
const ubPan = 97;
const lbPan = -97;
const ubTilt = 32;
const lbTilt = -32;

const urlParams = new URLSearchParams(window.location.search);

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
  subdomain = json.subdomain;
  rootdomain = json.rootdomain;
  url = `https://${subdomain}.${rootdomain}`;
  urlField.innerHTML = `<div class="form-group row row_fix col-form-label unbold">${url}</div>`;
}

function updateCurrentPosition(json) {
  // Update internal variables with command.
  if (json.command === "home") {
    currentPan = 0;
    currentTilt = 0;
    // currentZoom = 0; // TODO: Check if Home resets Zoom.
  } else if (json.command === "pantilt") {
    currentPan = parseInt(json.val1);
    currentTilt = parseInt(json.val2);
  } else if (json.command === "relpantilt") {
    currentPan += parseInt(json.val1);
    currentTilt += parseInt(json.val2);
  } else if (json.command === "zoom") {
    currentZoom = parseInt(json.val1);
  } else if (json.command === "mem") { // TODO: Check if Memory includes Zoom.
    if (json.val1 === "set") {
      memory[json.val2] = {pan: currentPan, tilt: currentTilt};
    } else if (json.val1 === "goto") {
      if (memory[json.val2]) {
        currentPan = memory[json.val2].pan;
        currentTilt = memory[json.val2].tilt;
      }
    }
  }
  // Check bounds.
  if (currentPan > ubPan) {currentPan = ubPan;}
  if (currentPan < lbPan) {currentPan = lbPan;}
  if (currentTilt > ubTilt) {currentTilt = ubTilt;}
  if (currentTilt < lbTilt) {currentTilt = lbTilt;}
  // Update HTML.
  panField.innerHTML = `Pan: ${currentPan}`;
  tiltField.innerHTML = `Tilt: ${currentTilt}`;
  zoomField.innerHTML = `Zoom: ${currentZoom}`;
}

$(document).ready(function(){
  $("form").submit(function(event){
    event.preventDefault();
    var form = this;
    if (form.id === "form_external") {
      var json = convertFormToJson(form);
      var query = `?command=${json.command}&val1=${json.val1}&val2=${json.val2}`;
      outputField.innerHTML = `<p><b>Last submission:</b> ${url}/${query}</p>`;
      updateCurrentPosition(json);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${url}/${query}`, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          responseField.innerHTML = `Last response: ${xhr.data}`;
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

function helpTextHandler(event) {
  event.preventDefault();
  var span = this;
  var nodes = span.childNodes;
  if (nodes.length === 1 || nodes.length === 3) {
    var node = document.createElement("div")
    var textNode = document.createTextNode(`${span.title}`);
    node.appendChild(textNode);
    node.classList.add("help_subtext");
    span.appendChild(node);
  } else {
    span.removeChild(nodes[nodes.length-1]);
  }
}

$(document).ready(function(){
  $("span.help_text").click(helpTextHandler);
});

if (urlParams.has("code")) {
  let code = urlParams.get("code");
  console.log(`Session code from URL: ${code}`);
  document.getElementById("subdomain").value = code;
  const json = convertFormToJson(document.getElementById("form_internal"));
  updateUrl(json);
}
