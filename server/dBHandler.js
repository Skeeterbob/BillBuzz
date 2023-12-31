// Authored by Hadi Ghaddar
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ClientEncryption } from 'mongodb';
import { User } from "./objectPack.js"; // Added by Bryan Hodgins

dotenv.config('../.env');
const DATABASE_NAME = process.env.DATABASE_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const KEY_VAULT_DATABASE = process.env.KEY_VAULT_DATABASE;
const KEY_VAULT_COLLECTION = process.env.KEY_VAULT_COLLECTION;
const MONGO_MASTER_KEY = process.env.MONGO_MASTER_KEY;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
const KEY_VAULT_NAMESPACE = `${KEY_VAULT_DATABASE}.${KEY_VAULT_COLLECTION}`;


class DBHandler {
    #mongoConnectionURL;
    #encryption;
    #client;
    #db;
    #usersCollection; // Added by Bryan Hodgins
    #idCollection;  // Added by Bryan Hodgins

    constructor(mongoConnectionURL) {
        this.#mongoConnectionURL = !mongoConnectionURL ? process.env.MONGO_CONNECTION : mongoConnectionURL;
    }

    // Method to update a user
    // Authored by Henry Winczner from line(s) 36 - 45



    // Authored by Henry Winczner from line(s) 36 - 51


