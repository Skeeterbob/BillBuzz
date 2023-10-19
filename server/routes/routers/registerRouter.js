import express from 'express';
import {User} from '../../objectPack.js';
import {dbHandler, twilioHandler} from "../../handlers.js";

const registerRouter = express.Router();

registerRouter.post('/createUser', async (req, res) => {
    try {
        if (req.body.user) {
            let user = new User({...req.body.user});
            const result = await dbHandler.insertUser(user);
            await twilioHandler.sendSMS('+1' + user.getPhoneNumber());
            res.status(200).json(result);
        }else {
            res.status(400).json({error: 'no user data specified.'});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: "/register/createUser endpoint error"})
    }
});

registerRouter.post('/updateUser', async (req, res) => {
    try {
        let user = new User(req.body);
        const result = await dbHandler.updateUser(user);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json({error: "/register/createUser endpoint error"})
    }
});

export {registerRouter};