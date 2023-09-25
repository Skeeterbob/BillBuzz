import express from 'express';
//import {loginRouter} from './routers/loginRouter.js';
import { DBHandler } from '../../dBHandler.js';
const registerRouter = express.Router();

registerRouter.post('/register', async(req, res)=>
{
 try{
 
    //Request users' information
    const {email, password} = req.body;

    const newUser = new User({email, password});
    await newUser.save();

    res.status(200).json({message: 'Registered Successfully'});
 }
 catch(error){
    console.err(error);
    res.status(200).json({error:'Registration Error'});
 }
});

export {registerRouter};