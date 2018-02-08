var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");

  // socket.emit('createEmail', {
  //   to:"ramdahadiresal@ymail.com",
  //   text:"Hey. This is ResalR"
  // });
  // socket.emit('createMessage', {
  //   from: "resalramdahadi92@gmail.com",
  //   text:'Hey there!!'
  // });
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

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Tests',
//   text: 'Hi'
// }, function(data) { // event acknowlegdement - client
//   console.log('Got it!!!', data);
// });

// Message - Form - Submit
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  });
});
