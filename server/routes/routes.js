import express from express;
import indexRouter from './routers/indexRouter';
import dBRouter from './routers/dBRouter';
import loginRouter from './routers/loginRouter';
import plaidRouter from './routers/plaidRouter';

function appInit (app) {
    app.use(express.json());

    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/plaid', plaidRouter);
    app.use('/db', dBRouter);
};

export {appInit};