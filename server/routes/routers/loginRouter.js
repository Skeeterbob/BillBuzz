import express from 'express';
import {dbHandler, twilioHandler} from "../../handlers.js";

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
});

loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({"error": 'Email and Password fields are required'});
    }

    const result = await dbHandler.verifyUser(email, password);

    if (result) {
        await twilioHandler.sendSMS('+1' + result.phoneNumber);
        return res.status(200).send(JSON.stringify(result));
    } else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

loginRouter.post('/getUser', async (req, res) => {
    console.log('in getUser endpoint');
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({"error": 'Email and Password fields are required'});
    }

    const result = await dbHandler.getUser(email);
    console.log('36',JSON.parse(result.toJSONString()));
    if (result.getPassword() !== password) {
        return res.status(401).json({'error': 'Invalid password'});
    }
    console.log(result);
    return res.status(200).json(JSON.parse(result.toJSONString()));
});

loginRouter.post('/verify/sms', async (req, res) => {
    try {
        const phNum = req.body.phNum;
        const code = req.body.code;

        if (phNum && code) {
            if (await twilioHandler.validateSMSCode('+1' + phNum, code)) {
                res.status(200).json({"validate": true});
            } else {
                res.status(400).json({"validate": false, "error": 'Verification Error!'});
            }
        }else {
            res.status(400).json({"validate": false, "error": 'Phone number and verification code must be provided!'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error'});
    }
});

export {loginRouter};