    async updateThreshold(email, overdraftAlertThreshold) {
        try {
            // Update the overdraft alert threshold for the user with the given email
            const result = await this.#usersCollection.updateOne(
                { email: email }, // if email is encrypted, use encryptedEmail here
                { $set: { overdraftThreshold: overdraftAlertThreshold } }
            );

            return result;
        } catch (error) {
            console.error("Error updating overdraft alert threshold in database:", error);
            throw error;
        }
    }

    async updateUserPassword(user) {
        const updated = await this.#usersCollection.updateOne(
            { _id: user._id },
            { $set: user.toObject() } // Assuming toObject method exists to convert User to plain object
        );
        return updated.modifiedCount > 0;
    }

    // Method to get a user by reset token
    async getUserByToken(token) {
        const userDoc = await this.#usersCollection.findOne({ resetPasswordToken: token });
        if (!userDoc) {
            return null;
        }
        return new User(userDoc); // Assuming User constructor takes a document
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
        await this.#client.connect(); // Hadi Ghaddar
        this.#encryption = new Encryption(this.#client); // Bryan Hodgins
        this.#db = this.#client.db(DATABASE_NAME); //Bryan Hodgins
        this.#usersCollection = this.#db.collection(USERS_COLLECTION);//Bryan Hodgins
        this.#idCollection = this.#db.collection('idcollection');//Bryan Hodgins
    }

    //Insert a new encrypted user into the database
    // insertUser function was authored by Bryan Hodgins
    async insertUser(user) {
        try {
            let id = await this.#getKeyId(user.getEmail());
            if (id != null) {
                console.log('user already exists');
                return false;
            }
            else {
                id = await this.#insertKeyId(user.getEmail());
                const encryptedUser = await this.#encryption.encryptUser(user, id);
                return await this.#usersCollection.insertOne(encryptedUser);
            }
        } catch (error) {
            //Throw and log any error we get when trying to insert a new user
            console.error("Error inserting user to database:", error);
            throw error;
        }
    }

    //Update user information
    //Take in an email too in case the user updates their email, we will have the original
    // Authored by Bryan Hodgins and Hadi Ghaddar
    async updateUser(email, user) {
        try {
            //Get key from email in user class
            let id = await this.#getKeyId(email); //Bryan Hodgins
            id = id['key']; //Bryan Hodgins
            //Lines 94-96 by Raigene (commit #9bc0383)
            if (id == null) {
                console.log('User does not exist');
                return false;
            } else {
                const encryptedEmail = await this.#encryption.encryptString(email, id); // Modified by Bryan Hodgins
                //Encrypt new user data
                const encryptedUser = await this.#encryption.encryptUser(user, id); // Modified by Bryan Hodgins

                if (user.getEmail() !== email) {
                    await this.#encryption.updateKeyId(user.getEmail(), id); // Modified by Bryan Hodgins
                }

                return await this.#usersCollection.updateOne(
                    { email: encryptedEmail },
                    { $set: encryptedUser },
                    { upsert: true }
                );
            }
            //Lines 113-115 by Raigene (commit #9bc0383)
        } catch (error) {
            console.error("Error updating user in database:", error);
            throw error;
        }
    }

    //Get a user from the database by their email
    // Authored by Hadi Ghaddar and modified by Bryan Hodgins
    async getUser(email) {
        try {
            let id = await this.#getKeyId(email); // Added by Bryan Hodgins
            id = id['key'];
            if (id != null) {
                //Encrypt the email so that we can search for it in the database
                const encryptedEmail = await this.#encryption.encryptString(email, id); // Modified by Bryan Hodgins
                //Retrieve the user from the database, all the data would be encrypted
                const encryptedUser = await this.#usersCollection.findOne({ 'email': encryptedEmail }); // Modified by Bryan Hodgins
                //Return the user's properties decrypted so that we can actually read them
                return await this.#encryption.decryptUser(encryptedUser, id); // Modified by Bryan Hodgins
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

    async deleteUser(email) {
        try {
            let id = await this.#getKeyId(email);
            id = id['key'];
            if (id != null) {
                const encryptedEmail = await this.#encryption.encryptString(email, id);
                return await this.#usersCollection.deleteOne({ email: encryptedEmail });
            } else {
                console.log('user does not exist');
                return null;
            }
        } catch (error) {
            console.error("Error deleting user from database:", error);
            throw error;
        }
    }

    //Verify if a user's profile already exists in the database by email
    //If the user exists we return true, false if no user is found
    // verify user function authored by Bryan Hodgins
    async verifyUser(email, password) {
        let retVal = {};
        let id = await this.#getKeyId(email);
        if (id != null && id['key'] != null) {
            id = id['key'];
            const encryptedEmail = await this.#encryption.encryptString(email, id);
            const result = await this.#usersCollection.findOne({ "email": encryptedEmail });
            if (result) {
                let phNum = result['phoneNumber'];
                retVal["phoneNumber"] = await this.#encryption.decryptString(phNum, id);
                retVal["validate"] = true;
                retVal['id'] = result['_id']

                return retVal;
            }
        }

        return retVal["validate"] = false;
    }

    //private function to return the keyId for encryption from the other collection
    // Authored by Bryan Hodgins
    async #getKeyId(email) {
        return await this.#idCollection.findOne({ "email": email });
    }

    //private functio to insert keyId into idCollection when account is created
    // Authored by Bryan Hodgins
    async #insertKeyId(email) {
        let id = await this.#encryption.createNewKey()
        let result = await this.#idCollection.insertOne({ "email": email, "key": id });
        return id;
    };

    // Authored by Bryan Hodgins
    async updateKeyId(email, keyId) {
        await this.#idCollection.insertOne({ "email": email, "key": keyId });
        return keyId;
    }

    // Authored by Bryan Hodgins for possible future use for encryption
    //This function returns a schema to identify fields to be encrypted.
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
// Authored by Hadi Ghaddar inside of independent file. Relocated and modified by Bryan Hodgins
class Encryption {
    //Our ClientEncryption instance and dataKey
    #encryption;

    //Take in a mongo client parameter as it's required to create a ClientEncryption instance
    constructor(mongoClient) {
        //Our options for the ClientEncryption instance we create
        const options = { // modified by Bryan Hodgins 
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
    // authored by Hadi Ghaddar, modified by bryan hodgins to use the id that is passed in.
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
                    amount: await this.encryptString(transaction.getAmount().toString(), id),
                    date: await this.encryptString(transaction.getDate(), id),
                    subscriptionName: await this.encryptString(transaction.getSubscriptionName(), id),
                    subscriptionBool: await this.encryptString(transaction.isSubscription().toString(), id),
                    vendor: await this.encryptString(transaction.getVendor(), id)
                };

                //Add the encrypted transaction to the list
                encryptedTransactions.push(encryptedTransaction);
            }

            //Create a new encrypted TransactionList
            const encryptedTransactionList = {
                transactionList: encryptedTransactions,
                length: await this.encryptString(account.getTransactionList().getLength().toString(), id),
                beginDate: await this.encryptString(account.getTransactionList().getBeginDate(), id),
                endDate: await this.encryptString(account.getTransactionList().getEndDate(), id)
            };

            //Create a new Account with all properties encrypted
            const encryptedAccount = {
                id: await this.encryptString(account.getId(), id),
                name: await this.encryptString(account.getName(), id),
                balance: await this.encryptString(account.getBalance().toString(), id),
                transactionList: encryptedTransactionList,
                accessToken: await this.encryptString(account.getAccessToken(), id)
            };

            //Add the encrypted account to the accountList
            accountList.push(encryptedAccount);
        }

        //Create and return a new user with all properties encrypted
        return {
            overdraftThreshold: await this.encryptString(user.getOverdraftThreshold(), id),
            email: await this.encryptString(user.getEmail(), id),
            password: await this.encryptString(user.getPassword(), id),
            firstName: await this.encryptString(user.getFirstName(), id),
            lastName: await this.encryptString(user.getLastName(), id),
            birthday: await this.encryptString(user.getBirthday(), id),
            phoneNumber: await this.encryptString(user.getPhoneNumber(), id),
            bankBalance: await this.encryptString(user.getBankBalance().toString(), id),
            availableCredit: await this.encryptString(user.getAvailableCredit().toString(), id),
            accountList: accountList
        };
    }

    //Decrypt a given user
    // Authored by Hadi Ghaddar, modified by Bryan Hodgins to use the encryption id.
    async decryptUser(user, id) {
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
                    amount: await this.decryptString(encryptedTransaction['amount'], id),
                    date: await this.decryptString(encryptedTransaction['date'], id),
                    subscriptionName: await this.decryptString(encryptedTransaction['subscriptionName'], id),
                    subscriptionBool: await this.decryptString(encryptedTransaction['subscriptionBool'], id),
                    vendor: await this.decryptString(encryptedTransaction['vendor'], id)
                };
                //Add the decrypted transaction to the list
                transactions.push(transaction);
            }

            //Create a new decrypted TransactionList
            const transactionList = {
                transactionList: transactions,
                length: await this.decryptString(account['transactionList']['length'], id),
                beginDate: await this.decryptString(account['transactionList']['beginDate'], id),
                endDate: await this.decryptString(account['transactionList']['endDate'], id)
            };

            //Create a new Account with all properties decrypted
            const decryptedAccount = {
                id: await this.decryptString(account['id'], id),
                name: await this.decryptString(account['name'], id),
                balance: await this.decryptString(account['balance'], id),
                transactionList: transactionList,
                accessToken: await this.decryptString(account['accessToken'], id)
            };

            //Add the decrypted account to the accountList
            accountList.push(decryptedAccount);
        }
        //Create and return a new user with all properties decrypted
        return new User({
            overdraftThreshold: user['overdraftThreshold'] ? await this.decryptString(user['overdraftThreshold'],id) : '',
            email: await this.decryptString(user['email'], id),
            password: await this.decryptString(user['password'], id),
            firstName: await this.decryptString(user['firstName'], id),
            lastName: await this.decryptString(user['lastName'], id),
            birthday: await this.decryptString(user['birthday'], id),
            phoneNumber: await this.decryptString(user['phoneNumber'], id),
            bankBalance: await this.decryptString(user['bankBalance'], id),
            availableCredit: await this.decryptString(user['availableCredit'], id),
            accountList: accountList
        });
    }

    // Encrypt a JSON object by interating over its keys and reconstructing with 
    // all values encrypted and keys intact.
    // Authored by Bryan Hodgins
    async encryptJSON(data) {
        let keyList = Object.keys(data);
        let retJSON = {}
        keyList.forEach((element) => {
            retJSON[element] = this.encryptString(data[element]);
        })
        return retJSON;
    }

    //Encrypt a single string
    // Authored by Hadi Ghaddar, Modified by Bryan Hodgins to modify options for client to
    // allow for the encryption to continue to work accross multiple restarts of server.
    async encryptString(targetString, id) {
        let encryptionOptions = {
            algorithm: ENCRYPTION_ALGORITHM,
            keyId: id
        };
        return await this.#encryption.encrypt(targetString, encryptionOptions);
    }

    //Decrypt a single string
    // Authored by Hadi Ghaddar, Modified by Bryan Hodgins to modify options for client to
    // allow for the encryption to continue to work accross multiple restarts of server.
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
        return await this.#encryption.decrypt(targetString, encryptionOptions);
    }

}

export { DBHandler };
