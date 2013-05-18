/**************************************\
 *              DRAWsome               *
 *                                     *
 *        by James Kilian,             *
 *           Wyatt Hepler              *
 *           Kavya Nagaraj             *
 *                                     *
\**************************************/

// Dependencies
var express = require('express'),
    io      = require('socket.io');

var app = module.exports = express.createServer();

var io = io.listen(app);

// Configuration

io.set('log level', 1); // Turn off annoying polling
app.configure(function() {
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
   res.render('index');
});

app.listen(3000);
//console.log("DRAWesome server started on port %d in %s mode", app.address().port, app.settings.env);

var clients = [];
var count = 0; // How many connected clients

io.sockets.on('connection', function(socket)
{
   console.log("Socket id: " + socket.id + " wants to join the fun.");
   
   socket.on('client_connected', function(client)
   {
      client.id = socket.id;

      // save this client
      clients[count] = client;
      count++;
      
      console.log("Client %s has joined. We now have %d artists on the server.", client.name, count);

      socket.emit('test', client.name);
      socket.emit('connect_1', client);
      io.sockets.emit('load', clients);
   });
   
   socket.on('disconnect', function() {
      var idx = clientIdx(socket.id);
      console.log("The client \"" + clients[idx].name + "\" has left the building.");
      count--;
      
      for (; idx < count; idx++) {
         clients[idx] = clients[idx + 1]
      }
   });
});

// Tools
function clientIdx(id) {
   for (i = 0; i < count; i++)
      if (clients[i].id === id)
         return i;
}

function listClients() {
   str = "";
   for (i = 0; i < count; i++) {
      str += clients[i].name;
   }
}
