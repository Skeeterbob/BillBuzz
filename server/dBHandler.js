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
    #db;
    #usersCollection;
    #idCollection;

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
        this.#db = this.#client.db(DATABASE_NAME);
        this.#usersCollection = this.#db.collection(USERS_COLLECTION);
        this.#idCollection = this.#db.collection('idcollection');
    }

    //Insert a new encrypted user into the database
    async insertUser(user) {
        try {
            let id = await this.#getKeyId(user.getEmail());
            if(id != null){
                console.log('user already exists');
                return false;
            }
            else{
                id = await this.#insertKeyId(user.getEmail());
                const encryptedUser = await this.#encryption.encryptUser(user,id);
                return await this.#usersCollection.insertOne(encryptedUser);
            }
        }catch (error) {
            //Throw and log any error we get when trying to insert a new user
            console.error("Error inserting user to database:", error);
            throw error;
        }
    }

    //Update user information
    async updateUser(user) {
        try {
            //Get key from email in user class
            let id = await this.#getKeyId(user.getEmail());
            id = id['key'];

            if (id == null) {
                console.log('User does not exist');
                return false;
            } else {
                const encryptedEmail = await this.#encryption.encryptString(user.getEmail(),id);
                //Encrypt new user data
                const encryptedUser = await this.#encryption.encryptUser(user, id);

                return await this.#usersCollection.updateOne(
                    {email: encryptedEmail},
                    {$set: encryptedUser},
                    {upsert: true}
                );
            }
        } catch (error) {
            console.error("Error updating user in database:", error);
            throw error;
        }
    }

    //Get a user from the database by their email
    async getUser(email) {
        try {
            let id = await this.#getKeyId(email);
            id = id['key'];
            if (id != null) {
                //Encrypt the email so that we can search for it in the database
                const encryptedEmail = await this.#encryption.encryptString(email,id);
                //Retrieve the user from the database, all the data would be encrypted
                const encryptedUser = await this.#usersCollection.findOne({'email': encryptedEmail});
                //Return the user's properties decrypted so that we can actually read them
                return await this.#encryption.decryptUser(encryptedUser,id);
            }
            else {
                console.log('user does not exist');
            }
        } catch (error) {
            //Throw and log any error we get when trying to get a user from the database
            console.error("Error getting user from database:", error);
            throw error;
        }
    }

    //Verify if a user's profile already exists in the database by email
    //If the user exists we return true, false if no user is found
    async verifyUser (email, password) {
        let retVal = {};
        let id = await this.#getKeyId(email);
        id = id['key'];
        if (id != null) {
            const encryptedEmail = await this.#encryption.encryptString(email,id);
            const encryptedPassword = await this.#encryption.encryptString(password,id);
            const result = await this.#usersCollection.findOne({"email":encryptedEmail});
            if (result) {
                let phNum = result['phoneNumber'];
                retVal["phoneNumber"] = await this.#encryption.decryptString(phNum,id);
                retVal["validate"] = true;
                retVal['id'] = result['_id']

                return retVal;
            }
        }

        return retVal["validate"] = false;
    }

    //private function to return the keyId for encryption from the other collection
    async #getKeyId (email) {
        return await this.#idCollection.findOne({"email":email});
    }

    //private functio to insert keyId into idCollection when account is created
    async #insertKeyId (email) {
        let id = await this.#encryption.createNewKey()
        let result = await this.#idCollection.insertOne({"email": email, "key":id});
        return id;
    };
    //This functioni returns a schema to identify fields to be encrypted.
    //Will be useful if we setup autoencryption later.
    /*#getUserEncryptSchema (id) {
        const schema = {
            bsonType: "object",
            encryptMetadata: {
                keyId: [new Binary(Buffer.from(id, "base64"), 4)],
            },
            properties: {
                email: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                password: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                firstName: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                lastName: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                birthday: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                phoneNumber: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                bankBalance: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                availableCredit: {
                    bsonType: "string",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
                accountList: {
                    bsonType: "array",
                    algorithm: ENCRYPTION_ALGORITHM,
                },
            },
        }
        var userSchema = {};
        userSchema[keyVaultNamespace] = schema;
        return userSchema;
    }*/
}

//Base encryption class with MongoDB
class Encryption {
    //Our ClientEncryption instance and dataKey
    #encryption;

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

    async createNewKey() {
        //Create a dataKey for our encryption/decryption based on our master key
        return await this.#encryption.createDataKey("local");
    }

    //Encrypt a given user
    async encryptUser(user, id) {
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
                    amount: await this.encryptString(transaction.getAmount().toString(),id),
                    date: await this.encryptString(transaction.getDate(),id),
                    subscriptionName: await this.encryptString(transaction.getSubscriptionName(),id),
                    subscriptionBool: await this.encryptString(transaction.isSubscription().toString(),id),
                    vendor: await this.encryptString(transaction.getVendor(),id)
                };

