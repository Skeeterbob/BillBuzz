import { Queue } from './queueHandler.js';
import dotenv from 'dotenv;

if (!process.env.MONGO_CONNECTION){
  dotenv.config();
}

const queue = new Queue();

const processQueue = function () {
    while(queue.count() > 0) {
        const qItem = queue.receive();
        console.log(qItem);
    }
}

processQueue();