import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

//load environment variables from .env
dotenv.config('../.env');

class PlaidHandler {
    #client;

    constructor(){
        this.client = null;
    }

    // Function to instantiate the plaid client
    async init(){
        try{
        //create the endpoints for authentication
        const configuration = new Configuration({
            basePath: PlaidEnvironments.sandbox,
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                    'PLAID-SECRET': process.env.PLAID_SECRET,
                },
            },
        });
   
        this.#client = new PlaidApi(configuration);

        return 'Plaid initilaized successfully';

        }catch(error){
            console.error('Plaid initilaization failed:', error);
            throw error;
        }
   }

   //Method to generate a link token to be used on the front end to 
   //authenticate the Plaid account link interface
   //needs a user id (mongoDB id)
    async linkAccount(userId){
        try {

            // makes sure the client exists. Might be able to perform
            // better validation here.
            if(!this.#client){
                throw new Error('Plaid is not initialized');
            }

            //could add better validation here
            if(!userId){
            throw new Error('Must enter Access Token or institution ID ');
            }

            //Create link token by providing a unique user id
            const linkAccountResponse = await this.#client.linkTokenCreate({
                user:{
                    client_user_id: userId,
                },
                client_name: 'BillBuzz service',
                products:['auth', 'transactions'],
                country_codes:['US'],
                language: 'en',
            });

            return linkAccountResponse.data;
        } 
        catch(error){
            console.error('Plaid linkAccount error:', error);
            throw error;
        }
    }

    async completeLink(publicToken){
        try {
            const response = await this.#client.itemPublicTokenExchange({
                public_token: publicToken,
            });
            return {accessToken: response.data.access_token,
                itemId: response.data.item_id}
        }
        catch (error) {
            // handle error using PLaidAPI specific error handeling
            if(error.response && error.response.data){
                const plaidError = error.response.data;

                if(plaidError.INVALID_INPUT === 'Invalid Input'){
                    return{error:'Invalid input, check your input'};
                }else{
                    return{error:'Plaid API error. Please try again.'};
                }
            }
            console.error('Plaid completeLink error:', error);

                return{error:'An error occurred while completing the link process.'};
        }
    }
};

export {PlaidHandler};



