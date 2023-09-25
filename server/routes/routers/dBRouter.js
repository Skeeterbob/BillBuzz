import express from 'express';
import { DBHandler } from '../../dBHandler.js';
const dBRouter = express.Router();


dBRouter.get('/getUser', async (req, res) => {
  try{
    const data = await DBHandler.getUser();
    res.json(data);
  }
  catch(error){
    console.error(error);
    res.status(400).json({error:'Server Error'});
  }
});

dBRouter.post('/addUser', async(req,res)=>{
    try{
        const insertUser = await DBHandler.insertUser();
        res.status(200).json({message:'User added Successfully'});

    }
    catch(error){
    console.error(error);
    res.status(400).json({error:'Sever Error'});
    }
});

/*DBHandler.delete('/deleteUser/id', async (req, res)=>{
    try{
        const id = req.params.id;
        await DBHandler.deleteUser(id);
        res.status(200).json({message: 'User Deleted Successully'});

    }
    catch(error){
        console.error(error);
        res.status(400).json({error:'Server Error'});
    }
});*/

export {dBRouter};