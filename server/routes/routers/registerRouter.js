import express from 'express';
import { AuthHandler } from '../../authHandler.js';
import { DBHandler } from '../../dBHandler.js';
import { User } from '../../objectPack.js';
const registerRouter = express.Router();
const authHandler = new AuthHandler();
const dbHandler = new DBHandler();
dbHandler.init();
authHandler.init();



registerRouter.post('/', async(req, res)=>
{
 /*try{
 
    //Request users' information
    const {email, password} = req.body;

    const  = new User({email, password});
    await newUser.save();
 
    res.status(200).json({message: 'Registered Successfully'});
 }
 catch(error){
    console.err(error);
    res.status(200).json({error:'Registration Error'});
 }
});

export {registerRouter};