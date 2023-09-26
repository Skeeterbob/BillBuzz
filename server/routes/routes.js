import express from 'express';
import {indexRouter} from './routers/indexRouter.js';
import {dBRouter} from './routers/dBRouter.js';
import {loginRouter} from './routers/loginRouter.js';
import {plaidRouter} from './routers/plaidRouter.js';
import {registerRouter} from './routers/registerRouter.js';

const app = express();
const port = process.env.PORT || 3000; 


//buggy 
function appInit (app) {
    //app.use(express.json());

    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/plaid', plaidRouter);
    app.use('/db', dBRouter);
    app.use('/register', registerRouter);

};

export {appInit};
