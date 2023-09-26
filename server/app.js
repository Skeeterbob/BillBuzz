import express from 'express';
import {appInit} from './routes/routes.js';
import {initHandlers} from "./handlers.js";

const port = process.env.PORT || 3000;
const app = express();

await initHandlers();
appInit(app);

app.post('/',(req, res)=>{
  res.send("You have connected")
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
