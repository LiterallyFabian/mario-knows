# mario-knows
A silly Node.js server that will add someone's IP adress to a creepy image of Mario, and send it to them upon receiving a GET request.

## Set up
Clone, change dir & run. Default port is 3000.
```bash
$ git clone https://github.com/LiterallyFabian/mario-knows.git
$ cd mario-knows
$ node index.js
```
### Usage 
The image will automatically be edited and sent when the user GETs `/mario:ext`, for example `/mario.png`. The `ext` parameter is ignored by the code, but could be used to prevent caching issues while debugging. All generated images are in JPEG format.

A running instance is available at https://sajber.me/mario.png.
### Privacy
The image will be deleted automatically 10 minutes after the user requested it. You will only be able to retrieve your own image / ip. Of course the server host will be able to see the raw files, but it's not like your ip is private from them either way.
