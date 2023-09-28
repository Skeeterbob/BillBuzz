import express from 'express';
//import {dBHandler, twilioHandler} from "../../handlers.js";
import {DBHandler} from '../../dBHandler.js'
import {TwilioHandler} from '../../twilioHandler.js';
import {AuthHandler} from '../../authHandler.js';

const loginRouter = express.Router();
const dBHandler =  new DBHandler();
const twilioHandler = new TwilioHandler();
const authHandler = new AuthHandler();

dBHandler.init()
twilioHandler.init()

//Get request for login through Twilio
loginRouter.post('/', async (req, res) => {
});

loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({"error":'Email and Password fields are required'});
        
    }

    const result = await dBHandler.verifyUser(email, password);
    
    if (result.validate) {
        twilioHandler.sendSMS('+1' + result.phoneNumber);
        return res.status(200).send(JSON.stringify(result));
    }else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

loginRouter.post('/login/verify/sms', async(req,res)=>{
    try{
        const phNum = req.body.phNum;
        const code = req.body.code;
       // const id = req.body.id;

        if(await twilioHandler.validateSMSCode('+1'+ phNum, code)){
            //let token = authHandler.createToken(id);
            let result = {"validate":true};
            res.status(200).json(result);
        }
        else{
            res.status(400).json({"validate":false,"error":'Verification Error!'});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:'Error'});
    }
});

export {loginRouter};