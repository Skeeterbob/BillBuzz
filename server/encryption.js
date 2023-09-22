import dotenv from "dotenv";
import {ClientEncryption} from "mongodb";
import {Account, Transaction, TransactionList, User} from "../objectPack.js";

dotenv.config('../.env');
const KEY_VAULT_DATABASE = process.env.KEY_VAULT_DATABASE;
const KEY_VAULT_COLLECTION = process.env.KEY_VAULT_COLLECTION;
const MONGO_MASTER_KEY = process.env.MONGO_MASTER_KEY;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
const KEY_VAULT_NAMESPACE = `${KEY_VAULT_DATABASE}.${KEY_VAULT_COLLECTION}`;

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
                const encryptedTransaction = new Transaction({
                    amount: await this.encryptString(transaction.getAmount().toString()),
                    date: await this.encryptString(transaction.getDate()),
                    subscription: await this.encryptString(transaction.getSubscription()),
                    vendor: await this.encryptString(transaction.getVendor())
                });

                //Add the encrypted transaction to the list
                encryptedTransactions.push(encryptedTransaction);
            }

            //Create a new encrypted TransactionList
            const encryptedTransactionList = new TransactionList({
                data: encryptedTransactions,
                length: await this.encryptString(account.getTransactionList().getLength().toString()),
                beginDate: await this.encryptString(account.getTransactionList().getBeginDate()),
                endDate: await this.encryptString(account.getTransactionList().getEndDate())
            });

            //Create a new Account with all properties encrypted
            const encryptedAccount = new Account({
                id: await this.encryptString(account.getId()),
                name: await this.encryptString(account.getName()),
                balance: await this.encryptString(account.getBalance().toString()),
                transactionList: encryptedTransactionList
            });

            //Add the encrypted account to the accountList
            accountList.push(encryptedAccount);
        }

        //Create and return a new user with all properties encrypted
        return new User({
            email: await this.encryptString(user.getEmail()),
            password: await this.encryptString(user.getPassword()),
            firstName: await this.encryptString(user.getFirstName()),
            lastName: await this.encryptString(user.getLastName()),
            birthday: await this.encryptString(user.getBirthday()),
            phoneNumber: await this.encryptString(user.getPhoneNumber()),
            bankBalance: await this.encryptString(user.getBankBalance().toString()),
            availableCredit: await this.encryptString(user.getAvailableCredit().toString()),
            accountList: accountList
        });
    }

    //Decrypt a given user
    async decryptUser(user) {
        if (!user) {
            console.error("Invalid user provided to decrypt: " + user);
            return null;
        }

        const accountList = [];

        //We start by iterating over every account in the accountList
        for (const account of user.getAccountList()) {
            const transactions = [];

            //Each account with have a list of transactions, we need to decrypt those too
            for (const encryptedTransaction of account.getTransactionList().getTransactions()) {
                //Create a new decrypted Transaction
                const transaction = new Transaction({
                    amount: this.decryptString(encryptedTransaction.getAmount().toString()),
                    date: this.decryptString(encryptedTransaction.getDate()),
                    subscription: this.decryptString(encryptedTransaction.getSubscription()),
                    vendor: this.decryptString(encryptedTransaction.getVendor())
                });

                //Add the decrypted transaction to the list
                transactions.push(transaction);
            }

            //Create a new decrypted TransactionList
            const transactionList = new TransactionList({
                data: transactions,
                length: this.decryptString(account.getTransactionList().getLength().toString()),
                beginDate: this.decryptString(account.getTransactionList().getBeginDate()),
                endDate: this.decryptString(account.getTransactionList().getEndDate())
            });

            //Create a new Account with all properties decrypted
            const decryptedAccount = new Account({
                id: this.decryptString(account.getId()),
                name: this.decryptString(account.getName()),
                balance: this.decryptString(account.getBalance().toString()),
                transactionList: transactionList
            });

            //Add the decrypted account to the accountList
            accountList.push(decryptedAccount);
        }

        //Create and return a new user with all properties decrypted
        return new User({
            email: this.decryptString(user.getEmail()),
            password: this.decryptString(user.getPassword()),
            firstName: this.decryptString(user.getFirstName()),
            lastName: this.decryptString(user.getLastName()),
            birthday: this.decryptString(user.getBirthday()),
            phoneNumber: this.decryptString(user.getPhoneNumber()),
            bankBalance: this.decryptString(user.getBankBalance().toString()),
            availableCredit: this.decryptString(user.getAvailableCredit().toString()),
            accountList: accountList
        });
    }

    //Encrypt a single string
    async encryptString(targetString) {
        return await this.#encryption.encrypt(targetString, this.#encryptionOptions);
    }

    //Decrypt a single string
    decryptString(targetString) {
        return this.#encryption.decrypt(targetString);
    }
}

export {Encryption};