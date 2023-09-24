const {TwilioHandler} = require('./twilioHandler.js');
const readline = require('readline')

//load environment variables from .env
require('dotenv').config();




/*test('sending SMS code and verify code', async () => {   
    const twilioHandler = new TwilioHandler();
    await twilioHandler.init().then(async () =>{
        console.log(process.env.TEST_PHONE);
        await twilioHandler.sendSMS(process.env.TEST_PHONE).then(async verification => {
            expect(await verification.status).toBe("pending");
        })
    })   
}, 10000)*/

//create an interface for input and output operations
/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
let userInput = "";
            rl.question("Enter Verification Code: ", function(string){
                console.log(string);
                userInput = string;
                rl.close();
            })*/