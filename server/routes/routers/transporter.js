// server.js or emailConfig.js
import nodemailer from 'nodemailer';
import EmailHandler from './emailHandler.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ihatejunkmail42@gmail.com',
    pass: 'sensor1050',
  },
});

const emailHandler = new EmailHandler(transporter);

export default emailHandler;
