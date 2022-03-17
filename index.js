const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.send("hi");
});

const port = 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});