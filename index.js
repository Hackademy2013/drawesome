/*******************************************************************************
 * DRAWsome
 * 
 * By James Kilian, Wyatt Hepler, & Kavya Nagaraj
 * 
 * Modified by John Manero <jmanero@dyn.com> for Hackademy2013 Showcase
 ******************************************************************************/

// Dependencies
var Express = require('express');

exports.path = "/drawesome";

var COLORS = require('./colors');
var app = exports.app = Express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(Express.bodyParser());
app.use(Express.methodOverride());
app.use(app.router);
app.use(Express.static(__dirname + '/public'));

app.configure('development', function() {
	app.use(Express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(Express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
	res.render('index');
});

exports.socket = function(io) {
	channel = io.of('/drawesome');

	var clients = [];
	var count = 0; // How many connected clients

	channel.on('connection', function(socket) {

		socket.on('client_connected', function(client) {
			client.id = socket.id;
//			console.log(COLORS.length + " " + hash(client.id) % COLORS.length);
			
			client.color = COLORS[hash(client.id) % COLORS.length];

			// keep track of this client
			clients.push(client);
			count++;

			// update the client
			socket.emit('sync_client', client);

//			console.log("Client %s has joined. We now have %d artists on the server.", client.name, count);

			if (count > 1) {
				channel.emit('message', "Greetings, " + client.name + "! Here's who's drawing right now:\n"
						+ listClients());
			} else {
				socket.emit('message', "Greetings, " + client.name
						+ "! You are the first person to work on this canvas.");
			}
		});

		socket.on('clientToserver', function(points) {
			// repackage and rebroadcast the points
			channel.emit('serverToClient', {
				pts : points,
				col : clients[clientIdx(socket.id)].color
			});
		});

		socket.on('chat', function(message) {
			channel.emit('message', "> " + clients[clientIdx(socket.id)].name + ": " + message);
		});

		socket.on('disconnect', function() {
			var idx = clientIdx(socket.id);
//			console.log(socket.id + " " + idx);
			
			count--;
//			console.log("The client \"" + clients[idx].name + "\" has left the party. A mere " + count
//					+ " users remain.");
			channel.emit('message', clients[idx].name + " abandoned you! Here's who's left:\n" + listClients());

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
	   return +code;
	}

};
