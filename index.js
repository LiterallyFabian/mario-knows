const http = require('http');
const express = require('express');
const Jimp = require('jimp');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1)

app.get('/mario:ext', (req, res) => {

    if (req.headers['user-agent'] === "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0") {
        res.sendFile(`${__dirname}/normal.png`);
    } else {

        // get ip
        console.log(req.headers)
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        ip = ip.split(',')[0];

        if (ip === "::1") // localhost
            ip = "192.0.2.0";

        // clean file path
        let cleanIp = ip.replace(/:/g, '_');

        // create image
        let path = `${__dirname}/tmp/${cleanIp}.jpg`;
        fs.access(path, fs.F_OK, (err) => {
            if (err) { // file does not exist
                createImg(ip, path, (err, path) => {
                    if (err) throw err;
                    res.sendFile(path);
                });
                return
            }

            res.sendFile(path); // file already exists
        });

        // delete the file after 10 minutes
        setTimeout(() => {
            fs.access(path, fs.F_OK, (err) => {
                if (err) return;
                fs.unlink(path, (err) => {
                    if (err) throw err;
                });
            });
        }, 1000 * 60 * 10);
    }
});

const port = 3001;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

/**
 * Creates a mario image and returns it
 * @param {string} ip The IP to add to the image
 * @param {string} path The path to save the image to
 * @param {callback} callback The callback to call when done
 */
function createImg(ip, path, callback) {
    let img;

    if (!fs.existsSync("tmp")) {
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