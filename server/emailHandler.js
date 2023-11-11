import {config} from 'dotenv';
import sgMail from '@sendgrid/mail';

config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, from, subject, text) => {
    try{
        const msg = {
            to: to,
            from: from,
            subject: subject,
            text: text,
        };
        return sgMail.send(msg);


    }catch(error){
        console.log(error);
    }


};



export default sendEmail;