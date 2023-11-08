import { PlaidHandler } from "./plaidHandler";
import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
dotenv.config();

//Test case authored by Bryan Hodgins

// create PlaidHandler object and initialize
const plaidHandler = new PlaidHandler();
plaidHandler.init();


test('retrieve a link token from plaidhandler.linkAccount', async () =>{
    const response = await plaidHandler.linkAccount("12345678910");
    console.log(response);
})

test('create a test access token, retrieve data, and trigger webhook', async () => {
    const publicToken = await testTokenCreate();
    const accessToken = await plaidHandler.completeLink(publicToken);
    const accounts = await plaidHandler.getAccounts(accessToken.accessToken);
    const webhookRes = await triggerTransactionWebhook(accessToken.accessToken);
    console.log(await webhookRes.data);
})

async function triggerTransactionWebhook (accessToken) {
     // create a test access token with the sandbox public token
        const configuration = new Configuration({
            basePath: PlaidEnvironments.sandbox,
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                    'PLAID-SECRET': process.env.PLAID_SECRET,
                }
            }
        });

        const client = new PlaidApi(configuration);
    // Fire a DEFAULT_UPDATE webhook for an Item
    const request = {
      access_token: accessToken,
      webhook_code: 'SYNC_UPDATES_AVAILABLE',
    };
    try {
      const response = await client.sandboxItemFireWebhook(request);
      return response;
    } catch (error) {
      console.log(error.response.data);
    }
}

async function testTokenCreate () {
    // create a test access token with the sandbox public token
    const configuration = new Configuration({
        basePath: PlaidEnvironments.sandbox,
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
            }
        }
    });

    const client = new PlaidApi(configuration);

    // Request to create the sandbox public token
    const publicTokenRequest = {
        institution_id: 'ins_109508',
        initial_products: ['auth', 'transactions'],
        options: {webhook: process.env.WEBHOOK_URL},
    };
    console.log(publicTokenRequest);

    // perform request
    try {
    const publicTokenResponse = await client.sandboxPublicTokenCreate(
        publicTokenRequest,
    );

    const publicToken = publicTokenResponse.data.public_token;
    // The generated public_token can now be exchanged
    // for an access_token

    // const exchangeRequest = {
    //     public_token: publicToken,
    // };

    // const exchangeTokenResponse = await client.itemPublicTokenExchange(
    //     exchangeRequest,
    // );

    // const accessToken = exchangeTokenResponse.data.access_token;
    // console.log('public token: ', publicToken);
    // console.log('access token: ', accessToken);
    return publicToken;
    } 
    catch (error) {
    // handle error
    }
}