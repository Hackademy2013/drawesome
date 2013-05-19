/**************************************\
 *              DRAWsome               *
 *                                     *
 *        by James Kilian,             *
 *           Wyatt Hepler,             *
 *         & Kavya Nagaraj             *
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

app.configure('development', function() {
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
   app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
   res.render('index');
});

app.listen(3000);
// console.log("DRAWesome server started on port %d in %s mode", app.address().port, app.settings.env);

var clients = [];
var count = 0; // How many connected clients

io.sockets.on('connection', function(socket) {
   console.log("Socket id: " + socket.id + " wants to join the fun.");
   
   socket.on('client_connected', function(client) {
      client.id = socket.id;
      client.socket = socket;

      // save this client
      clients[count] = client;
      count++;
      
      console.log("Client %s has joined. We now have %d artists on the server.", client.name, count);

      if (count > 1) {
         socket.emit('message', {id: socket.id, text: ("Greetings, " + client.name + "! Here's who's drawing now:\n" + listClients() + ".")});
      } else {
         socket.emit('message', {id: socket.id, text: ("Greetings, " + client.name + "! You are the first person to work on this canvas.")});
      }

      io.sockets.emit('message', {id: socket.id, text: client.name}); 
      

      // socket.emit('connect_1', client);
      // io.sockets.emit('load', clients);
      console.log("Have you crashed yet?");
   });
   
   socket.on('points_c2s', function(points) {
      //repackage and rebroadcast the points
      io.sockets.emit('points_s2c', points);      
   });
   
   socket.on('disconnect', function() {
      var idx = clientIdx(socket.id);
      count--;
      console.log("The client \"" + clients[idx].name + "\" has left the building. Only " + count + " remain.");
      
      // This is probably really crappy Javascript code, sorry
      for (; idx < count; idx++) {
         clients[idx] = clients[idx + 1];
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
         if (i < count - 1)
            str += ", ";
   }
   return str;
}