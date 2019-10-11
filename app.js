var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var fs = require('fs');
var app = express();
const User = require('./models/user');
var socket = require('socket.io');
const ip = require('ip');

const uri ='mongodb+srv://josephayo:mongodb360@cluster0-ys6nl.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri);

mongoose.Promise = global.Promise;
const port = process.env.PORT || 3000;

var server= app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname)));
// app.use('/', indexRouter);
app.use('/users', usersRouter);


var io=socket(server);


io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.on('chat',(message)=>{
        console.log('message: '+ message);
        socket.broadcast.emit('message', message);
    });
    socket.on('stream',stream=>{
        console.log('stream',stream);
    });
    socket.on('newDraw',(vidSrc)=>{
        // console.log('node app hit newDraw##################################################++>>');
        socket.broadcast.emit('draw',vidSrc);
    });
    socket.on('dialling',(dialledUser)=>{
        socket.broadcast.emit('pickUp',dialledUser);
        console.log(`dialled User: ${dialledUser}`);
    });
    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    });
});

app.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var PlaintextPassword = req.body.password;
    console.log(req.body);
    User.findOne({
        username: username
    }).then(result => {
        if (result) {
            res.status(401).end('Username already in use!');
        } else {
            console.log('not found');
            bcrypt.hash(PlaintextPassword, saltRounds, function (err, hash) {
                User.create({
                        username: username,
                        password: hash
                    })
                    .then(result => {
                        res.sendFile(path.join(__dirname, 'public') + '/success.html', {
                            title: 'Success'
                        });
                    });
            });
        }
    });
});

app.get("/login_page", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public') + '/login.html', {
        title: 'Login Page'
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(`from post:'/login' ${username}`);
    User.find({
        username: username
    }, function (err, user) {
        if (err) throw err;
        if (user.length<1) {
            console.log('unknown user');
            res.status(404).json({error:'Invalid username or password!!!'}); 
        } else {
            console.log(`passport saw this ==========> ${user[0].password}`);
            bcrypt.compare(password, user[0].password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    console.log(`SUCCESS ${user[0].username} successfully logged in`);
                    console.log(`user[0]._id: ${user[0]._id}`);
                    res.status(200).json({
                        username: user[0].username
                    });
                } else {
                    console.log('not confirmed');
                    res.status(404).json({error:'Invalid username or password!!!'});
                }
            });
        }
        
    });
});

//handle errors that go uncaught in the routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});




module.exports = app;