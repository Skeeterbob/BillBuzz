import express from 'express';
import { dbHandler, twilioHandler } from "../../handlers.js";
import crypto from 'crypto';
//import emailHandler from './transporter.js'; // or wherever you exported emailHandler
import emailHandler from '../../emailHandler.js';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
});

// Raigene cook originally authored this, and Bryan Hodgins made some minor debugging tweaks.
//Lines 12-27 by Raigene (Commit #1dadd9a)
// Raigene cook originally authored this, and Bryan Hodgins made some minor debugging tweaks.
//Lines 12-27 by Raigene (Commit #1dadd9a)
loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({ "error": 'Email and Password fields are required' });
    }

    const result = await dbHandler.verifyUser(email, password);

    if (result) {
        await twilioHandler.sendSMS('+1' + result.phoneNumber);//Modified by Bryan 
        return res.status(200).send(JSON.stringify(result));
    } else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

// Bryan Hodgins originally authored this before it was moved from incorrect location in the register router.
// There seems to be some minor changes to it though.
loginRouter.post('/getUser', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ "error": 'Email and Password fields are required' });
    }

    const result = await dbHandler.getUser(email);

    if (result.getPassword() !== password) {
        return res.status(401).json({ 'error': 'Invalid password' });
    }
    return res.status(200).json(JSON.parse(result.toJSONString()));
});

// Bryan Hodgins originally authored this route. I believe Raigene Cook did error handling.
//Lines 51-69 by Raigene (commit #2234138)
loginRouter.post('/verify/sms', async (req, res) => {
    try {
        const phNum = req.body.phNum;
        const code = req.body.code;

        if (phNum && code) {
            if (await twilioHandler.validateSMSCode('+1' + phNum, code)) {
                res.status(200).json({ "validate": true });
            } else {
                res.status(400).json({ "validate": false, "error": 'Verification Error!' });
            }
        } else {
            res.status(400).json({ "validate": false, "error": 'Phone number and verification code must be provided!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error'});
    }
});

export {loginRouter};