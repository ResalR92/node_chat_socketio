const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct object', () => {
    let from = 'Resal';
    let text = 'Some Message';

    let message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Resal';
    var latitude = -5;
    var longitude = 105;

    var url = 'https://www.google.com/maps?q=-5,105';

    var message = generateLocationMessage(from, latitude, longitude);
    expect(message.createdAt).toBeA("number");
    expect(message).toInclude({ from, url });
  });
});
