import express from 'express';
import { dbHandler, twilioHandler } from "../../handlers.js";
import crypto from 'crypto';
import emailHandler from './transporter.js'; // or wherever you exported emailHandler

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
});

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
        res.status(500).json({ error: 'Error' });
    }

});
loginRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ "error": 'Email field is required' });
    }

    try {
        const user = await dbHandler.getUser(email);
        if (!user) {
            return res.status(404).send({ "error": 'User not found' });
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await dbHandler.updateUserPassword(user);

        // Send an email to the user with the reset link
        emailHandler.sendMail(
            email,
            'Reset Your Password',
            'Here is your password reset link: ...', // The email text should include the password reset link or token
            (error, info) => {
              if (error) {
                console.log('Error sending email: ', error);
                res.status(500).send('Error sending password reset email');
              } else {
                console.log('Password reset email sent: ', info.response);
                res.status(200).send('Password reset email sent');
              }
            }
          );

    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": 'Internal server error' });
    }
});

// Route to handle the password reset
loginRouter.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).send({ "error": 'Token and password fields are required' });
    }

    try {
        const user = await dbHandler.getUserByToken(token);
        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(404).send({ "error": 'Token is invalid or has expired' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await dbHandler.updateUserPassword(user);

        res.status(200).send({ "message": 'Password successfully reset' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": 'Internal server error' });
    }
});

export { loginRouter };