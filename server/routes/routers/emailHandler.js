class EmailHandler {
  constructor(transporter) {
    this.transporter = transporter;
  }

  sendMail(to, subject, text, callback) {
    const mailOptions = {
      from: 'ihatejunkmail42@gmail.com', // sender address
      to: 'ihatejunkmail42@gmail.com', // list of receivers
      subject, // Subject line
      text, // plain text body
    };

    this.transporter.sendMail(mailOptions, callback);
  }
}

export default EmailHandler;