                //Add the encrypted transaction to the list
                encryptedTransactions.push(encryptedTransaction);
            }

            //Create a new encrypted TransactionList
            const encryptedTransactionList = {
                transactionList: encryptedTransactions,
                length: await this.encryptString(account.getTransactionList().getLength().toString(),id),
                beginDate: await this.encryptString(account.getTransactionList().getBeginDate(),id),
                endDate: await this.encryptString(account.getTransactionList().getEndDate(),id)
            };

            //Create a new Account with all properties encrypted
            const encryptedAccount = {
                id: await this.encryptString(account.getId(),id),
                name: await this.encryptString(account.getName(),id),
                balance: await this.encryptString(account.getBalance().toString(),id),
                transactionList: encryptedTransactionList,
                accessToken: await this.encryptString(account.getAccessToken(),id)
            };

            //Add the encrypted account to the accountList
            accountList.push(encryptedAccount);
        }

        //Create and return a new user with all properties encrypted
        return {
            email: await this.encryptString(user.getEmail(),id),
            password: await this.encryptString(user.getPassword(),id),
            firstName: await this.encryptString(user.getFirstName(),id),
            lastName: await this.encryptString(user.getLastName(),id),
            birthday: await this.encryptString(user.getBirthday(),id),
            phoneNumber: await this.encryptString(user.getPhoneNumber(),id),
            bankBalance: await this.encryptString(user.getBankBalance().toString(),id),
            availableCredit: await this.encryptString(user.getAvailableCredit().toString(),id),
            accountList: accountList
        };
    }

    //Decrypt a given user
    async decryptUser(user,id) {
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
                    amount: await this.decryptString(encryptedTransaction['amount'],id),
                    date: await this.decryptString(encryptedTransaction['date'],id),
                    subscriptionName: await this.decryptString(encryptedTransaction['subscriptionName'],id),
                    subscriptionBool: await this.decryptString(encryptedTransaction['subscriptionBool'],id),
                    vendor: await this.decryptString(encryptedTransaction['vendor'],id)
                };

                //Add the decrypted transaction to the list
                transactions.push(transaction);
            }

            //Create a new decrypted TransactionList
            const transactionList = {
                transactionList: transactions,
                length: await this.decryptString(account['transactionList']['length'],id),
                beginDate: await this.decryptString(account['transactionList']['beginDate'],id),
                endDate: await this.decryptString(account['transactionList']['endDate'],id)
            };

            //Create a new Account with all properties decrypted
            const decryptedAccount = {
                id: await this.decryptString(account['id'],id),
                name: await this.decryptString(account['name'],id),
                balance: await this.decryptString(account['balance'],id),
                transactionList: transactionList,
                accessToken: await this.decryptString(account['accessToken'],id)
            };

            //Add the decrypted account to the accountList
            accountList.push(decryptedAccount);
        }

        //Create and return a new user with all properties decrypted
        return new User({
            email: await this.decryptString(user['email'],id),
            password: await this.decryptString(user['password'],id),
            firstName: await this.decryptString(user['firstName'],id),
            lastName: await this.decryptString(user['lastName'],id),
            birthday: await this.decryptString(user['birthday'],id),
            phoneNumber: await this.decryptString(user['phoneNumber'],id),
            bankBalance: await this.decryptString(user['bankBalance'],id),
            availableCredit: await this.decryptString(user['availableCredit'],id),
            accountList: accountList
        });
    }

    // Encrypt a JSON object by interating over its keys and reconstructing with 
    // all values encrypted and keys intact.
    async encryptJSON (data) {
        let keyList = Object.keys(data);
        let retJSON = {}
        keyList.forEach((element) => {
            retJSON[element] = this.encryptString(data[element]);
        })
        return retJSON;
    }

    //Encrypt a single string
    async encryptString(targetString, id) {
        let encryptionOptions = {
            algorithm: ENCRYPTION_ALGORITHM,
            keyId: id
        };
        return await this.#encryption.encrypt(targetString, encryptionOptions);
    }

    //Decrypt a single string
    async decryptString(targetString, id) {
        let encryptionOptions = {
            algorithm: ENCRYPTION_ALGORITHM,
            keyId: id,
            keyVaultNamespace: KEY_VAULT_NAMESPACE,
            kmsProviders: {
                local: {
                    key: MONGO_MASTER_KEY
                }
            }
        };
        let secureClient = new MongoClient(process.env.MONGO_CONNECTION,{
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
        let clientEncryption = new ClientEncryption(secureClient, encryptionOptions)
        return await clientEncryption.decrypt(targetString);
    }
}

export {DBHandler};
