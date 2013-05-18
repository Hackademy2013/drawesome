/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');

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
console.log("DRAWesome server started on port %d in %s mode", app.address().port, app.settings.env);

var clients = [];
var i = 0; // How many connected clients

io.sockets.on('connection', function(socket)
{
  console.log("We had a connection from socket id: " + socket.id);
  
  socket.on('client_connected', function(player)
  {
    player.id = socket.id;
   console.log("Client connected: " + socket.id);

    clients[i] = player;
    i++;
    
   console.log("Player " + player.name + " has joined." + 
               "We now have " + i + " artists on the server.");
	
   socket.emit('test', player.name);
   
    socket.emit('connect_1', player);
    io.sockets.emit('load', clients);
  });
  
  socket.on('process_move', function(coords)
  {
    var n = 0;
    coords = coords.replace("#",'');
	
    
    // ToDo: Send in players mark instead of ugly loop
    while (n < clients.length)
    {
      if (clients[n].id == socket.id)
      {
        grid[coords] = clients[n].mark;
      }
      n++;
    }
    
    // Update clients with the move
    io.sockets.emit('mark', coords);
    
    // Win check

  });
  
  socket.on('disconnect', function()
   {
     var j = 0;
     var n = 0;
     var tmp = [];

     while (n < clients.length)
     {
       if (clients[j].id == socket.id)
       {
         if(clients[j].mark == 'o')
         {
           xo = 'o';
           o = false;
         }
         if(clients[j].mark == 'x')
         {
           xo = 'x';
         }
     	   n++;
     	 }
     	 
     	 if (n < clients.length)
     	 {
     	   tmp[j] = clients[n];
     	   j++;
     	   n++;
     	  }
     	}
     	
     	clients = tmp;
     	i = j;
      io.sockets.emit('load', clients);
   });
  
});