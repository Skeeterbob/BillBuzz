import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
import { DBHandler } from '../../dBHandler.js';
import { AuthHandler } from '../../authHandler.js';
//import { registerRouter } from './registerRouter.js';
const loginRouter = express.Router();
const twilioHandler = new TwilioHandler();
const dBHandler = new DBHandler();

twilioHandler.init();
dBHandler.init();

loginRouter.post('/login', async (req, res) => {
});

loginRouter.post('/login/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send('Email and Password fields are required');
    }

    const result = await dBHandler.verifyUser(email, password);
    
    if (result) {
        return res.status(200).send(JSON.stringify(result));
    }else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

loginRouter.post('/login/verify/sms', async(req,res)=>{
    try{
        const phNum = req.body.phNum;
        const code = req.body.code;
        const token = req.body.token;
        const id = req.body.id;

        const ctoken = AuthHandler.createToken(token, id);
        if(!ctoken){
            return res.status(400).json({error:'TOKEN INVALID!'});
        }

        const result = await twilioHandler.validateSMSCode('+1'+ phNum, code);
        if(result){
            res.status(200).send(JSON.stringify(result));
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
