import dotenv from 'dotenv';
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

class DatabaseHandler {
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
    async insertUserToDB({email, password, firstName, lastName, birthday, phoneNumber, bankBalance, availableCredit}) {
        try {
            //Create our encryption options as a variable as it's commonly re-used
            const encryptionOptions = {
                algorithm: ENCRYPTION_ALGORITHM,
                keyId: this.#dataKey
            };

            //Get the users collection from our database
            const db = client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);

            //Insert one document into the DB with the user's properties
            //Here we encrypt all the data before inserting into the DB
            return await usersCollection.insertOne({
                email: await this.#encryption.encrypt(email, encryptionOptions),
                password: await this.#encryption.encrypt(password, encryptionOptions),
                firstName: await this.#encryption.encrypt(firstName, encryptionOptions),
                lastName: await this.#encryption.encrypt(lastName, encryptionOptions),
                birthday: await this.#encryption.encrypt(birthday, encryptionOptions),
                phoneNumber: await this.#encryption.encrypt(phoneNumber, encryptionOptions),
                bankBalance: await this.#encryption.encrypt(bankBalance, encryptionOptions),
                availableCredit: await this.#encryption.encrypt(availableCredit, encryptionOptions)
            });
        }catch (error) {
            //Throw and log any error we get when trying to insert a new user
            console.error("Error inserting user to database:", error);
            throw error;
        }
    }

    //Get a user from the database by their email
    async getUserFromDB(email) {
        try {
            //Get the users collection from our database
            const db = client.db(DATABASE_NAME);
            const usersCollection = db.collection(USERS_COLLECTION);

            //Encrypt the email so that we can search for it in the database
            const encryptedEmail = await this.#encryption.encrypt(email, {
                algorithm: ENCRYPTION_ALGORITHM,
                keyId: this.#dataKey
            });
            //Retrieve the user from the database, all the data would be encrypted
            const encryptedUser = usersCollection.findOne({email: encryptedEmail});

            //Return the user's properties decrypted so that we can actually read them
            return {
                email: this.#encryption.decrypt(encryptedUser.email),
                password: this.#encryption.decrypt(encryptedUser.password),
                firstName: this.#encryption.decrypt(encryptedUser.firstName),
                lastName: this.#encryption.decrypt(encryptedUser.lastName),
                birthday: this.#encryption.decrypt(encryptedUser.birthday),
                phoneNumber: this.#encryption.decrypt(encryptedUser.phoneNumber),
                bankBalance: this.#encryption.decrypt(encryptedUser.bankBalance),
                availableCredit: this.#encryption.decrypt(encryptedUser.availableCredit)
            };
        } catch (error) {
            //Throw and log any error we get when trying to get a user from the database
            console.error("Error getting user from database:", error);
            throw error;
        }
    }
}