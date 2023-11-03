import { PlaidHandler } from "./plaidHandler";
import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
dotenv.config();

//Test case authored by Bryan Hodgins

// create PlaidHandler object and initialize
const plaidHandler = new PlaidHandler();
plaidHandler.init();


test('retrieve a link token from plaidhandler.linkAccount', async () =>{
    const response = await plaidHandler.linkAccount("1234567");
    console.log(response);
})

test('create a test access token and retrieve data', async () => {
    const publicToken = await testTokenCreate();
    const accessToken = await plaidHandler.completeLink(publicToken);
    console.log(accessToken);
    const accounts = await plaidHandler.getAccounts(accessToken.accessToken);
})

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
        initial_products: ['auth'],
    };

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