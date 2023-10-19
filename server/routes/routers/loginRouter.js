import express from 'express';
import { TwilioHandler } from '../../twilioHandler.js';
import { DBHandler } from '../../dBHandler.js';
import { AuthHandler } from '../../authHandler.js';

const loginRouter = express.Router();
const dBHandler =  new DBHandler();
const twilioHandler = new TwilioHandler();
const authHandler = new AuthHandler();

twilioHandler.init();
dBHandler.init();

loginRouter.post('/', async (req, res) => {
});

loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({"error":'Email and Password fields are required'});
        
    }

    const result = await dBHandler.verifyUser(email, password);
    
    if (result) {
        return res.status(200).send(JSON.stringify(result));
    }else {
        return res.status(401).send('Incorrect Email/Password provided!');
    }
});

loginRouter.post('/getUser', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({"error":'Email and Password fields are required'});
    }

    const result = await dBHandler.getUser(email);
    if (result.getPassword() !== password) {
        return res.status(401).json({'error': 'Invalid password'});
    }

    return res.status(200).json(JSON.parse(result.toJSONString()));
});

export {loginRouter};