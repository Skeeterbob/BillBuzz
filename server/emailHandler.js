import nodemailer from 'nodemailer';

//check if all environment variables are set

/*if (!process.env.EMAIL || !process.env.PASSWORD || !process.env.ACCESS_TOKEN) {
    console.error('Error: the EMAIL, PASSWORD, and ACCESS_TOKEN environment variables are required');
    process.exit(1);
}*/

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        accessToken: process.env.ACCESS_TOKEN
    }
});

//method to send email to reset password to users stored email address
const sendMail = (to, subject, token, callback) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text: `Your password reset link is: ${token}`,
        html:`<p>Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log('Error sending email: ', error);    
            if (callback) callback(error, null);
        }else{
            console.log('Password reset email sent: ', info.response);
            if(callback) callback(null, info.response);
        }
    });
};

export default { sendMail, 
    transporter,};