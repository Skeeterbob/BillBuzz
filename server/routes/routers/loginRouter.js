import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
import { DBHandler } from '../../dBHandler.js';
//import { registerRouter } from './registerRouter.js';
const loginRouter = express.Router();
const twilioHandler = new TwilioHandler();
const dBHandler = new DBHandler();

twilioHandler.init();

//Get request for login through Twilio
loginRouter.post('/login', async(req, res)=>
{
 try{
 
   
 }
 catch(err){
    console.err(error);
    res.status(401).json({error:'Login Error'});
 }
});




export {loginRouter};