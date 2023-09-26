import express from 'express';
//import {dBHandler, twilioHandler} from "../../handlers.js";
import {DBHandler} from '../../dBHandler.js'
import {TwilioHandler} from '../../twilioHandler.js';

const loginRouter = express.Router();
const dBHandler =  new DBHandler();
const twilioHandler = new TwilioHandler();

dBHandler.init()
twilioHandler.init()

//Get request for login through Twilio
loginRouter.post('/', async (req, res) => {
});

loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send('Email and Password fields are required');
    }

    const result = await dBHandler.verifyUser(email, password);
    
    if (result.validate) {
        twilioHandler.sendSMS('+1' + result.phoneNumber);
        return res.status(200).send(JSON.stringify(result));
    }else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

export {loginRouter};