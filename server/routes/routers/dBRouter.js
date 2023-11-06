import express from 'express';

const dBRouter = express.Router();

//Lines 5-41 by Raigene (commit #4ced5d6)
dBRouter.get('/getUser', async (req, res) => {
  try{
    const data = await dbHandler.getUser();
    res.json(data);
  }
  catch(error){
    console.error(error);
    res.status(400).json({error:'Server Error'});
  }
});

dBRouter.post('/addUser', async(req,res)=>{
    try{
        const insertUser = await dbHandler.insertUser();
        res.status(200).json({message:'User added Successfully'});

    }
    catch(error){
    console.error(error);
    res.status(400).json({error:'Sever Error'});
    }
});




export {dBRouter};