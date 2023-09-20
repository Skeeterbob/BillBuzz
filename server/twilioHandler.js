import dotenv from 'dotenv';
dotenv.config('../.env');
const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import Twilio from 'twilio';
const client = Twilio(accountSid, authToken);



class TwilioHandler {
    #serviceSid;
    init () {
        return new Promise((resolve, reject) => {
            client.verify.v2.services
            .create({friendlyName: 'BillBuzz service'})
            .then(service => {this.#serviceSid = service.sid; 
                console.log(this.#serviceSid);
                resolve();
            });
        })
    }
    sendSMS (phNum) {
        return new Promise((resolve, reject) => {
            console.log(this.#serviceSid, 'inSMS')
            client.verify.v2.services(this.#serviceSid)
                .verifications
                .create({to: phNum, channel: 'sms'})
                .then(async verification => {
                    console.log(verification.status);
                    resolve(verification);
                });     
        })             
    }
    //function to return true for a positive validation of the SMS code
    //or false for an invalid sms code entry
    validateSMSCode (phNum, code) {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(this.#serviceSid)
                .verificationChecks
                .create({to: phNum, code: code})
                .then(verification_check => {
                    if(verification_check.status == "approved"){
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                });
        });
    }
}


export {TwilioHandler};