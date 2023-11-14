import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

//load environment variables from .env
dotenv.config();

class PlaidHandler {
    #client;

    constructor(){
        this.client = null;
    }

    // Function to instantiate the plaid client
    // init  function authored by Raigene Cook
    async init(){
        try{
        //create the endpoints for authentication
        const configuration = new Configuration({
            basePath: PlaidEnvironments.development,
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
   // Authored by Raigene Cook, Modified by Bryan Hodgins
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
            // Bryan Hodgins modified the next section (9 lines) as part of debugging.
            const linkAccountResponse = await this.#client.linkTokenCreate({
                user:{
                    client_user_id: userId,
                },
                client_name: 'BillBuzz service',
                products:['auth', 'transactions'],
                country_codes:['US'],
                language: 'en',
                webhook: process.env.WEBHOOK_URL,
            });

            return linkAccountResponse.data;
        } 
        catch(error){
            console.error('Plaid linkAccount error:', error);
            throw error;
        }
    }
    // Bryan Hodgins authored the completeLink function
    async completeLink(publicToken){
        try {
            const response = await this.#client.itemPublicTokenExchange({
                public_token: publicToken,
            });
            return {accessToken: response.data.access_token,
                itemId: response.data.item_id}
        }
        catch (error) {
            // handle error using PlaidAPI error codes
            if(error.response && error.response.data){
                const plaidError = error.response.data;

                if(plaidError.INVALID_INPUT === 'Invalid Input'){
                    return{error:'Invalid input, check your input'};
                }else{
                    return{error:'Plaid API error. Please try again.'};
                }
            }
            console.error('Plaid completeLink error:', error);
            throw error;
        }
    }

//Method to get transactions from plaids API
    async getTransactions(accessToken, accountIds, startDate, endDate){
        try{
            const response = await this.#client.transactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate,
                options: {
                    account_ids: accountIds
                }
            });
            return response.data;
        }
        catch(error){
            //handle error 
            console.error('Plaid getTransactions error:', error);
            throw error;
        }
    }

//Method to get recurring transactions from plaids API
// TODO: This does not seem functional. 
    async getRecurringTransactions(accessToken, startDate, endDate){
        try{
            const response = await this.#client.transactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate
            });
            return response.data;
        }
        catch(error){
            //handle error
            console.error('Plaid getRecurringTransactions error:', error);
            throw error;
        }
    }

    //a method to sync transactions from plaid to the database
    // This also does not seem functional in its current state.
    async syncTransactions(userId, startDate, endDate, accessToken){
        try{
            //get transactions from plaid
            const transactions = await this.getTransactions(accessToken, startDate, endDate);
            //get recurring transactions from plaid
            const recurringTransactions = await this.getRecurringTransactions(accessToken, startDate, endDate);
            //return the transactions and recurring transactions
            return {transactions, recurringTransactions};
        }
        catch(error){
            console.error('Syncing Transactions error:', error);
            throw error;
        }
    }

//Method to delete the plaid account
    async deleteAccount(accessToken){
        try{
            return await this.#client.itemRemove({
                access_token: accessToken,
            });
        }
        catch(error){
            console.error('Plaid deleteAccount error:', error);
            throw error;
        }
    }

    async getAccounts(accessToken) {
        const request = {
            access_token: accessToken,
        };
        try {
            const response = await this.#client.accountsGet(request);
            return response.data.accounts;
        }
        catch (error) {
            //error handling
        }
    }

    //Authored by Bryan Hodgins, Source: Plaid docs.
    async handleItemWebhook(requestBody, io) {
        const {
          webhook_code: webhookCode,
          item_id: plaidItemId,
          error,
        } = requestBody;
      
        const serverLogAndEmitSocket = (additionalInfo, itemId, errorCode) => {
          console.log(
            `WEBHOOK: ITEMS: ${webhookCode}: Plaid item id ${plaidItemId}: ${additionalInfo}`
          );
          // use websocket to notify the client that a webhook has been received and handled
          if (webhookCode) io.emit(webhookCode, { itemId, errorCode });
        };
      
        switch (webhookCode) {
          case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
            serverLogAndEmitSocket('is updated', plaidItemId, error);
            break;
          case 'ERROR': {
            itemErrorHandler(plaidItemId, error);
            const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
            serverLogAndEmitSocket(
              `ERROR: ${error.error_code}: ${error.error_message}`,
              itemId,
              error.error_code
            );
            break;
          }
          case 'PENDING_EXPIRATION': {
            const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
            await updateItemStatus(itemId, 'bad');
            serverLogAndEmitSocket(
              `user needs to re-enter login credentials`,
              itemId,
              error
            );
            break;
          }
          default:
            serverLogAndEmitSocket(
              'unhandled webhook type received.',
              plaidItemId,
              error
            );
        }
    };

    //handleTransaction Webhook authored by Bryan Hodgins.
    async handleTransactionWebhook (requestBody) {
        const {
          webhook_code: webhookCode,
          item_id: plaidItemId,
        } = requestBody;
      
        const serverLogAndEmitSocket = (additionalInfo, itemId) => {
          console.log(
            `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
          );
          // use websocket to notify the client that a webhook has been received and handled
          //if (webhookCode) io.emit(webhookCode, { itemId });
        };
      
        switch (webhookCode) {
          case 'SYNC_UPDATES_AVAILABLE': {
            // Fired when new transactions data becomes available.
            // plaidItemId is used to access the plaid item to be updated.
//            const {
//              addedCount,
//              modifiedCount,
//              removedCount,
//            } = await updateTransactions(plaidItemId);
//            const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
            //serverLogAndEmitSocket(`Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed`, itemId);
            const url = 'https://onesignal.com/api/v1/notifications';
            console.log(url);
            const options = {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                Authorization: "Basic " + process.env.ONESIGNAL_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                included_segments: ['All'],
                app_id: process.env.ONESIGNAL_APP_ID,
                contents: {en: 'English or Any Language Message', es: 'Spanish Message'},
                name: 'Plaid Webhook Notification'
              })
            };

            fetch(url, options)
              .then(res => res.json())
              .then(json => console.log('fetch response', json))
              .catch(err => console.error('error:' + err));
            break;
          }
          case 'DEFAULT_UPDATE':
          case 'INITIAL_UPDATE':
          case 'HISTORICAL_UPDATE':
            /* ignore - not needed if using sync endpoint + webhook */
            break;
          default:
            serverLogAndEmitSocket(`unhandled webhook type received.`, plaidItemId);
        }
    };
}



export {PlaidHandler};



