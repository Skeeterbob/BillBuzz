import { Queue } from './queueHandler.js';
import { PlaidHandler } from './plaidHandler.js';
import dotenv from 'dotenv';

if (!process.env.MONGO_CONNECTION){
  dotenv.config();
}

const queue = new Queue();
const plaidHandler = new PlaidHandler();

class Worker {
    async processQueue () {
        while(await queue.count() > 0) {
            const qItem = await queue.receive();
            console.log(qItem);
            plaidHandler.handleTransactionWebhook(qItem);
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



