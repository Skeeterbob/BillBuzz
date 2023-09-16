const {TwilioHandler} = require('./twilioHandler.js');
const twilioHandler = new TwilioHandler();
require('dotenv').config();
test('checking process.env', () => {
    expect(twilioHandler.testFunc(1)).toBe(1);
});