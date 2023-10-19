import {DBHandler} from "./dBHandler.js";
import {TwilioHandler} from "./twilioHandler.js";
import { PlaidHandler } from "./plaidHandler.js";

let dbHandler;
let twilioHandler;
let plaidHandler;

async function initHandlers() {
    dbHandler = new DBHandler();
    twilioHandler = new TwilioHandler();
    plaidHandler = new PlaidHandler();

    await dbHandler.init();
    await twilioHandler.init();
    await plaidHandler.init();
}

export {
    initHandlers,
    dbHandler,
    twilioHandler,
    plaidHandler
}