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

// Output link - geolocation
socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery("#messages").append(li);
});

// Message - Form - Submit
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextBox = jQuery("[name=message]");

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('');
  });
});

// Geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  // disable while geolocation searching
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    // console.log(position);
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('Unable to fectch location.');
  });
});
