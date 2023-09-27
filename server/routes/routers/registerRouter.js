import express from 'express';
import { AuthHandler } from '../../authHandler.js';
import { DBHandler } from '../../dBHandler.js';
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

    const newUser = new User({email, password});
    await newUser.save();
 
    res.status(200).json({message: 'Registered Successfully'});
 }
 catch(error){
    console.err(error);
    res.status(400).json({error:'Registration Error'});
 }*/
});



registerRouter.post('/createUser', async (req, res) => {
   try {
      let user = new user(req.body);
      console.log(user);
      const result = await DBHandler.insertUser(user);
      console.log(result);
      res.status(200).json(result);
   }
   catch (err) {
      console.log(err);
      res.status(400).json({error:"/register/createUser endpoint error"})
   }
})

registerRouter.post('/getUser', authHandler.validateToken, async(req, res) => {
   try {
      console.log(req.body)
      const result = await DBHandler.getUser(req.body.email);
      console.log(result.toJSONString());
      res.status(200).json(result);
   }
   catch (err) {
      console.log(err);
      res.status(400).json({error:"/register/createUser endpoint error"})
   }
})

export {registerRouter};