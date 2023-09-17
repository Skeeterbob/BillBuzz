//JSON object that can be used to validate the types of objects in particular
var types = {
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
    #firstName;
    #lastName;
    #birthday;
    #bankBalance;
    #availCredit;
    #email;
    #phoneNumber;
    #accountList = [];
    #password;

    //function to add an account to the account list
    /*addAccount(account) { 
        need to make sure that it is of class account and add it to the 
        accountList
    }*/

    //function to remove an account from accountList
    /*removeAccount(id) {
        remove the Account
    }*/
    getFirstName () {
        return this.#firstName;
    }
    
    getLastName () {
        return this.#lastName;
    }
    
    getBirthday () {
        return this.#birthday;
    }
    
    getBankBal () {
        return this.#bankBalance;
    }
    
    getAvailableCredit () {
        return this.#availCredit;
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

}

class Account {
    #id;
    #name;
    #balance;
    #transactionList;

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

    getTransactionList () {
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

    addTransactions (transactions) {
        //logic to add transactions to the end of the list. needs to take into 
        //account the endDate. frontend should use httpHandler, and backend 
        //should use DBHandler
    }
}

class Transaction {
    #amount;
    #date;
    #subscription;
    #vendor;

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