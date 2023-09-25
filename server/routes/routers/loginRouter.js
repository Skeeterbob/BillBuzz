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
loginRouter.post('/verify', async (req,res) => {
   try{
      const result = await dBHandler.verifyUser(req.body.email, req.body.password);
      if(result){
        res.status(200).json({message:'User Verified!'});

      }
      else{
        res.status(400).json({error:'Verification Failed! '})
      }
   }
   catch(error){
      console.err(error);
      res.status(500).json({error:'Error'});
   }
});

loginRouter.get('/verify/sms', async(req, res)=>{
    try{
        const result = await twilioHandler.validateSMSCode(req.body.phNum, req.body.code);

        if(result){
            res.status(200).json({message:'Code Verified!'});

        }
        else{
            res.status(400).json({error:'Verification Error!'});

        }
    }
        catch(error){
            console.error(error);
            res.status(500).json({error:'Error'});
        }
    });

export {loginRouter};
