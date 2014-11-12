var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twit = require('twit');
var twitcredentials = require('./twitcredentials.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');

   socket.on('disconnect', function(){
    console.log('user disconnected');
  });
 });

var watchList = ['account oneplus net invite claim'];

var T = new twit({
    consumer_key:           twitcredentials.consumer_key
    , consumer_secret:      twitcredentials.consumer_secret
    , access_token:         twitcredentials.access_token
    , access_token_secret:  twitcredentials.access_token_secret
});

var stream = T.stream('statuses/filter', { track: watchList })

stream.on('tweet', function (tweet) {
    var url="";
    var split = tweet.text.split(" ");
    
    split.forEach(function(entry) {
        if(entry.indexOf("http") > -1)
        {
            url=entry;
        }
    });
    
    
    if(url)
    {
        io.emit("url", url);
    }
    
    io.emit("event", tweet.text);
});


