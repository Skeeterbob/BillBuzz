import dotenv from 'dotenv';
import {MongoClient, ServerApiVersion} from 'mongodb';
import {Encryption} from "./encryption.js";

dotenv.config('../.env');
const DATABASE_NAME = process.env.DATABASE_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;

class DBHandler {
    #mongoConnectionURL
    #encryption;
    #client;

    constructor(mongoConnectionURL) {
        this.#mongoConnectionURL = !mongoConnectionURL ? process.env.MONGO_CONNECTION : mongoConnectionURL;
    }

    async init() {
        //Create our initial MongoClient based on our connection URL and options
        this.#client = new MongoClient(this.#mongoConnectionURL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        //Create our initial connection to MongoDB
        await this.#client.connect();
        this.#encryption = new Encryption(this.#client);
        await this.#encryption.init();
    }

    //Insert a new user into the database
    async insertUser(user) {
        try {
            //Get the users collection from our database
            const db = this.#client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);

            //Create a new User object with all properties encrypted
            const encryptedUser = await this.#encryption.encryptUser(user);

            //Insert one document into the DB with the user's properties
            return await usersCollection.insertOne(encryptedUser);
        }catch (error) {
            //Throw and log any error we get when trying to insert a new user
            console.error("Error inserting user to database:", error);
            throw error;
        }
    }

    //Get a user from the database by their email
    async getUser(user) {
        try {
            //Get the users collection from our database
            const db = this.#client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);
            const result = await usersCollection.find();

            //Encrypt the email so that we can search for it in the database
            const encryptedEmail = await this.#encryption.encryptString(user.getEmail());

            //Retrieve the user from the database, all the data would be encrypted
            const encryptedUser = await usersCollection.findOne({email: encryptedEmail});

            //Return the user's properties decrypted so that we can actually read them
            return this.#encryption.decryptUser(encryptedUser);
        } catch (error) {
            //Throw and log any error we get when trying to get a user from the database
            console.error("Error getting user from database:", error);
            throw error;
        }
    }
}

export {DBHandler};
