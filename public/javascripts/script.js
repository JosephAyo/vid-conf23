const socket = io.connect('https://vid-conf23.herokuapp.com/');
//||io.connect('http://localhost:3000/')


//Vue APP
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
        allUsers() {
            console.log('hit get all users');
            const vm = this;
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
        fetchUser() {
            this.show = true;
            console.log(this.Users[this.index].data._id);
            this.viewedUserGen = this.Users[this.index];
            window.localStorage.setItem('calledUser', JSON.stringify(this.Users[this.index].data.username));
        }
    },
    computed: {
        indicator() {
            if(this.viewedUserGen.data.onlineStatus){
                return {
                    backgroundColor: 'green'
                };
            }
        }
    }
});

const videoElement = document.getElementById('video');
const videoElement2 = document.getElementById('video-2');
const audioElement = document.getElementById('aud');
const canvasElement = document.getElementById('canvas');
const stopButton = document.getElementById('stopBtn');
const context = canvasElement.getContext('2d');

//TO DO: FRAMES PER SECOND (THIS WILL BE CHANGED TO A VARYING VALUE SO AS TO ALLOW
// FOR SO FRAMES TO BE SKIPPED IN CASE OF POOR NETWORK CONNECTION)
const fps = 100;


//GET CONSTRAINTS 
// let supported = navigator.mediaDevices.getSupportedConstraints();




//function to get id information of the needed devices
const device = () => navigator.mediaDevices.enumerateDevices()
    .then(res => {
        const devices = res.map((element) => {
            console.log(`element ${element.toJSON()}`);
            return element;
        });
        console.log('from promise', devices);
        return devices[0];
        // return res[3].toJSON();
    }).catch(err => {
        console.log('error', err);
    });


// console.log('support', supported);
// console.log('device',device);

device().then(deviceInfo => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                groupId: {
                    exact: deviceInfo.groupId
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }).then(MediaStream => {
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
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, stream => {
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
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, stream => {
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
                },
                kind: {
                    exact: "audioinput"
                }
            }
        }, stream => {
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

//
setInterval(() => {
    context.drawImage(videoElement, 0, 0, 640, 480);
    const src = canvasElement.toDataURL("image/webp");
    socket.emit('newDraw', src);
}, 1000 / fps);



//CALL FUNCTION TO CONNECT TWO CURRENTLY LOGGED IN USERS
//IT BASICALLY CONTINOUSLY RENDER IN A IMAGE ELEMENT THE VIDEO FEED FROM A USER 
//TO ANOTHERS' SCREEN
const call = () => {
    const caller = JSON.parse(window.localStorage.getItem('user'));
    const called = JSON.parse(window.localStorage.getItem('calledUser'));
    if (caller == called) {
        alert("You can't call yourself");
    } else {
        console.log(`placing a call to ${called}`);
        socket.on('draw', (vidsrc) => {
            document.getElementById('img1').src = vidsrc;
            device().then(deviceInfo => {
                console.log('result: ', deviceInfo);
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: {
                            groupId: {
                                exact: deviceInfo.groupId
                            },
                            kind: {
                                exact: "audiooutput"
                            }
                        }
                    }).then(MediaStream => {
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
                            },
                            kind: {
                                exact: "audiooutput"
                            }
                        }
                    }, MediaStream => {
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
                            },
                            kind: {
                                exact: "audiooutput"
                            }
                        }
                    }, MediaStream => {
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
                            },
                            kind: {
                                exact: "audiooutput"
                            }
                        }
                    }, MediaStream => {
                        audioElement.srcObject = MediaStream;
                        window.stream = MediaStream;
                        console.log(`stream: ${MediaStream}`);
                        audioElement.play();
                    }, errBack);
                }
            });
        });
    }
};