import dotenv from 'dotenv';
dotenv.config('../.env');
import {TwilioHandler} from './twilioHandler.js';
const twilioHandler = new TwilioHandler();
await twilioHandler.init().then(() => {
    twilioHandler.sendSMS(process.env.TEST_PHONE);
});
