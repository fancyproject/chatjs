var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var nickname = '';


app.use('/assets',express.static('./assets'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.post('/', urlencodedParser, function(req, res){
  console.log(req.body.nickname);
  if(req.body.nickname != ""){
    nickname = req.body.nickname;
    res.redirect('/chat');
  }else{
    res.redirect('/');
  }
});

app.get('/chat', function(req, res){
  if(nickname == ''){
    res.redirect('/');
  }
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('chat writing start', function(msg){
    io.emit('chat writing start', nickname);
  });

  socket.on('chat writing stop', function(msg){
    io.emit('chat writing stop', nickname);
  });
});



http.listen(port, function(){
  console.log('listening on *:' + port);
});


// io.listen(app);
//
//
//
//
// io.sockets.('connection', function(socket) {
// 	socket.on('draw', function(data) {
// 		socket.broadcast.emit('draw', data);
// 	});
// });
//
// console.log('Listing 3000');
