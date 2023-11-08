import express from 'express';
import {User} from '../../objectPack.js';
import {dbHandler, twilioHandler} from "../../handlers.js";

const registerRouter = express.Router();

// createUser route originally authored by Bryan Hodgins. Seems to have been slightly modified.
registerRouter.post('/createUser', async (req, res) => {
    try {
        console.log('request',req.body.user);
        if (req.body.user) {
            let user = new User({...req.body.user});
            const result = await dbHandler.insertUser(user);
            console.log(await twilioHandler.sendSMS('+1' + user.getPhoneNumber()));
            console.log('database result', result);
            res.status(200).json(result);
        }else {
            res.status(400).json({error: 'no user data specified.'});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: "/register/createUser endpoint error"})
    }
});



// Authored by Hadi Ghaddar from line(s) 32 - 48



registerRouter.post('/updateUser', async (req, res) => {
    try {
        let user = new User(req.body.user);
        let email = req.body.email;
        const result = await dbHandler.updateUser(email, user);
        if (result['acknowledged'] && result['modifiedCount'] >= 1) {
            res.status(200).json(JSON.parse(user.toJSONString()));
        }else {
            res.status(500).json({error: "/register/createUser could not update user"})
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: "/register/updateUser endpoint error"})
    }
});

export {registerRouter};