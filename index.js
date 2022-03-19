const http = require('http');
const express = require('express');
const Jimp = require('jimp');
const fs = require('fs');
const CronJob = require('cron').CronJob;

const app = express();
app.set('trust proxy', 1)

app.get('/mario:ext', (req, res) => {
    // get ip
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.split(',')[0];

    if (ip == "::1") // localhost
        ip = "192.123.45.67";

    // create image
    let path = `${__dirname}/tmp/${ip}.jpg`;
    fs.access(path, fs.F_OK, (err) => {
        if (err) { // file does not exist
            createImg(ip, (err, imgpath) => {
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