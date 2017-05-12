const PORT = 13487;
const TOKEN = "criw1137"

var express = require('express')
var app = express()

var messages = [];
var id = 0;

var fs = require('fs');

if(fs.existsSync('messages')){
  messages = JSON.parse(fs.readFileSync('messages', 'utf-8'));
  var temp_id = 0;
  messages.forEach(m => {
    if(m.id > temp_id){
      temp_id = m.id
    }
  });
  id = temp_id + 1;
}


app.get('/', function (req, res) {
  res.json(messages);
})

app.get('/:id', function(req,res){
  var reqid = parseInt(req.params.id);
  res.json(messages.filter(m => m.id >= reqid));
})

app.get('/update/:token/:message', function(req, res){
  if(req.params.token == TOKEN){
    var message = JSON.parse(req.params.message);
    message.time = new Date().getTime();
    message.id = id;
    id ++;
    messages.push(message);
    res.send("Message with id " + message.id + " accepted at " + message.time);
  }else{
    console.log("Request with faulty token: " + req.params.token);
    res.send("Faulty token");
  }
});

app.listen(PORT, function () {
  console.log(`Router listening on port ${PORT}!`);
})

//Save received messages every minute
var lastUpdate = -1;
setInterval(() => {
  if(id > lastUpdate){
    fs.writeFileSync('messages', JSON.stringify(messages), 'utf-8');
    lastUpdate = id;
  }
}, 1000 * 60);
