import express from 'express';
//import {loginRouter} from './routers/loginRouter.js';
import { DBHandler } from '../../dBHandler.js';
import { User } from '../../objectPack.js';
const registerRouter = express.Router();
const dBHandler = new DBHandler();
dBHandler.init()
/*registerRouter.post('/', async(req, res)=>
{
 try{
 
    //Request users' information
    const {email, password} = req.body;

    //const  = new User({email, password});
    await newUser.save();

    res.status(200).json({message: 'Registered Successfully'});
 }
 catch(error){
    console.log(error);
    res.status(200).json({error:'Registration Error'});
 }
});*/

registerRouter.post('/createUser', async(req, res) => {
   try {
      let user = new User({...req.body});
      const result = await dBHandler.insertUser(user);
      console.log(result);
      res.status(200).json(result);
   }
   catch (err) {
      console.log(err);
      res.status(400).json({error:"/register/createUser endpoint error"})
   }
})

registerRouter.post('/getUser', async(req, res) => {
   try {
      const result = await dBHandler.getUser(req.body.email);
      res.status(200).json(JSON.parse(result.toJSONString()));
   }
   catch (err) {
      console.log(err);
      res.status(400).json({error:"/register/createUser endpoint error"})
   }
})

registerRouter.post('/updateUser', async(req, res) => {
   try {
      let user = new User(req.body);
      console.log(user);
      const result = await dBHandler.updateUser(user);
      console.log(result);
      res.status(200).json(result);
   }
   catch (err) {
      console.log(err);
      res.status(400).json({error:"/register/createUser endpoint error"})
   }
})

export {registerRouter};