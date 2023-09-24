import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
import { DBHandler } from '../../dBHandler.js';
//import { registerRouter } from './registerRouter.js';
const loginRouter = express.Router();
const twilioHandler = new TwilioHandler();
const dBHandler = new DBHandler();

twilioHandler.init();
dBHandler.init();

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

loginRouter.post('/verify', async (req,res) => {
   try{

   }
   catch(err){
      console.err(error);
      res.status(401).json({error:'User Verify Error'});
   }
})




export {loginRouter};