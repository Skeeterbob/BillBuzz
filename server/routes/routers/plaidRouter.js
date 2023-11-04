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
        return res.status(400).send({"error": 'email and publicToken fields are required', success: false});
    }

    try {
        // send request to plaid API to get the accessToken associated with the
        // new account link.
        // Bryan Hodgins wrote the fir 4 lines here. Everything else was added later.




        // Authored by Hadi Ghaddar from line(s) 50 - 102



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
        res.status(200).json({success: true, user: newUserData});
    }
    catch (error) {
        // handle error
        res.status(500).json({success: false});
        console.log(error);
    }
});

// Bryan Hodgins originally authored this endpoint (I think)
// Authored by Raigene Cook from line(s) 106 - 119
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



// Authored by Hadi Ghaddar from line(s) 129 - 169






plaidRouter.post('/getrecurringTransactions', async (req,res) => {
    const accessToken = req.body.accessToken;
    if (!accessToken) {
        return res.status(400).send({error: 'Access token required!'});
    }

    try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0];
        const response = await plaidHandler.getRecurringTransactions(accessToken, startDate, endDate);
        const transactions = response.transactions;

        //Group transactions by their name
        const groupedByName = transactions.reduce((acc, transaction) => {
            (acc[transaction.name] = acc[transaction.name] || []).push(transaction);
            return acc;
        }, {});

        //Minimum number of times this transaction has to show to be considered 'recurring'
        const minOccurrences = 4;
        const potentialRecurring = Object.values(groupedByName).filter(
            transactions => transactions.length >= minOccurrences
        );

        const recurringTransactions = potentialRecurring.map(transactionsOfSameName => {
            let transaction = transactionsOfSameName[0];
            return {
                amount: transaction.amount,
                name: transaction.name,
                vendorName: transaction.merchant_name
            };
        });

        res.status(200).json({transactions: recurringTransactions});
    }
    catch (error) {
        // handle error for getRecurringTransactions
        console.error('Retrieving Recurring Transactions error:', error);
        return res.status(500).send({error: 'Unknown error!'});
    }
});

//method to get sync transactions from plaid to the database
// Authored by Raigene Cook from line(s) 173 - 187
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

plaidRouter.post('/webhookListener', async (req,res) => {
    console.log('Webhook received: ', req);
    res.send({data:'worked post'});

})
// Authored by Hadi Ghaddar from line(s) 196 - 227





plaidRouter.post('/removeAccount', async (req, res) => {
    const accessToken = req.body.accessToken;
    const email = req.body.email;

    if (!accessToken) {
        return res.status(400).json({error: 'Access token is required'});
    }

    if (!email) {
        return res.status(400).json({error: 'User email is required'});
    }

    try {
        const user = await dbHandler.getUser(email);
        const response = await plaidHandler.deleteAccount(accessToken);
        if (response.data.request_id) {
            let newUserData = JSON.parse(user.toJSONString());
            newUserData.accountList = newUserData.accountList.filter(account => account.accessToken !== accessToken);

            await dbHandler.updateUser(newUserData.email, new User(newUserData))
            res.status(200).json({removed: true, user: newUserData});
        }else {
            res.status(500).json({error: 'Failed to unlink account', removed: false});
        }
    } catch (error) {
        res.status(500).json({error: 'Unknown error while unlinking account', removed: false});
    }
});

export {plaidRouter};