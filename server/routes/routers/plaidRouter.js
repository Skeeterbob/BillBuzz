import express from 'express';
import { User } from '../../objectPack.js'
import {dbHandler, plaidHandler} from "../../handlers.js";

const plaidRouter = express.Router();

plaidRouter.get('/', (req, res)=>{

});

// This route takes a unique userId from the front-end and sends a request to
// the plaid API to generate a link token and return the response to the
// front-end
plaidRouter.post('/getLinkToken', async(req,res)=>{
    try{
        const linkToken = await plaidHandler.linkAccount(req.body.userId);
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
    const email = req.body.email;
    if (!publicToken || !email) {
        return res.status(400).send({"error":'email and publicToken fields are required'});
    }

    try {
        // send request to plaid API to get the accessToken associated with the
        // new account link.
        // Bryan Hodgins wrote the fir 4 lines here. Everything else was added later.
        const user = await dbHandler.getUser(email);
        const response = await plaidHandler.completeLink(publicToken);
        const accessToken = response.accessToken;

        const accounts = await plaidHandler.getAccounts(accessToken);
        let date = new Date();
        const endDate = date.toLocaleString('en-CA').split(",")[0].toString();

        date.setMonth(date.getMonth() - 1);
        const startDate = date.toLocaleString('en-CA').split(",")[0].toString();

        let newUserData = JSON.parse(user.toJSONString());
        for (const account of accounts) {
            let newAccount = {
                id: account['account_id'],
                name: account['name'],
                balance: account['balances']['current'],
                transactionList: {
                    transactionList: [],
                    length: 1,  // should be 0?
                    beginDate: startDate,
                    endDate: endDate
                },
                accessToken: accessToken
            };

            const transactionsResult = await plaidHandler.getTransactions(accessToken, [account['account_id']], startDate, endDate);
            const transactions = transactionsResult.transactions;

            newAccount.transactionList.length = transactions.length;
            for (const transaction of transactions) {
                newAccount.transactionList.transactionList.push({
                    amount: transaction.amount,
                    date: transaction.date,
                    subscriptionName: transaction.name ? transaction.name : 'Unknown',
                    //TODO: Figure out how to know if a transaction is a subscription
                    subscriptionBool: true,
                    vendor: transaction.merchant_name ? transaction.merchant_name : 'Unknown'
                });
            }

            newUserData.accountList.push(newAccount);
        }

        await dbHandler.updateUser(newUserData.email, new User(newUserData))
        res.status(200).json({status: 'success', user: newUserData});
    }
    catch (error) {
        // handle error
        res.status(500).json({status: 'failure'});
        console.log(error);
    }
});

//Lines 98-145 by Raigene (commit #598eda7)
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

//Methods to access the users credit cards transactions
//By Raigene Cook
plaidRouter.post('/linkCreditCardAccount', async (req,res) => {
    const accessToken = req.body.accessToken;
    const userId = req.body.userId;
    try {
        const response = await plaidHandler.linkCreditCardAccount(userId, accessToken);
        res.json(response);
    }
    catch (error) {
        // handle error for linkCreditCardAccount
        console.error('Retreving Credit Card Info error:', error);
        throw error;
    }
});


plaidRouter.post('/getCreditCardInfo', async (req,res) => {
    const accessToken = req.body.accessToken;
    try {
        const response = await plaidHandler.getCreditCardInfo(accessToken);
        res.json(response);
    }
    catch (error) {
        // handle error for getCreditCardInfo
        console.error('Retreving Credit Card Info error:', error);
        throw error;
    }
});

//Method to get the transactions from the credit card
plaidRouter.post('/getCreditCardTransactions', async (req,res) => {
    const accessToken = req.body.accessToken;
    const accountId = req.body.accountId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
        const response = await plaidHandler.getCreditCardTransactions(accessToken, accountId, startDate, endDate);
        res.json(response);
    }
    catch (error) {
        // handle error for getCreditCardTransactions
        console.error('Retreving Credit Card Transactions error:', error);
        throw error;
    }
});

//Method to get the recurring credit card transactions 
plaidRouter.post('/getCreditCardRecurringTransactions', async (req,res) => {
    const accessToken = req.body.accessToken;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
        const response = await plaidHandler.getCreditCardRecurringTransactions(accessToken, startDate, endDate);
        res.json(response);
    }
    catch (error) {
        // handle error for getCreditCardRecurringTransactions
        console.error('Retreving Credit Card Recurring Transactions error:', error);
        throw error;
    }
});

export {plaidRouter};