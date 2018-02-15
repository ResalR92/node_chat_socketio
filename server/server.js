const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require("./utils/message"); // message generator
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users'); // class users

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname+'/../public');
// console.log(publicPath);

const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
// Integrated Socket.IO to express
var io = socketIO(server);
var users = new Users();

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

  // ===========================
  // move to socket.on('join')
  // ===========================
  // // socket.emit from Admin text Welcome to the chat app
  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  // // socket.broadcast.emit form admin text New User joined
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // ===============================
  // Listening to event - join
  // ===============================
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room); // join group
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    // socket.leave('name room') --- to leave group

    // io.emit -> io.to('name room').emit()
    // socket.broadcast.emit -> socket.broadcast.to('name room').emit()
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  // ================================
  // Listening to event - socket.on()
  // ================================
  socket.on('createMessage', (message, callback) => { // event acknowledgement - server - callback
    console.log('createMessage', message);

    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      // =====================================================
      // Emitting event to every single connection - io.emit()
      // =====================================================
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is from the server.');
    // ===========================
    // Broadcasting event - sending event to everyone but not the sender
    // ===========================
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  // Geolocation
  socket.on('createLocationMessage', (coords) => {
    // io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));

    var user = users.getUser(socket.id);

    if(user) {
      // link to google maps
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, `${coords.latitude}, ${coords.longitude}`));
    }

  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
}));

// change app to server to integrate socket.IO to express in localhost
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
