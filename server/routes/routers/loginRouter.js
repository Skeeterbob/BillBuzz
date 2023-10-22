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

    const user = await dbHandler.getUserByEmail(email);
    if (!user) {
        return res.status(400).json({ error: 'User with this email does not exist.' });
    }

    // Create token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await dbHandler.updateUser(user);

    // Send email
    const mailOptions = {
        to: user.email,
        from: 'your-email@example.com',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/login/reset-password/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'An email has been sent to ' + user.email + ' with further instructions.' });
    });
});

// Reset the password
loginRouter.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const user = await dbHandler.getUserByResetToken(token);
    if (!user || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await dbHandler.updateUser(user);

    res.json({ message: 'Password has been updated.' });
});

export { loginRouter };