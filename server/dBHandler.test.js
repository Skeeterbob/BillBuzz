import {DBHandler} from './dBHandler.js';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {User} from "./objectPack.js";


// Authored by Hadi Ghaddar from line(s) 1 - 105




let mongod;
let dbHandler;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create({
        instance: {
            storageEngine: 'wiredTiger'
        }
    });
    dbHandler = new DBHandler(mongod.getUri());
    await dbHandler.init();
});

afterAll(async () => {
    await mongod.stop();
});

describe('DBHandler', () => {
    it('should insert a user into the database', async () => {
        const mockUser = new User({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'test',
            birthday: '01/01/2001',
            phoneNumber: '1234567890',
            bankBalance: 100,
            availableCredit: 1,
            accountList: [
                {
                    id: 'some-id',
                    name: 'some-account',
                    balance: 100,
                    transactionList: {
                        transactionList: [
                            {
                                amount: 200,
                                date: '01/01/2001',
                                subscriptionName: 'Netflix',
                                vendor: 'Netflix',
                                subscriptionBool: true
                            }
                        ],
                        length: 1,
                        beginDate: '01/01/2001',
                        endDate: '01/02/2001'
                    }
                }
            ]
        });

        const result = await dbHandler.insertUser(mockUser);
        expect(result.acknowledged).toBe(true);
    });

    it('should retrieve a user from the database by their email', async () => {
        const mockUser = new User({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'test',
            birthday: '01/01/2001',
            phoneNumber: '1234567890',
            bankBalance: 100,
            availableCredit: 1,
            accountList: [
                {
                    id: 'some-id',
                    name: 'some-account',
                    balance: 100,
                    transactionList: {
                        transactionList: [
                            {
                                amount: 200,
                                date: '01/01/2001',
                                subscriptionName: 'Netflix',
                                vendor: 'Netflix',
                                subscriptionBool: true
                            }
                        ],
                        length: 1,
                        beginDate: '01/01/2001',
                        endDate: '01/02/2001'
                    }
                }
            ]
        });

        await dbHandler.insertUser(mockUser);
        const retrievedUser = await dbHandler.getUser(mockUser);
        expect(retrievedUser).toBeTruthy()
        expect(retrievedUser.getEmail()).toBe(mockUser.getEmail());
    });
});
