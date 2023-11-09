//Authored By Bryan Hodgins Originally
import express from 'express';
import {appInit} from './routes/routes.js';
import pkg from 'body-parser'
import {initHandlers} from "./handlers.js";
import forever from 'forever-monitor';

const bodyParser = pkg;
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

await initHandlers(); //Hadi added this
appInit(app);

//spawn queue worker process to run as long as the server is up
var child = new (forever.Monitor)('./queueWorker.js')
child.start();

app.post('/',(req, res)=>{
  res.send("You have connected")
}
);
//Lines 19-23 by Raigene(Commit #74d10f8)
app.listen(port, function(err) {
   if(err) {
    console.log(`Server NOT connected!`)
   }
   else {
    console.log(`Server started on port ${port}`);
   }
});
