//Authored By Bryan Hodgins Originally
import express from 'express';
import {appInit} from './routes/routes.js';
import pkg from 'body-parser'
import {initHandlers} from "./handlers.js"; // Hadi Added this
const bodyParser = pkg;
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
await initHandlers(); //Hadi added this
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
