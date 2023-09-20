const {TwilioHandler} = require('./twilioHandler.js');
const readline = require('readline')

//load environment variables from .env
require('dotenv').config();




test('sending SMS code and verify code', async () => {
    //create an interface for input and output operations
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const twilioHandler = new TwilioHandler();
    await twilioHandler.init().then(async () =>{
        console.log(process.env.TEST_PHONE);
        await twilioHandler.sendSMS(process.env.TEST_PHONE).then(async verification => {
            //NEED TO ADD THE USER INPUT HERE TO RUN VALIDATION OF SMS CODE!********************************
            let userInput = "";
            rl.question("Enter Verification Code: ", function(string){
                console.log(string);
                userInput = string;
                rl.close();
            })
            console.log(userInput, '2');
            await twilioHandler.validateSMSCode(process.env.TEST_PHONE, userInput).then(async response => {
                console.log(response);
                expect(await response).toBe(true);
            });            
        })
    })   
}, 120000)

    
    
