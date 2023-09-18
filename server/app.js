import express from 'express';
import appInit from './routes/routes';

const port = process.env.PORT || 3000;
const app = express();
appInit(app);


app.listen(port, function(err) {
   if(err) console.log(`Server NOT connected!`)
    console.log(`Server started on port ${port}`);
  });