import dotenv from 'dotenv';
dotenv.config('../.env');
import {TwilioHandler} from './twilioHandler.js';
const twilioHandler = new TwilioHandler();
const PORT = 4000;
const app = express();
const express = require('express');
const mongoose = require("mongoose")
//Connect to mongoDB
mongoose.connect('mongodb+srv://eg0547:6GeKD4a76qhbSzb@wsucluster0.3pqwigj.mongodb.net/?retrywrites=true&w=majority');

app.listen(PORT, function(err) {
   if(err) console.log(`Server NOT connected!`)
    console.log(`Server started on port ${PORT}`);
  });



