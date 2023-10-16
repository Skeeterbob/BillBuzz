import express from 'express';
import { PlaidHandler } from '../../plaidHandler.js';
import { User } from '../../objectPack.js'

const plaidRouter = express.Router();
const plaidHandler = new PlaidHandler();
plaidHandler.init();

plaidRouter.get('/', (req, res)=>{

});

// This route takes a unique userId from the front-end and sends a request to
// the plaid API to generate a link token and return the response to the 
// front-end
plaidRouter.post('/getLinkToken', async(req,res)=>{
    try{
        const linkToken = await PlaidHandler.linkAccount(req.body.userId);

        //sends response to frontend
        res.json(linkToken);
    }catch(error){
        console.error('Link Account Error!:', error);
        res.status(500).json({error:'Server Error'});
    }
});

// This route takes the public token from the front-end that was generated
// by the plaid link interface and exchanges that for an access token.
// This route will add a new Account to the user's profile on the database
// and return the new user data as well. The front-end will be responsible for
// getting account details from the user and updating the user if there are 
// changes made to the account details such as account name.
plaidRouter.post('/getAccessToken', async (req,res) => {
    const publicToken = req.body.publicToken;
    const user = new User(req.body.user);
    try {
        // send request to plaid API to get the accessToken associated with the
        // new account link.
        const response = await plaidHandler.completeLink(publicToken);

        const accessToken = response.data.access_token;
        const itemID = response.data.item_id;
        // need to create new account on the user object and call dbHandler to
        // update the user with the new information.
        res.json({ getAccessToken: 'complete'});
    }
    catch (error) {
        // handle error
    }
})

plaidRouter.post('/getTransactions', async (req,res) => {
    const accessToken = req.body.accessToken;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
        const response = await plaidHandler.getTransactions(accessToken, startDate, endDate);
        res.json(response);
    }
    catch (error) {
        // handle error for getTransactions
        console.error('Retreving Transactions error:', error);
        throw error;
    }
});

plaidRouter.post('/getrecurringTransactions', async (req,res) => {
    const accessToken = req.body.accessToken;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
        const response = await plaidHandler.getRecurringTransactions(accessToken, startDate, endDate);
        res.json(response);
    }
    catch (error) {
        // handle error for getRecurringTransactions
        console.error('Retreving Recurring Transactions error:', error);
        throw error;
    }
});

//method to get sync transactions from plaid to the database
plaidRouter.post('/syncTransactions', async (req,res) => {
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const accessToken = req.body.accessToken;
    try {
        const response = await plaidHandler.syncTransactions(userId, startDate, endDate, accessToken);
        res.json(response);
    }
    catch (error) {
        // handle error for syncTransactions
        console.error('Syncing Transactions error:', error);
        throw error;
    }
});

export {plaidRouter};