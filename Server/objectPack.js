//class to store user data to be read from
class User {
    #firstName;
    #lastName;
    #birthday;
    #bankBalance;
    #availCredit;
    #email;
    #phoneNumber;
    #transactionList = [];
    #accountList = [];

    //function to add an account to the account list
    /*addAccount(account) { 
        need to make sure that it is of class account and add it to the accountList
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

    getTransactionList () {
        return this.#transactionList;
    }

}