import express from 'express';
import {appInit} from './routes/routes.js';

const port = process.env.PORT || 3000;
const app = express();
appInit(app);

app.get('/',(req, res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
}
);

app.listen(port, function(err) {
   if(err) {
    console.log(`Server NOT connected!`)
   }
   else {
    console.log(`Server started on port ${port}`);
   }
});
