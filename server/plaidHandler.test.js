import { PlaidHandler } from "./plaidHandler";

const plaidHandler = new PlaidHandler();
plaidHandler.init();

test('retrieve a link token from plaidhandler.linkAccount', async () =>{
    const response = await plaidHandler.linkAccount("1234567");
    console.log(response);
})