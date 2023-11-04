// This Complete file was authored by Bryan Hodgins
const {User} = require('./objectPack.js');

const testTransactionString = '{"amount":1.11,"date":"' + new Date().toISOString() +
    '","subscriptionBool":false,"subscriptionName":"","vendor":"testVendor"}';
const testTrasactionListString = '{"transactionList":[' + testTransactionString +
    ',' + testTransactionString + '],"length":2,"beginDate":"' + 
    new Date().toISOString() + '","endDate":"' + new Date().toISOString() + '"}';
const testAccountString = '{"id":123456,"name":"testAccount","balance":12.75,' +
    '"transactionList":' + testTrasactionListString + '}';
const testUserString = '[{"email":"testuser@gmail.com","password":"TestPass12#",' +
    '"firstName":"Test","lastName":"User","birthday":"' + new Date().toISOString() +
    '","phoneNumber":"1234567890","bankBalance":1213.2,"availableCredit":500,' +
    '"accountList":[' + testAccountString + ',' + testAccountString + ']}]'
console.log(testUserString);


test ('test stringification of object', () => {
    const testUser = new User(JSON.parse(testUserString));
    expect(testUser.toJSONString()).toBe(testUserString);
})