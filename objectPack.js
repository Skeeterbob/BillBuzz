//JSON object that can be used to validate the types of objects in particular
const types = {
    'get': function(prop) {
       return Object.prototype.toString.call(prop);
    },
    'null': '[object Null]',
    'object': '[object Object]',
    'array': '[object Array]',
    'string': '[object String]',
    'boolean': '[object Boolean]',
    'number': '[object Number]',
    'date': '[object Date]',
 }

//class to store and manipulate user data
class User {
    #email;
    #password;
    #firstName;
    #lastName;
    #birthday;
    #phoneNumber;
    #bankBalance;
    #availableCredit;
    #accountList = [];
    #variableList = ['email', 'password', 'firstName', 'lastName', 'birthDay',
        'phoneNumber', 'bankBalance', 'availableCredit', 'accountList'];

    //needs to pass in a JSON object with all keys for email, password, 
    //firstName, lastName, birthDay, phoneNumber, bankBalance, availableCredit,
    //and account list
    constructor(data) {
        keyList = data.keys();        
        this.#variableList.forEach((element) => {
            
        })
        this.#email = email;
        this.#password = password;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#birthday = birthday;
        this.#phoneNumber = phoneNumber;
        this.#bankBalance = bankBalance;
        this.#availableCredit = availableCredit;
        this.#accountList = accountList;
    }

    //function to add an account to the account list
    /*addAccount(account) { 
        need to make sure that it is of class account and add it to the 
        accountList
    }*/

    //function to remove an account from accountList
    /*removeAccount(id) {
        remove the Account
    }*/
    #objectifyAccounts (list) {
        let newList = [];
        list.forEach((element) => {
            newList.push(new Account(element));
        });
        return newList;
    }

    #objectifyTransactionList (list) {
        return new TransactionList(list);
    }

    #objectifyTransactions (list) {
        let newList = [];
        list.forEach((element) => {
            newList.push(new Transaction(element));
        });
        return newList;
    }

    getFirstName () {
        return this.#firstName;
    }

    getLastName () {
        return this.#lastName;
    }

    getBirthday () {
        return this.#birthday;
    }

    getBankBalance () {
        return this.#bankBalance;
    }

    getAvailableCredit () {
        return this.#availableCredit;
    }

    getEmail () {
        return this.#email;
    }

    getPhoneNumber () {
        return this.#phoneNumber
    }

    getAccountList () {
        return this.#accountList;
    }

    getPassword() {
        return this.#password;
    }
}

class Account {
    #id;
    #name;
    #balance;
    #transactionList;

    constructor({id, name, balance, transactionList}) {
        this.#id = id;
        this.#name = name;
        this.#balance = balance;
        this.#transactionList = transactionList;
    }

    getId () {
        return this.#id;
    }

    getName () {
        return this.#name;
    }

    setName (name) {
        this.#name = name;
    }

    getBalance() {
        return this.#balance;
    }

    getTransactionList() {
        return this.#transactionList;
    }
}

//class to store a list of transaction with some extra information relevant to
//to the list. The data array is to be composed of Transaction objects
class TransactionList {
    #data = [];
    #length;
    #beginDate;
    #endDate;

    constructor({data, length, beginDate, endDate}) {
        this.#data = data;
        this.#length = length;
        this.#beginDate = beginDate;
        this.#endDate = endDate;
    }

    addTransactions (transactions) {
        //logic to add transactions to the end of the list. needs to take into 
        //account the endDate. frontend should use httpHandler, and backend 
        //should use DBHandler
    }

    getTransactions() {
        return this.#data;
    }

    getLength() {
        return this.#length;
    }

    getBeginDate() {
        return this.#beginDate;
    }

    getEndDate() {
        return this.#endDate;
    }
}

class Transaction {
    #amount;
    #date;
    #subscription;
    #vendor;

    constructor({amount, date, subscription, vendor}) {
        this.#amount = amount;
        this.#date = date;
        this.#subscription = subscription;
        this.#vendor = vendor;
    }

    getAmount () {
        return this.#amount;
    }

    getDate () {
        return this.#date;
    }

    getSubscription () {
        return this.#subscription;
    }

    setSubscription (boolVal) {
        this.#subscription = boolVal;
    }

    getVendor () {
        return this.#vendor;
    }
}

export {
    User,
    Account,
    TransactionList,
    Transaction
};