const socket = io.connect('https://vid-conf23.herokuapp.com/') || io.connect('http://192.168.8.113:3000/');
var videoElement = document.getElementById('video');
var canvasElement = document.getElementById('canvas');
var context = canvasElement.getContext('2d');
const fps = 90;



if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        videoElement.srcObject = stream;
        videoElement.play();
    });
} else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia({
        video: true,
        audio: true
    }, function (stream) {
        videoElement.src = stream;
        videoElement.play();
    }, errBack);
} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({
        video: true,
        audio: true
    }, function (stream) {
        videoElement.src = window.webkitURL.createObjectURL(stream);
        videoElement.play();
    }, errBack);
} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({
        video: true,
        audio: true
    }, function (stream) {
        videoElement.srcObject = stream;
        videoElement.play();
    }, errBack);
}



setInterval(() => {
    context.drawImage(videoElement, 0, 0, 640, 480);
}, 1000 / fps);


socket.on('image', (data) => {
    console.log(data);
});