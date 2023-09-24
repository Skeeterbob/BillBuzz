import express from 'express';
import {indexRouter} from './routers/indexRouter.js';
import {dBRouter} from './routers/dBRouter.js';
import {loginRouter} from './routers/loginRouter.js';
import {plaidRouter} from './routers/plaidRouter.js';

function appInit (app) {
    app.use(express.json());

    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/plaid', plaidRouter);
    app.use('/db', dBRouter);
};

export {appInit};