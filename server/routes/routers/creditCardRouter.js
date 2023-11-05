//By Raigene Cook
import plaid from 'plaid';
import express from 'express';
import {plaidHandler} from '../../handlers.js';


// method to link token from plaid
creditCardRouter.post('/getlinkToken', async (req,res) => {
    const publicToken = req.body.publicToken;
    try {
        const response = await plaidClient.exchangePublicToken(publicToken);
        res.json(response);
    }
    catch (error) {
        // handle error for exchangePublicToken
        console.error('Retreving Access Token error:', error);
        throw error;
    }
});

//Method to get the access token from plaids credit card users 
//This method updates users profiles to include account information
// By Raigene Cook followed the same style for linking debit card
creditCardRouter.post('/getAccessToken', async (req,res) => {
    const publicToken = req.body.publicToken;4
    const email = req.body.email;
    if (!publicToken || !email) {
        return res.status(400).send({ "error": 'Token and email fields are required' });
    }

    try {

        const user = await dbHandler.getUser(email);
        if (!user) {
            return res.status(404).send({ "error": 'User not found' });
        }
        const response = await plaidHandler.getAccessToken(publicToken);
        res.json(response);

        const accounts = await plaidHandler.getCreditCardInfo(response.accesstoken);
       let date = new Date();
        const endDate = date.toLocaleString('en-CA').split(",")[0].toString();

        let newUserData = JSON.parse(user.toJSONString());
        for (const account of accounts) {
            let newAccount = {
                id: account['account_id'],
                name: account['name'],
                balance: account['balances']['current'],
                transactionList: {
                    transactionList: [],
                    length: 1,
                    startDate: startDate,
                    endDate: endDate
                },
                accessToken: accessToken
            };

            const transactionsResult = await plaidHandler.getCreditCardTransactions(accessToken, account['account_id'], startDate, endDate);
            const transactions = transactionsResult.transactions;

            newAccount.transactionList.length = transactions.length;
            for (const transaction of transactions) {
                newAccount.transactionList.transactionList.push({
                    amount: transaction.amount,
                    date: transaction.date,
                    subscriptionName: transaction.name ? transaction.name : 'Unknown',

        });
    }
        newUserData.accountList.push(newAccount);
    }
     
        await dbHandler.updateUser(newUserData.email, new User(newUserData))
        res.status(200).json({ status: 'success', user: newUserData });
              

    }
    catch (error) {
        // handle error for getAccessToken
        console.error('Retreving Access Token error:', error);
        throw error;
    }
});


//Method that takes the access token and returns the credit card info
// this method adds this new credit card info to the users profile in the database
//this method updates the users names if they have changed
// By Raigene Cook
creditCardRouter.post('/linkCreditCardAccount', async (req,res) => {
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


creditCardRouter.post('/getCreditCardInfo', async (req,res) => {
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
creditCardRouter.post('/getCreditCardTransactions', async (req,res) => {
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
creditCardRouter.post('/getCreditCardRecurringTransactions', async (req,res) => {
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

export {creditCardRouter};
