import express from 'express';
import { MongoClient } from 'mongodb';
import { appInit } from '../routes.js';
const dBRouter = express.Router();


dBRouter.get('/db', (req, res) => {
    res.send()
});


export {dBRouter};