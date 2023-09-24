import express from 'express';
import {indexRouter} from './routers/indexRouter.js';
import {dBRouter} from './routers/dBRouter.js';
import {loginRouter} from './routers/loginRouter.js';
import {plaidRouter} from './routers/plaidRouter.js';
import {registerRouter} from './routers/registerRouter.js';
import { TwilioHandler } from '../twilioHandler.js';

const app = express();
const port = process.env.PORT || 3000; 

function appInit (app) {
    app.use(express.json());

    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/plaid', plaidRouter);
    app.use('/db', dBRouter);
    app.use('/register', registerRouter);

};
app.use('/', TwilioHandler);


/*app.listen(port, function(error) {
    if(error) { 
     console.log(`Server NOT connected!`)
   }
   else {
     console.log(`Server started on port ${port}`);
   }
   });*/

export {appInit};
