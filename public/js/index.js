var socket = io();

// autoscrolling function
function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // height
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}


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
  // console.log('newMessage', message);
  // momentjs
  // var formattedTime = moment(message.createdAt).format('h:mm a');

  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime} : ${message.text}`);

  // jQuery('#messages').append(li);

  // mustache js - template
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt : formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
});

// socket.emit('createMessage', {
//   from: 'Tests',
//   text: 'Hi'
// }, function(data) { // event acknowlegdement - client
//   console.log('Got it!!!', data);
// });

// Output link - geolocation
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');

  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);

  // jQuery("#messages").append(li);

  // moustache js - template
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt : formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
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
