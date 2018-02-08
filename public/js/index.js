var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");

  // socket.emit('createEmail', {
  //   to:"ramdahadiresal@ymail.com",
  //   text:"Hey. This is ResalR"
  // });
  socket.emit('createMessage', {
    from: "resalramdahadi92@gmail.com",
    text:'Hey there!!'
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// Custom event
// socket.on('newEmail', function(email) {
//   console.log('New email', email);
// });

socket.on('newMessage', function(message) {
  console.log('newMessage', message);
});
