var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var session = require('express-session')({
  secret: "chatjs",
  resave: true,
  saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

app.use(session);
io.use(sharedsession(session, {
  autoSave: true
}));

app.use('/assets', express.static('./assets'));
app.get('/', function(req, res) {
  if (req.session.username !== undefined && req.session.username !== '') {
    res.redirect('/chat');
  } else {
    res.sendFile(__dirname + '/views/login.html');
  }
});

app.post('/', urlencodedParser, function(req, res) {
  if (req.body.username != "") {
    req.session.username = req.body.username;
    res.redirect('/chat');
  } else {
    res.redirect('/');
  }
});

app.get('/chat', function(req, res) {
  if (req.session.username === undefined || req.session.username == '') {
    res.redirect('/');
  } else {
    res.sendFile(__dirname + '/views/index.html');
  }
});

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    console.log('chat message');
    io.emit('chat message', {
      text: msg,
      username: socket.handshake.session.username
    });
    io.emit('chat writing stop', {
      username: socket.handshake.session.username
    });
  });

  socket.on('chat writing', function(msg) {
    console.log('chat writing');
    io.emit('chat writing', {
      username: socket.handshake.session.username
    });
  });

  socket.on('chat writing stop', function(msg) {
    console.log('chat writing stop');
    io.emit('chat writing stop', {
      username: socket.handshake.session.username
    });
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
