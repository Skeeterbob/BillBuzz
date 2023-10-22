import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '', 
    pass: '' 
  }
});

export default transporter;