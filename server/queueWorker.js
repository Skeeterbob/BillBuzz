import { Queue } from './queueHandler.js';
import dotenv from 'dotenv;

if (!process.env.MONGO_CONNECTION){
  dotenv.config();
}

