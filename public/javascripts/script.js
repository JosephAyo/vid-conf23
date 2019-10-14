const socket = io.connect('https://vid-conf23.herokuapp.com/');
//||io.connect('http://localhost:3000/')

new Vue({
    el: '#app',
    data: {
        User: (JSON.parse(window.localStorage.getItem('user'))),
        Users: [],
        index: 0,
        viewedUserGen: '',
        show: false
    },
    methods: {
        allUsers: function () {
            console.log('hit get all users');
            var vm = this;
            fetch('/users', {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                return res.json();
            }).then(data => {
                // console.log(data);
                vm.Users = data.users;
                console.log(vm.Users);
            }).catch(err => {
                console.log(`error: ${err}`);
            });
        },
        fetchUser: function () {
            this.show = true;
            console.log(this.Users[this.index].data._id);
            this.viewedUserGen = this.Users[this.index];
            window.localStorage.setItem('calledUser', JSON.stringify(this.Users[this.index].data.username));
        }
    }
});

var videoElement = document.getElementById('video');
var videoElement2 = document.getElementById('video-2');
var audioElement = document.getElementById('aud');
var canvasElement = document.getElementById('canvas');
var stopButton = document.getElementById('stopBtn');
var context = canvasElement.getContext('2d');
const fps = 100;
let supported = navigator.mediaDevices.getSupportedConstraints();
var wantedDevices = [];

function call() {
    var caller = JSON.parse(window.localStorage.getItem('user'));
    var called = JSON.parse(window.localStorage.getItem('calledUser'));
    if (caller == called) {
        alert("You can't call yourself");
    } else {
        console.log(`placing a call to ${called}`);
        socket.emit('dialling', called);
        socket.on('pickUp', dialled => {
            //allow stream if the dialled user coincides with the presently logged in user
            if (caller == dialled) {
                socket.on('draw', (vidsrc) => {
                    document.getElementById('img1').src = vidsrc;
                    // videoElement2.src = vidsrc;
                    // console.log(vidsrc);
                    device().then(deviceInfo => {
                        console.log('result: ', deviceInfo);
                        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                            navigator.mediaDevices.getUserMedia({
                                video: false,
                                audio: {
                                    groupId: {
                                        exact: deviceInfo.groupId
                                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                                    },
                                    kind: {
                                        exact: "audiooutput"
                                    }
                                }
                            }).then(function (MediaStream) {
                                //video.src = window.URL.createObjectURL(stream);
                                audioElement.srcObject = MediaStream;
                                window.stream = MediaStream;
                                console.log(`stream: ${MediaStream}`);
                                audioElement.play();
                            });
                        } else if (navigator.getUserMedia) { // Standard
                            navigator.getUserMedia({
                                video: false,
                                audio: {
                                    groupId: {
                                        exact: deviceInfo.groupId
                                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                                    },
                                    kind: {
                                        exact: "audiooutput"
                                    }
                                }
                            }, function (MediaStream) {
                                audioElement.srcObject = MediaStream;
                                window.stream = MediaStream;
                                console.log(`stream: ${MediaStream}`);
                                audioElement.play();
                            }, errBack);
                        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                            navigator.webkitGetUserMedia({
                                video: false,
                                audio: {
                                    groupId: {
                                        exact: deviceInfo.groupId
                                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                                    },
                                    kind: {
                                        exact: "audiooutput"
                                    }
                                }
                            }, function (MediaStream) {
                                audioElement.srcObject = MediaStream;
                                window.stream = MediaStream;
                                console.log(`stream: ${MediaStream}`);
                                audioElement.play();
                            }, errBack);
                        } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
                            navigator.mozGetUserMedia({
                                video: false,
                                audio: {
                                    groupId: {
                                        exact: deviceInfo.groupId
                                        // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                                    },
                                    kind: {
                                        exact: "audiooutput"
                                    }
                                }
                            }, function (MediaStream) {
                                audioElement.srcObject = MediaStream;
                                window.stream = MediaStream;
                                console.log(`stream: ${MediaStream}`);
                                audioElement.play();
                            }, errBack);
                        }
                    });
                });
            } else {
                console.log('this called is not for you');
            }
        });
    }
}

//function to get the groupId of the needed devices
var device = function () {
    return navigator.mediaDevices.enumerateDevices()
        .then(res => {
            var devices = res.map((element) => {
                console.log(`element ${element.toJSON()}`);
                return element;
            });
            console.log('from promise', devices);
            return devices[0];
            // return res[3].toJSON();
        }).catch(err => {
            console.log('error', err);
        });
};


// console.log('somVal', wantedDevices);
console.log('support', supported);
// console.log('device',device);

device().then(deviceInfo => {
    console.log('result: ', deviceInfo);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log(`first`);
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: deviceInfo.groupId
                    // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                },
                kind: {
                    exact: "audioinput"
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
        console.log(`standard`);
        navigator.getUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: deviceInfo.groupId
                    // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, function (stream) {
            videoElement.src = stream;
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        console.log(`webkit`);
        navigator.webkitGetUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: deviceInfo.groupId
                    // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, function (stream) {
            videoElement.src = window.webkitURL.createObjectURL(stream);
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        console.log(`moz`);
        navigator.mozGetUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: deviceInfo.groupId
                    // 'b2b92d582ab6037118adba78cfbda558c0f072f410923b87d16e042f75963a8c'
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, function (stream) {
            videoElement.srcObject = stream;
            console.log(`stream: ${stream}`);
            videoElement.play();
        }, errBack);
    }
});

stopButton.addEventListener('click', () => {
    // Stop all video streams.
    videoElement.srcObject.getVideoTracks().forEach(track => track.stop());
});


setInterval(() => {
    context.drawImage(videoElement, 0, 0, 640, 480);
    // console.log(`vid src: ${videoElement}`);
    var src = canvasElement.toDataURL("image/webp");
    socket.emit('newDraw', src);
}, 1000 / fps);






// socket.emit('stream',)

socket.on('image', (data) => {
    console.log(data);
});