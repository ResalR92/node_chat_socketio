const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message'); // message generator

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname+'/../public');
// console.log(publicPath);

const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
// Integrated Socket.IO to express
var io = socketIO(server);

app.use(express.static(publicPath));

// ==========
// Socket.IO
// ==========
// ------------------------------------------------------------------------------------------
// Persistent technology - keep connection OPEN for client and server - which http can't do it
// when connection down - client will try to reconnect to server - via XHR
// ------------------------------------------------------------------------------------------
io.on('connection', (socket => {
  console.log('New user connected');

  // ==============================
  // Emitting event - socket.emit()
  // ==============================
  // socket.emit('newEmail', {
  //   // multiple - event data
  //   from:'resalramdahadi92@gmail.com',
  //   text:"Hey. What is going on?",
  //   createdAt:123
  // });

  // socket.emit('newMessage', {
  //   from: 'ResalR92',
  //   text: 'See you then',
  //   createdAt: 123123
  // });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('Create Email', newEmail);
  // });

  // socket.emit from Admin text Welcome to the chat app
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  // socket.broadcast.emit form admin text New User joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // ================================
  // Listening to event - socket.on()
  // ================================
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    // =====================================================
    // Emitting event to every single connection - io.emit()
    // =====================================================
    io.emit('newMessage', generateMessage(message.from, message.text));

    // ===========================
    // Broadcasting event - sending event to everyone but not the sender
    // ===========================
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
}));

// change app to server to integrate socket.IO to express in localhost
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
