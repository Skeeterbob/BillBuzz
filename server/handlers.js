import {DBHandler} from "./dBHandler.js";
import {TwilioHandler} from "./twilioHandler.js";
import { PlaidHandler } from "./plaidHandler.js";

let dBHandler;
let twilioHandler;
let plaidHandler;

async function initHandlers() {
    dBHandler = new DBHandler();
    twilioHandler = new TwilioHandler();
    plaidHandler = new PlaidHandler();

    await dBHandler.init();
    await twilioHandler.init();
    await plaidHandler.init();
}

export {
    initHandlers,
    dBHandler,
    twilioHandler,
    plaidHandler
}