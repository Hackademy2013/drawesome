/***********************************\
 *              DRAWsome            *
 *                                  *
 *        by James Kilian,          *
 *           Wyatt Hepler,          *
 *         & Kavya Nagaraj          *
 *                                  *
\***********************************/

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

// Logging
app.use(Express.logger());

// Routes
app.get('/', function(req, res){
   res.render('index');
});

app.listen(3000);

var clients = [];
var count = 0; // How many connected clients

io.sockets.on('connection', function(socket) {
   
   socket.on('client_connected', function(client) {
      client.id = socket.id;
      client.color = COLORS[hash(client.id) % COLORS.length];

      // keep track of this client
      clients[count] = client;
      count++;
      
      //update the client
      socket.emit('sync_client', client);
      
      console.log("Client %s has joined. We now have %d artists on the server.", client.name, count);

      if (count > 1) {
         io.sockets.emit('message', "Greetings, " + client.name + "! Here's who's drawing right now:\n" + listClients());
      } else {
         socket.emit('message', "Greetings, " + client.name + "! You are the first person to work on this canvas.");
      }
   });
   
   socket.on('clientToserver', function(points) {
      //repackage and rebroadcast the points
      io.sockets.emit('serverToClient', {pts: points, col: clients[clientIdx(socket.id)].color});      
   });
   
   socket.on('chat', function(message) {
      io.sockets.emit('message', "> " + clients[clientIdx(socket.id)].name + ": " + message);
   });
   
   socket.on('disconnect', function() {
      var idx = clientIdx(socket.id);
      count--;
      console.log("The client \"" + clients[idx].name + "\" has left the party. A mere " + count + " users remain.");
      io.sockets.emit('message', clients[idx].name + " abandoned you! Here's who's left:\n" + listClients());
      
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
         if (i < count - 1) //hmm... not the most efficient way
            str += ", ";
   }
   return str;
}

function hash(str) {
   var code = 0;
   for (i = 0; i < str.length; i++) {
      code = code*31 + str.charCodeAt(i);
   }
   return code;
}

//epic colors table. Thank you, Wikipedia
var COLORS = [
               {r: 255, g: 192, b: 203},
               {r: 255, g: 182, b: 193},
               {r: 255, g: 105, b: 180},
               {r: 255, g:  20, b: 147},
               {r: 219, g: 112, b: 147},
               {r: 199, g:  21, b: 133},
               {r: 255, g: 160, b: 122},
               {r: 250, g: 128, b: 114},
               {r: 233, g: 150, b: 122},
               {r: 240, g: 128, b: 128},
               {r: 205, g:  92, b:  92},
               {r: 220, g:  20, b:  60},
               {r: 178, g:  34, b:  34},
               {r: 139, g:   0, b:   0},
               {r: 255, g:   0, b:   0},
               {r: 255, g:  69, b:   0},
               {r: 255, g:  99, b:  71},
               {r: 255, g: 127, b:  80},
               {r: 255, g: 140, b:   0},
               {r: 255, g: 165, b:   0},
               {r: 255, g: 215, b:   0},
               {r: 255, g: 255, b:   0},
               {r: 255, g: 248, b: 220},
               {r: 255, g: 235, b: 205},
               {r: 255, g: 228, b: 196},
               {r: 255, g: 222, b: 173},
               {r: 245, g: 222, b: 179},
               {r: 222, g: 184, b: 135},
               {r: 210, g: 180, b: 140},
               {r: 188, g: 143, b: 143},
               {r: 244, g: 164, b:  96},
               {r: 218, g: 165, b:  32},
               {r: 184, g: 134, b:  11},
               {r: 205, g: 133, b:  63},
               {r: 210, g: 105, b:  30},
               {r: 139, g:  69, b:  19},
               {r: 160, g:  82, b:  45},
               {r: 165, g:  42, b:  42},
               {r: 128, g:   0, b:   0},
               {r:  85, g: 107, b:  47},
               {r: 128, g: 128, b:   0},
               {r: 107, g: 142, b:  35},
               {r: 154, g: 205, b:  50},
               {r:  50, g: 205, b:  50},
               {r:   0, g: 255, b:   0},
               {r: 124, g: 252, b:   0},
               {r: 127, g: 255, b:   0},
               {r: 173, g: 255, b:  47},
               {r:   0, g: 255, b: 127},
               {r:   0, g: 250, b: 154},
               {r: 144, g: 238, b: 144},
               {r: 152, g: 251, b: 152},
               {r: 143, g: 188, b: 143},
               {r:  60, g: 179, b: 113},
               {r:  46, g: 139, b:  87},
               {r:  34, g: 139, b:  34},
               {r:   0, g: 128, b:   0},
               {r:   0, g: 100, b:   0},
               {r: 102, g: 205, b: 170},
               {r:   0, g: 255, b: 255},
               {r:   0, g: 255, b: 255},
               {r: 224, g: 255, b: 255},
               {r: 175, g: 238, b: 238},
               {r: 127, g: 255, b: 212},
               {r:  64, g: 224, b: 208},
               {r:  72, g: 209, b: 204},
               {r:   0, g: 206, b: 209},
               {r:  32, g: 178, b: 170},
               {r:  95, g: 158, b: 160},
               {r:   0, g: 139, b: 139},
               {r:   0, g: 128, b: 128},
               {r: 176, g: 196, b: 222},
               {r: 176, g: 224, b: 230},
               {r: 173, g: 216, b: 230},
               {r: 135, g: 206, b: 235},
               {r: 135, g: 206, b: 250},
               {r:   0, g: 191, b: 255},
               {r:  30, g: 144, b: 255},
               {r: 100, g: 149, b: 237},
               {r:  70, g: 130, b: 180},
               {r:  65, g: 105, b: 225},
               {r:   0, g:   0, b: 255},
               {r:   0, g:   0, b: 205},
               {r:   0, g:   0, b: 139},
               {r:   0, g:   0, b: 128},
               {r:  25, g:  25, b: 112},
               {r: 216, g: 191, b: 216},
               {r: 221, g: 160, b: 221},
               {r: 238, g: 130, b: 238},
               {r: 218, g: 112, b: 214},
               {r: 255, g:   0, b: 255},
               {r: 255, g:   0, b: 255},
               {r: 186, g:  85, b: 211},
               {r: 147, g: 112, b: 219},
               {r: 138, g:  43, b: 226},
               {r: 148, g:   0, b: 211},
               {r: 153, g:  50, b: 204},
               {r: 139, g:   0, b: 139},
               {r: 128, g:   0, b: 128},
               {r:  75, g:   0, b: 130},
               {r:  72, g:  61, b: 139},
               {r: 106, g:  90, b: 205},
               {r: 123, g: 104, b: 238},
               {r: 192, g: 192, b: 192},
               {r: 169, g: 169, b: 169},
               {r: 128, g: 128, b: 128},
               {r: 105, g: 105, b: 105},
               {r: 119, g: 136, b: 153},
               {r: 112, g: 128, b: 144},
               {r:  47, g:  79, b:  79},
               {r:   0, g:   0, b:   0}
            ];