import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
import { DBHandler } from '../../dBHandler.js';
import { AuthHandler } from '../../authHandler.js';
//import { registerRouter } from './registerRouter.js';
const loginRouter = express.Router();
const dBHandler =  new DBHandler();
const twilioHandler = new TwilioHandler();

twilioHandler.init();

//Get request for login through Twilio
loginRouter.post('/', async(req, res)=>
{
 try{
 
    //Request users' phone number
    const phNum = req.body.phNum;
    const sendSMS = sendSMS();
 }
 catch(err){
    console.err(error);
    res.status(401).json({error:'Login Error'});
 }
});




export {loginRouter};
