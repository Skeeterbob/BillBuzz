import dotenv from 'dotenv';
import {MongoClient, ServerApiVersion} from 'mongodb';

if (!process.env.MONGO_CONNECTION) {
  dotenv.config();
}

class Queue {
    #client;
    #db;
    #queueCollection;

    //initialize client
    constructor (type = 'DEFAULT') {
        this.type = type;
        this.#client = new MongoClient(process.env.MONGO_CONNECTION, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
    }

    async init(){
        await this.#client.connect().then(() => {
            this.#db = this.#client.db(process.env.DATABASE_NAME);
            this.#queueCollection = this.#db.collection(process.env.QUEUE_COLLECTION)
            return('done');
        })
    }

    //function to add data to the queue on mongodb
    async send(data = null, delayUntil) {
        try {
            // calculate start date/time
            let queTime = new Date();
            // if delay given as date set that as queTime
            if (delayUntil instanceof Date) {
                queTime = delayUntil;
            }
            // if delayUntil is a number assume it is seconds and add to current date.
            else if (!isNaN(delayUntil)) {
                queTime = new Date( +queTime + delayUntil * 1000);
            }
            // add item to queue
            const result = this.#queueCollection.insertOne({
                type: this.type, queTime, data
            });
            // return qItem
            return result && result.insertedCount && result.insertedId ?
                { _id: result.insertedId, sent: result.insertedId.getTimestamp(), data } : null;
        }
        catch(err) {
            console.log(`Queue.send error:\n${ err }`);
            return null;
        }
    }

    async receive() {
        try {
            // find and delete next item on queue
            const now = new Date()
            const result = await this.#queueCollection.findOneAndDelete(
                {
                    type: this.type,
                    queTime: { $lt: now }
                },
                {
                    sort: { queTime: 1 }
                }
            );
            return result.data
        }
        catch(err) {
            console.log(`Queue.receive error:\n${ err }`);
            return null;
        }
    }

    async count() {
        try {
            return await this.#queueCollection.count({type: this.type});
        }
        catch(err) {
            console.log(`Queue.count error:\n${ err }`);
            return null;
        }
    }
}

export {Queue};