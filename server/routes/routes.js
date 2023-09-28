import express from 'express';
import {indexRouter} from './routers/indexRouter.js';
import {dBRouter} from './routers/dBRouter.js';
import {loginRouter} from './routers/loginRouter.js';
import {plaidRouter} from './routers/plaidRouter.js';
import {registerRouter} from './routers/registerRouter.js';
import pkg from 'body-parser';

const app = express();
const bodyParser = pkg;
const port = process.env.PORT || 3000; 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
