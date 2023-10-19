//JSON object that can be used to validate the types of objects in particular
//may not be necessary. commented out for the time being
/*const types = {
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
 }*/

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
    #variableList = ['email', 'password', 'firstName', 'lastName', 'birthday',
        'phoneNumber', 'bankBalance', 'availableCredit', 'accountList'];

    //needs to pass in a JSON object with all keys for email, password, 
    //firstName, lastName, birthDay, phoneNumber, bankBalance, availableCredit,
    //and account list
    constructor(data) {
        if (Array.isArray(data)){
            data = data[0];
        }
        let keyList = Object.keys(data);
        try {
            //iterate over keys and make sure that they exist in incoming data.
            //throw an error if not   
            this.#variableList.forEach((element) => {
                if (!keyList.includes(element)){
                    console.log('User Constructor failed, ', element,
                        ' was not provided');
                    //throw(err);
                }
            })

            //assign all the variables to the incoming data
            this.#email = data["email"];
            this.#password = data["password"];
            this.#firstName = data["firstName"];
            this.#lastName = data["lastName"];
            this.#birthday = new Date(data["birthday"]);
            this.#phoneNumber = data["phoneNumber"];
            this.#bankBalance = data["bankBalance"];
            this.#availableCredit = data["availableCredit"];
            this.#accountList = this.#objectifyAccounts(data["accountList"]);
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

    toJSONString () {
        let newDict = {};
        this.#variableList.forEach((element) => {
            let varString = 'this.#' + element;
            if (Array.isArray(eval(varString))) {
                let newList = [];
                //iterate over array calling toJSONString on each
                eval(varString).forEach((object) => {
                    newList.push(object.toJSONString());
                });
                newDict[element] = newList;
            }
            else {
                if (Object.prototype.toString.call(eval(varString)) === "[object Date]"){
                    newDict[element] = eval(varString).toISOString();
                }
                else if (Object.prototype.toString.call(eval(varString)) === 
                    "[object Number]") {
                    newDict[element] = eval(varString);
                }
                else {
                    newDict[element] = eval(varString).toString();
                }
            }
        });
        return JSON.stringify(newDict);
    };

    //iterate over the accountList array and convert to Account objects
    //return new array of Account objects
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
    #accessToken;
    #variableList = ['id', 'name', 'balance', 'transactionList'];

    constructor(data) {
        if (Array.isArray(data)){
            data = data[0];
        }
        let keyList = Object.keys(data);
        try {
            //iterate over keys and make sure that they exist in incoming data.
            //throw an error if not       
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
            this.#accessToken = data["accessToken"];
        }
        catch (err){
            console.log(err);
        }
    }

    toJSONString () {
        let newDict = {};
        this.#variableList.forEach((element) => {
            let varString = 'this.#' + element;
            if (Array.isArray(eval(varString))) {
                console.log('in array iterator');
                let newList = [];
                //iterate over array calling toJSONString on each
                eval(varString).forEach((object) => {
                    newList.push(object.toJSONString());
                });
                newDict[element] = newList;
                console.log(newDict);
            }
            else {
                if (Object.prototype.toString.call(eval(varString)) === "[object Date]"){
                    newDict[element] = eval(varString).toISOString();
                }
                else if (Object.prototype.toString.call(eval(varString)) === 
                    "[object Number]") {
                    newDict[element] = eval(varString);
                }
                else if (Object.prototype.toString.call(eval(varString)) === 
                    "[object Object]"){
                    newDict[element] = eval(varString).toJSONString();
                }
                else {
                    newDict[element] = eval(varString).toString();
                }
            }
        });
        return newDict
    };

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

    getAccessToken() {
        return this.#accessToken;
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
        if (Array.isArray(data)){
            data = data[0];
        }
        let keyList = Object.keys(data);
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

    toJSONString () {
        let newDict = {};
        this.#variableList.forEach((element) => {
            let varString = 'this.#' + element;
            if (Array.isArray(eval(varString))) {
                let newList = [];
                //iterate over array calling toJSONString on each
                eval(varString).forEach((object) => {
                    newList.push(object.toJSONString());
                });
                newDict[element] = newList;
            }
            else {
                if (Object.prototype.toString.call(eval(varString)) === "[object Date]"){
                    newDict[element] = eval(varString).toISOString();
                }
                else if (Object.prototype.toString.call(eval(varString)) === 
                    "[object Number]") {
                    newDict[element] = eval(varString);
                }
                else {
                    newDict[element] = eval(varString).toString();
                }
            }
        });
        return newDict;
    };

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
        if (Array.isArray(data)){
            data = data[0];
        }
        let keyList = Object.keys(data);
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

    toJSONString () {
        let newDict = {};
        this.#variableList.forEach((element) => {
            let varString = 'this.#' + element;
            if (Array.isArray(eval(varString))) {
                console.log('in array iterator');
                let newList = [];
                //iterate over array calling toJSONString on each
                eval(varString).forEach((object) => {
                    console.log('from transation toJSONString ',object);
                    newList.push(object.toJSONString());
                });
                newDict[element] = newList;
            }
            else {                
                if (Object.prototype.toString.call(eval(varString)) === "[object Date]"){
                    newDict[element] = eval(varString).toISOString();
                }
                else if (Object.prototype.toString.call(eval(varString)) === 
                    "[object Number]") {
                    newDict[element] = eval(varString);
                }
                else if (Object.prototype.toString.call(eval(varString)) ===
                    "[object Null]") {
                    newDict[element] = "";
                }
                else if (Object.prototype.toString.call(eval(varString)) ===
                    "[object Boolean]"){
                    newDict[element] = eval(varString);
                }
                else {
                    newDict[element] = eval(varString).toString();
                }
            }
        });
        return newDict;
    };

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