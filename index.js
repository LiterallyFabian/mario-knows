const http = require('http');
const express = require('express');
const Jimp = require('jimp');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1)

app.get('/mario:ext', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.split(',')[0];

    if (ip == "::1") // localhost
        ip = "192.123.45.67";

    let path = __dirname + '/' + ip + ".jpg";

    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            createImg(ip, (err, path) => {
                if (err) throw err;
                res.sendFile(__dirname + '/tmp/' + ip + ".jpg");
            });
            return
        }

        res.sendFile(__dirname + '/tmp/' + ip + ".jpg");
    })
});

const port = 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

/**
 * Creates a mario image and returns it
 * @param {string} ip The IP to add to the image
 * @param {callback} callback The callback to call when done
 */
function createImg(ip, callback) {
    let img;
    let path = `tmp/${ip}.jpg`;

    if (!fs.existsSync("tmp")){
        fs.mkdirSync("tmp");
    }

    Jimp.read('mario.jpg')
        .then(function (image) {
            img = image;
            return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        })
        .then(function (font) {
            img.print(font, 120, 423, ip)
                .write(path, (err, image) => {
                    if (err) throw err;
                    return callback(null, path);
                });
        })
}