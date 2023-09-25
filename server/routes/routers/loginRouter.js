import express from 'express';
import {dBHandler, twilioHandler} from "../../handlers.js";

const loginRouter = express.Router();

//Get request for login through Twilio
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

export {loginRouter};