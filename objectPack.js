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
        try {     
            this.#variableList.forEach((element) => {
                if (!keyList.includes(element)){
                    console.log('User Constructor failed, ', element,
                        ' was not provided');
                    throw(err);
                }
            })
            this.#email = data["email"];
            this.#password = data["password"];
            this.#firstName = data["firstName"];
            this.#lastName = data["lastName"];
            this.#birthday = new Date(data["birthday"]);
            this.#phoneNumber = data["phoneNumber"];
            this.#bankBalance = data["bankBalance"];
            this.#availableCredit = data["availableCredit"];
            this.#accountList = data["accountList"];
            this.#accountList = this.#objectifyAccounts(this.#accountList);
        }
        catch (err){
            console.log(err);
        }
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
    #variableList = ['id', 'name', 'balance', 'transactionList'];

    constructor(data) {
        keyList = data.keys();
        try {     
            this.#variableList.forEach((element) => {
                if (!keyList.includes(element)){
                    console.log('Account Constructor failed, ', element,
                        ' was not provided');
                    throw(err);
                }
            })
            this.#id = data["id"];
            this.#name = data["name"];
            this.#balance = data["balance"];
            this.#transactionList = new TransactionList(data["transactionList"]);
        }
        catch (err){
            console.log(err);
        }
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
    #transactionList = [];
    #length;
    #beginDate;
    #endDate;
    #variableList = ['transactionList', 'length', 'beginDate', 'endDate'];

    constructor(data) {
        keyList = data.keys();
        try {     
            this.#variableList.forEach((element) => {
                if (!keyList.includes(element)){
                    console.log('TransactionList Constructor failed, ', element,
                        ' was not provided');
                    throw(err);
                }
            })
            this.#transactionList = this.#objectifyTransactions(
                    data["transactionList"]);
            this.#length = data["length"];
            this.#beginDate = new Date(data["beginDate"]);
            this.#endDate = new Date(data['endDate']);
        }
        catch (err){
            console.log(err);
        }
    }

    //function to iterate over array json objects and turn them into
    //transaction objects returning an array of transaction objects
    #objectifyTransactions (list) {
        let newList = [];
        list.forEach((element) => {
            newList.push(new Transaction(element));
        });
        return newList;
    }

    //should only be called from the front end??
    addTransactions (transactions) {
        //logic to add transactions to the end of the list. needs to take into 
        //account the endDate. frontend should use httpHandler, and backend 
        //should use DBHandler
    }

    getTransactions() {
        return this.#transactionList;
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
    #amount; //number
    #date; //should be a date object
    #subscriptionBool = false; //boolean to indicate if it is or isn't a subscription
    #subscriptionName = null; 
    #vendor; 
    #variableList = ['amount', 'date', 'subscriptionBool', 'subscriptionName',
        'vendor']

    constructor(data) {
        keyList = data.keys();
        try {     
            this.#variableList.forEach((element) => {
                if (!keyList.includes(element)){
                    console.log('Transaction Constructor failed, ', element,
                        ' was not provided');
                    throw(err);
                }
            })
            this.#amount = data["amount"];
            this.#date = new Date(data["date"]);
            if(data['subscriptionBool']){
                this.#subscriptionBool = data['subscriptionBool'];
                this.#subscriptionName = data["subscriptionName"];
            }            
            this.#vendor = data['vendor'];
        }
        catch (err){
            console.log(err);
        }
    }

    getAmount () {
        return this.#amount;
    }

    getDate () {
        return this.#date;
    }

    isSubscription () {
        return this.#subscriptionBool;
    }

    setSubscriptionBool (boolVal) {
        this.#subscriptionBool = boolVal;
    }

    getSubscriptionName () {
        return this.#subscriptionName;
    }

    setSubscriptionName(name){
        this.#subscriptionName = name;
    }

    getVendor () {
        return this.#vendor;
    }
}

export { User }