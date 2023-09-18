import express from 'express';
import { TwilioHandler } from './twilioHandler.js';
const loginRouter = express.Router();
const twilioHandler = new TwilioHandler();

export {loginRouter};