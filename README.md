#DRAWesome

##Further possibilities

1:Color selection, shadows, 
1:a. Layers(multiple canvas objects)

2: Save drawings and pull saves from db

3: Flickr api to search images and open to have the user trace

## Usage
#### App
Run:

```node ./app.js```

#### Module

    var app = Express();
    var server = HTTP.createServer(app);
    var io = IO.listen(server);
    
    var Drawesome = require('drawesome');
    
    app.use('/drawesome', Drawesome.app);
    Drawesome.socket(io);
