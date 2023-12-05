import dotenv from 'dotenv';
import Twilio from 'twilio';

//load environment variables from .env
dotenv.config('../.env');

const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);


// Need to call and await init after instantiating object.
class TwilioHandler {
    #serviceSid;
    // init function authored by Raigene Cook
    init () {
        return new Promise((resolve, reject) => {
            client.verify.v2.services
            .create({friendlyName: 'BillBuzz service'})
            .then(service => {this.#serviceSid = service.sid; 
                resolve();
            });
        })
    }
    // sendSMS function authored by Bryan Hodgins
    sendSMS (phNum) {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(this.#serviceSid)
                .verifications
                .create({to: phNum, channel: 'sms'})
                .then(async verification => {
                    console.log(verification);
                    resolve(verification);
                });     
        })             
    }
    //function to return true for a positive validation of the SMS code
    //or false for an invalid sms code entry
    // validate SMSCode authored by Bryan Hodgins
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