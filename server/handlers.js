import {DBHandler} from "./dBHandler.js";
import {TwilioHandler} from "./twilioHandler.js";

let dBHandler;
let twilioHandler;

async function initHandlers() {
    dBHandler = new DBHandler();
    twilioHandler = new TwilioHandler();

    await dBHandler.init();
    await twilioHandler.init();
}

export {
    initHandlers,
    dBHandler,
    twilioHandler
}