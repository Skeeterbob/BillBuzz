import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
//import { registerRouter } from './registerRouter.js';
const loginRouter = express.Router();
const twilioHandler = new TwilioHandler('TWILIO_ACCT_SID', 'TWILIO_AUTH_TOKEN');

//Get request for login through Twilio
loginRouter.post('/', async(req, res)=>
{
 try{
 
    //Request users' phone number
    const phNum = req.body.phNum;
    const sendSMS = sendSMS();

    req.redirect('../../twilioHandler.test.js');
 }
 catch(error){
    console.err(error);
    res.status(200).json({error:'Login Error'});
 }
});




export {loginRouter};