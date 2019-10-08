var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var app = express();
var socket = require('socket.io');
const ip = require('ip');


const port = process.env.PORT || 3000;

var server= app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname)));
// app.use('/', indexRouter);
app.use('/users', usersRouter);


var io=socket(server);
io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.on('newDraw',()=>{
        console.log('node app hit newDraw##################################################+++++++++++++++++++++++++===========================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        socket.emit('draw');
    });
    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    });
});

setInterval(()=>{
    io.emit('image','data');
},1000);



module.exports = app;