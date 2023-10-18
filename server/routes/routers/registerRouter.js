import express from 'express';
import { AuthHandler } from '../../authHandler.js';
import { DBHandler } from '../../dBHandler.js';
import { User } from '../../objectPack.js';
const registerRouter = express.Router();
const authHandler = new AuthHandler();
const dbHandler = new DBHandler();
dbHandler.init();

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