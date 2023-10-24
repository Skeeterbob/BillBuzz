import express from 'express';
import { dbHandler, twilioHandler } from "../../handlers.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import transporter from './emailTransporter.js';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
});

loginRouter.post('/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({ "error": 'Email and Password fields are required' });
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

        await dbHandler.updateUser(user);

        // Send an email to the user with the reset link
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://your-app.com/reset-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ "error": 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).send({ "message": 'Reset email sent' });
        });
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

        await dbHandler.updateUser(user);

        res.status(200).send({ "message": 'Password successfully reset' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": 'Internal server error' });
    }
});

export { loginRouter };