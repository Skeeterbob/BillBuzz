import express from 'express';
import { DBHandler } from '../../dBHandler.js';
const registerRouter = express.Router();
const dbHandler = new DBHandler();
dbHandler.init();

registerRouter.post('/', async(req, res)=>
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

registerRouter.post('/createUser', async (req, res) => {
   try {
      result = await dbHandler.insertUser(req.body.user);
      result.then((data) => {
         console.log(data);
      })
   }
   catch (err) {
      res.status(400).json({error:'createUser Error'})
   }
})

export {registerRouter};