import dotenv from 'dotenv';
import {User} from './user';
import {ClientEncryption, MongoClient, ServerApiVersion} from 'mongodb';

dotenv.config('../.env');
const DATABASE_NAME = process.env.DATABASE_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const KEY_VAULT_DATABASE = process.env.KEY_VAULT_DATABASE;
const KEY_VAULT_COLLECTION = process.env.KEY_VAULT_COLLECTION;
const MONGO_MASTER_KEY = process.env.MONGO_MASTER_KEY;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
const KEY_VAULT_NAMESPACE = `${KEY_VAULT_DATABASE}.${KEY_VAULT_COLLECTION}`;

//Create our initial MongoClient based on our connection URL and options
const client = new MongoClient(process.env.MONGO_CONNECTION, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

class DBHandler {
    //Our ClientEncryption instance and dataKey
    #encryption
    #dataKey

    async init() {
        //Create our initial connection to MongoDB
        await client.connect();

        //Our options for the ClientEncryption instance we create
        const options = {
            keyVaultNamespace: KEY_VAULT_NAMESPACE,
            kmsProviders: {
                local: {
                    key: MONGO_MASTER_KEY
                }
            }
        }

        //Create a ClientEncryption that we'll use for encryption/decryption
        this.#encryption = new ClientEncryption(client, options);
        //Create a dataKey for our encryption/decryption based on our master key
        this.#dataKey = this.#encryption.createDataKey("local");
    }

    //Insert a new user into the database
    async insertUser(user) {
        try {
            //Create our encryption options as a variable as it's commonly re-used
            const encryptionOptions = {
                algorithm: ENCRYPTION_ALGORITHM,
                keyId: this.#dataKey
            };

            //Get the users collection from our database
            const db = client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);

            //Create a new User object with all properties encrypted
            const encryptedUser = new User({
                email: await this.#encryption.encrypt(user.email, encryptionOptions),
                password: await this.#encryption.encrypt(user.password, encryptionOptions),
                firstName: await this.#encryption.encrypt(user.firstName, encryptionOptions),
                lastName: await this.#encryption.encrypt(user.lastName, encryptionOptions),
                birthday: await this.#encryption.encrypt(user.birthday, encryptionOptions),
                phoneNumber: await this.#encryption.encrypt(user.phoneNumber, encryptionOptions),
                bankBalance: await this.#encryption.encrypt(user.bankBalance, encryptionOptions),
                availableCredit: await this.#encryption.encrypt(user.availableCredit, encryptionOptions)
            });

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
            const db = client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);

            //Encrypt the email so that we can search for it in the database
            const encryptedEmail = await this.#encryption.encrypt(user.email, {
                algorithm: ENCRYPTION_ALGORITHM,
                keyId: this.#dataKey
            });
            //Retrieve the user from the database, all the data would be encrypted
            const encryptedUser = await usersCollection.findOne({email: encryptedEmail});

            //Return the user's properties decrypted so that we can actually read them
            return new User({
                email: this.#encryption.decrypt(encryptedUser.email),
                password: this.#encryption.decrypt(encryptedUser.password),
                firstName: this.#encryption.decrypt(encryptedUser.firstName),
                lastName: this.#encryption.decrypt(encryptedUser.lastName),
                birthday: this.#encryption.decrypt(encryptedUser.birthday),
                phoneNumber: this.#encryption.decrypt(encryptedUser.phoneNumber),
                bankBalance: this.#encryption.decrypt(encryptedUser.bankBalance),
                availableCredit: this.#encryption.decrypt(encryptedUser.availableCredit)
            });
        } catch (error) {
            //Throw and log any error we get when trying to get a user from the database
            console.error("Error getting user from database:", error);
            throw error;
        }
    }
}

export {DBHandler};
