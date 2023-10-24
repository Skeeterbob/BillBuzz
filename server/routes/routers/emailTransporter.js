class EmailHandler {
  constructor(transporter) {
    this.transporter = transporter;
  }

  sendMail(to, subject, text, callback) {
    const mailOptions = {
      from: 'your-email@example.com', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    };

    this.transporter.sendMail(mailOptions, callback);
  }
}

export default EmailHandler;