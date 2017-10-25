// {/* <video width="600" height="400" controls>
// <source src="index.m3u8" type="application/x-mpegURL">
// </video> */}
var URL_SERVER = "http://104.236.153.98:8080/?z=sf";

var execute = function() {
  var container = document.getElementById("video_container");
  fetch(URL_SERVER).then(res => res.json()).then(res => {
    var zones = res.zones.sf;
    var video = document.createElement("video");
    var source = document.createElement("source");
    video["data-setup"] = '{"fluid": true,"playbackRates": [1, 1.5, 2] }';
    video.width = 640;
    video.height = 264;
    video.class = "video-js vjs-default-skin";
    video.poster = "//vjs.zencdn.net/v/oceans.png";
    video.controls = false;
    video.preload = "auto";
    source.src = zones[0];
    source.type = "application/x-mpegURL";
    video.appendChild(source);
    container.appendChild(video);
  });
};

if (!!window.addEventListener) {
  window.addEventListener("DOMContentLoaded", execute);
} else {
  window.attachEvent("onload", execute);
}
