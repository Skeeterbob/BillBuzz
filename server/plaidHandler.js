import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

//load environment variables from .env
dotenv.config('../.env');

class PlaidHandler {
    constructor(){
        this.client = null;
        this.linkToken = null;
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
   
        this.client = new PlaidApi(configuration);

        return 'Plaid initilaized successfully';

        }catch(error){
            console.error('Plaid initilaization failed:', error);
            throw error;
        }
   }

   //Method to link accounts through Plaid
    async linkAccount(userAccessToken, institutionId){
        try {
            if(!this.client){
                throw new Error('Plaid is not initialized');
            }

            if(!userAccessToken || !institutionId){
            throw new Error('Must enter Access Token or institution ID ');
            }

            //Create link token
            const linkAccountResponse = await this.client.linkTokenCreate({
                user:{
                    client_user_id: userAccessToken,
                },
                client_name: 'BillBuzz service',
                products:['auth', 'transactions'],
                country_codes:['US'],
                language: 'en',
                institution_id: institutionId,
            });

            return linkAccountResponse.data.link_token;
        } 
        catch(error){
            console.error('Plaid linkAccount error:', error);
            throw error;
        }
   }

   async completeLink(){

   }
};

export {PlaidHandler};



