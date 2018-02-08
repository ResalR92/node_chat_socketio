const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname+'/../public');
// console.log(publicPath);

const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
// Integrated Socket.IO to express
var io = socketIO(server);

app.use(express.static(publicPath));

// Persistent technology - keep connection OPEN for client and server
// when connection down - client will try to reconnect to server - via XHR
io.on('connection', (socket => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
}));

// change app to server to integrate socket.IO to express in localhost
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
