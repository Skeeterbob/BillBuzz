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

registerRouter.post('/deleteUser', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({error: 'Email and password required!', success: false});
        }

        const user = await dbHandler.getUser(email);
        if (user.getPassword() !== password) {
            return res.status(401).json({error: 'Invalid password', success: false});
        }

        await dbHandler.deleteUser(email);
        res.status(200).json({success: true, error: ''});
    } catch (err) {
        console.log(err);
        res.status(400).json({error: '/register/deleteUser endpoint error', success: false});
    }
});
registerRouter.post('/updateThreshold', async (req, res) => {
    try {
        // Assuming the email and the new threshold are passed in the request body.
        const { email, overdraftThreshold } = req.body;
        console.log(req.body);

        // You should implement the updateThreshold method in your dbHandler to handle the database update.
        const result = await dbHandler.updateThreshold(email, overdraftThreshold);
        
        if (result['acknowledged'] && result['modifiedCount'] >= 1) {
            // Send back a success response
            res.status(200).json({
                message: "Threshold updated successfully",
                overdraftAlertThreshold: overdraftThreshold
            });
        } else {
            // If the document wasn't updated for some reason, handle it accordingly
            res.status(500).json({ error: "Could not update overdraft alert threshold" });
        }
    } catch (err) {
        console.log(err);
        // Handle any other errors that might occur
        res.status(400).json({ error: "Error in /register/updateThreshold endpoint" });
    }
});

export {registerRouter};