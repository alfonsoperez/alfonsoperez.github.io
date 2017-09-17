// {/* <video width="600" height="400" controls>
// <source src="index.m3u8" type="application/x-mpegURL">
// </video> */}
var URL_SERVER = "http://104.236.153.98:8080/?z=sf";

var execute = function() {
  var container = document.getElementById("video_container");
  fetch(URL_SERVER).then(res => res.json()).then(res => {
    var zones = res.zones.sf;
    var video = document.createElement("video");
    video.src = zones[0];
    video.autoplay = true;
    container.appendChild(video);
  });
};

if (!!window.addEventListener) {
  window.addEventListener("DOMContentLoaded", execute);
} else {
  window.attachEvent("onload", execute);
}
