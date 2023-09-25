import dotenv from 'dotenv';
import {MongoClient, ServerApiVersion, ClientEncryption} from 'mongodb';
import {User} from "./objectPack.js";

dotenv.config('../.env');
const DATABASE_NAME = process.env.DATABASE_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const KEY_VAULT_DATABASE = process.env.KEY_VAULT_DATABASE;
const KEY_VAULT_COLLECTION = process.env.KEY_VAULT_COLLECTION;
const MONGO_MASTER_KEY = process.env.MONGO_MASTER_KEY;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
const KEY_VAULT_NAMESPACE = `${KEY_VAULT_DATABASE}.${KEY_VAULT_COLLECTION}`;

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

            //Encrypt the email so that we can search for it in the database
            const encryptedEmail = await this.#encryption.encryptString(user.getEmail());

            //Check if a user with the given email already exists
            const existingUser = await usersCollection.findOne({ email: encryptedEmail });

            if (existingUser) {
                return null;
            }

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

            //Encrypt the email so that we can search for it in the database
            const encryptedEmail = await this.#encryption.encryptString(user.getEmail());

            //Retrieve the user from the database, all the data would be encrypted
            const encryptedUser = await usersCollection.findOne({email: encryptedEmail});

            if (!encryptedUser) {
                return null;
            }

            //Return the user's properties decrypted so that we can actually read them
            return await this.#encryption.decryptUser(encryptedUser);
        } catch (error) {
            //Throw and log any error we get when trying to get a user from the database
            console.error("Error getting user from database:", error);
            throw error;
        }
    }

    //Verify if a user's profile already exists in the database by email
    //If the user exists we return true, false if no user is found
    async verifyUser(user) {
        const dbUser = await this.getUser(user);
        return dbUser ? true : false;
    }
}

//Base encryption class with MongoDB
class Encryption {
    //Our ClientEncryption instance and dataKey
    #encryption;
    #dataKey;
    #encryptionOptions;

    //Take in a mongo client parameter as it's required to create a ClientEncryption instance
    constructor(mongoClient) {
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
        this.#encryption = new ClientEncryption(mongoClient, options);
    }

    async init() {
        //Create a dataKey for our encryption/decryption based on our master key
        this.#dataKey = await this.#encryption.createDataKey("local");

        //Create our encryption options as a variable as it's commonly re-used
        this.#encryptionOptions = {
            algorithm: ENCRYPTION_ALGORITHM,
            keyId: this.#dataKey
        };
    }

    //Encrypt a given user
    async encryptUser(user) {
        if (!user) {
            console.error("Invalid user provided to encrypt: " + user);
            return null;
        }
        const accountList = [];

        //We start by iterating over every account in the accountList
        for (const account of user.getAccountList()) {
            const encryptedTransactions = [];

            //Each account with have a list of transactions, we'll be encrypting those too
            for (const transaction of account.getTransactionList().getTransactions()) {
                //Create a new encrypted Transaction
                const encryptedTransaction = {
                    amount: await this.encryptString(transaction.getAmount().toString()),
                    date: await this.encryptString(transaction.getDate()),
                    subscriptionName: await this.encryptString(transaction.getSubscriptionName()),
                    subscriptionBool: await this.encryptString(transaction.isSubscription().toString()),
                    vendor: await this.encryptString(transaction.getVendor())
                };

                //Add the encrypted transaction to the list
                encryptedTransactions.push(encryptedTransaction);
            }

            //Create a new encrypted TransactionList
            const encryptedTransactionList = {
                transactionList: encryptedTransactions,
                length: await this.encryptString(account.getTransactionList().getLength().toString()),
                beginDate: await this.encryptString(account.getTransactionList().getBeginDate()),
                endDate: await this.encryptString(account.getTransactionList().getEndDate())
            };

            //Create a new Account with all properties encrypted
            const encryptedAccount = {
                id: await this.encryptString(account.getId()),
                name: await this.encryptString(account.getName()),
                balance: await this.encryptString(account.getBalance().toString()),
                transactionList: encryptedTransactionList
            };

            //Add the encrypted account to the accountList
            accountList.push(encryptedAccount);
        }

        //Create and return a new user with all properties encrypted
        return {
            email: await this.encryptString(user.getEmail()),
            password: await this.encryptString(user.getPassword()),
            firstName: await this.encryptString(user.getFirstName()),
            lastName: await this.encryptString(user.getLastName()),
            birthday: await this.encryptString(user.getBirthday()),
            phoneNumber: await this.encryptString(user.getPhoneNumber()),
            bankBalance: await this.encryptString(user.getBankBalance().toString()),
            availableCredit: await this.encryptString(user.getAvailableCredit().toString()),
            accountList: accountList
        };
    }

    //Decrypt a given user
    async decryptUser(user) {
        if (!user) {
            console.error("Invalid user provided to decrypt: " + user);
            return null;
        }

        const accountList = [];

        //We start by iterating over every account in the accountList
        for (const account of user['accountList']) {
            const transactions = [];

            //Each account with have a list of transactions, we need to decrypt those too
            for (const encryptedTransaction of account['transactionList']['transactionList']) {
                //Create a new decrypted Transaction
                const transaction = {
                    amount: await this.decryptString(encryptedTransaction['amount']),
                    date: await this.decryptString(encryptedTransaction['date']),
                    subscriptionName: await this.decryptString(encryptedTransaction['subscriptionName']),
                    subscriptionBool: await this.decryptString(encryptedTransaction['subscriptionBool']),
                    vendor: await this.decryptString(encryptedTransaction['vendor'])
                };

                //Add the decrypted transaction to the list
                transactions.push(transaction);
            }

            //Create a new decrypted TransactionList
            const transactionList = {
                transactionList: transactions,
                length: await this.decryptString(account['transactionList']['length']),
                beginDate: await this.decryptString(account['transactionList']['beginDate']),
                endDate: await this.decryptString(account['transactionList']['endDate'])
            };

            //Create a new Account with all properties decrypted
            const decryptedAccount = {
                id: await this.decryptString(account['id']),
                name: await this.decryptString(account['name']),
                balance: await this.decryptString(account['balance']),
                transactionList: transactionList
            };

            //Add the decrypted account to the accountList
            accountList.push(decryptedAccount);
        }

        //Create and return a new user with all properties decrypted
        return new User({
            email: await this.decryptString(user['email']),
            password: await this.decryptString(user['password']),
            firstName: await this.decryptString(user['firstName']),
            lastName: await this.decryptString(user['lastName']),
            birthday: await this.decryptString(user['birthday']),
            phoneNumber: await this.decryptString(user['phoneNumber']),
            bankBalance: await this.decryptString(user['bankBalance']),
            availableCredit: await this.decryptString(user['availableCredit']),
            accountList: accountList
        });
    }

    //Encrypt a single string
    async encryptString(targetString) {
        return await this.#encryption.encrypt(targetString, this.#encryptionOptions);
    }

    //Decrypt a single string
    async decryptString(targetString) {
        return await this.#encryption.decrypt(targetString);
    }
}

export {DBHandler};
