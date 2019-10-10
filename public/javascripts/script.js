const socket = io.connect('https://vid-conf23.herokuapp.com/');
//io.connect('http://localhost:3000/') ||
var videoElement = document.getElementById('video');
var videoElement2 = document.getElementById('video-2');
var canvasElement = document.getElementById('canvas');
var context = canvasElement.getContext('2d');
const fps = 100;
let supported = navigator.mediaDevices.getSupportedConstraints();
var wantedDevices = [];

//function to get the groupId of the needed devices
var device = function () {
    return navigator.mediaDevices.enumerateDevices()
        .then(res => {
            var devices = res.map((element) => {
                console.log(`element ${element.toJSON()}`);
                if (element.deviceId == "default") {
                    console.log(`found default: ${element}`);
                    return element;
                }
            });
            console.log('from promise', devices);
            return devices[0];
            // return res[3].toJSON();
        }).then(data => {
            // console.log('data', data.deviceId);
            // wantedDevices.push(data.deviceId);
            return data.groupId;
        }).catch(err => {
            console.log('error', err);
        });
};


// console.log('somVal', wantedDevices);
// console.log('support', supported);
// console.log('device',device);

device().then(id => {
    console.log('result: ', id);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: id
                    // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                }
            }
        }).then(function (MediaStream) {
            //video.src = window.URL.createObjectURL(stream);
            videoElement.srcObject = MediaStream;
            window.stream = MediaStream;
            console.log(`stream: ${MediaStream}`);
            videoElement.play();
        });
    } else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia({
            video: true,
            // audio: true
        }, function (stream) {
            videoElement.src = stream;
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia({
            video: true,
            // audio: true
        }, function (stream) {
            videoElement.src = window.webkitURL.createObjectURL(stream);
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia({
            video: true,
            // audio: true
        }, function (stream) {
            videoElement.srcObject = stream;
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    }
});




setInterval(() => {
    context.drawImage(videoElement, 0, 0, 640, 480);
    // console.log(`vid src: ${videoElement}`);
    var src = canvasElement.toDataURL("image/webp");
    socket.emit('newDraw', src);
}, 1000 / fps);


socket.on('draw', (vidsrc) => {
    document.getElementById('img1').src = vidsrc;
    // videoElement2.src = vidsrc;
    // console.log(vidsrc);
    device().then(id => {
        console.log('result: ', id);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    groupId: {
                        exact: id
                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                    }
                }
            }).then(function (MediaStream) {
                //video.src = window.URL.createObjectURL(stream);
                videoElement2.srcObject = MediaStream;
                window.stream = MediaStream;
                console.log(`stream: ${MediaStream}`);
                videoElement2.play();
            });
        } else if (navigator.getUserMedia) { // Standard
            navigator.getUserMedia({
                video: false,
                audio: {
                    groupId: {
                        exact: id
                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                    }
                }
            }, function (stream) {
                videoElement2.src = stream;
                console.log(`stream: ${stream}`);
                videoElement2.play();
            }, errBack);
        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia({
                video: false,
                audio: {
                    groupId: {
                        exact: id
                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                    }
                }
            }, function (stream) {
                videoElement2.src = window.webkitURL.createObjectURL(stream);
                console.log(`stream: ${stream}`);
                videoElement2.play();
            }, errBack);
        } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
            navigator.mozGetUserMedia({
                video: false,
                audio: {
                    groupId: {
                        exact: id
                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                    }
                }
            }, function (stream) {
                videoElement2.srcObject = stream;
                console.log(`stream: ${stream}`);
                videoElement2.play();
            }, errBack);
        }
    });

});



// socket.emit('stream',)

socket.on('image', (data) => {
    console.log(data);
});