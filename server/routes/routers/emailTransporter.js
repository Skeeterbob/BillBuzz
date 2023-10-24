import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ihatejunkmail42@gmail.com', 
    pass: 'Sensor1050!' 
  }
});

export default transporter;