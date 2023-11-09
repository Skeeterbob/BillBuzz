import { Queue } from './queueHandler.js';
import dotenv from 'dotenv';

if (!process.env.MONGO_CONNECTION){
  dotenv.config();
}

const queue = new Queue();

class Worker {
    async processQueue () {
        while(await queue.count() > 0) {
            const qItem = queue.receive();
            console.log(qItem);
        }
    }

    async start () {
        await queue.init()
        if(await queue.count() > 0) {
            await this.processQueue();
        }
    }
}
const worker = new Worker();
worker.start().then(() => {
    process.exit();
});



