import express from 'express';
const plaidRouter = express.Router();

plaidRouter.get('/plaid', (req, res)=>{
req.get()
    res.send("Accessing Plaid for account information")
});

export {plaidRouter};