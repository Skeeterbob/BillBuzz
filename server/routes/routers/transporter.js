// server.js or emailConfig.js
import nodemailer from 'nodemailer';
import EmailHandler from './emailHandler.js';



// Authored by Henry Winczner from line(s) 1 - 23





const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ihatejunkmail42@gmail.com',
    pass: 'sensor1050',
  },
});

const emailHandler = new EmailHandler(transporter);

export default emailHandler;
