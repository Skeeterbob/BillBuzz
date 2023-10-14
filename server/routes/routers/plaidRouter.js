import express from 'express';
import { PlaidHandler } from '../../plaidHandler.js';
const plaidRouter = express.Router();

plaidRouter.get('/plaid', (req, res)=>{

});
plaidRouter.post('/plaid/linkAccount', async(req,res)=>{
    try{
        const {userAccessToken, institutionId} = req.body;

        const linkToken = await PlaidHandler.linkAccount(userAccessToken, institutionId);

        //sends responce to frontend
        res.json({link_token: linkToken});
    }catch(error){
        console.error('Link Account Error!:', error);
        res.status(500).json({error:'Server Error'});
    }
});


export {plaidRouter};