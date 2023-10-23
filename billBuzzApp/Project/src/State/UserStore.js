import {makeObservable, observable, action} from "mobx";

class UserStore {
    email = '';
    password = '';
    firstName = '';
    lastName = '';
    birthday = '';
    phoneNumber = '';
    bankBalance = 0;
    availableCredit = 0;
    accountList = [];
    weeklyData = [];

    constructor() {
        makeObservable(this, {
            email: observable,
            password: observable,
            firstName: observable,
            lastName: observable,
            birthday: observable,
            phoneNumber: observable,
            bankBalance: observable,
            availableCredit: observable,
            accountList: observable,
            weeklyData: observable,
            updateUser: action,
            clearUser: action,
        });
    }

    updateUser(user) {
        this.email = user.email;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.birthday = user.birthday;
        this.phoneNumber = user.phoneNumber;
        this.bankBalance = user.bankBalance;
        this.availableCredit = user.availableCredit;
        this.accountList = user.accountList;
        this.weeklyData = user.weeklyData;
    }

    clearUser() {
        this.email = '';
        this.password = '';
        this.firstName = '';
        this.lastName = '';
        this.birthday = '';
        this.phoneNumber = '';
        this.bankBalance = 0;
        this.availableCredit = 0;
        this.accountList = [];
        this.weeklyData = [];
    }

    // function to return all transactions for a user in chronological order.
    // can pass two date objects to only retrieve transactions for a specified time frame
    // can also pass one date object to retrieve transaction from today back to a certain date.
    getAllTransactions(endDate = null, startDate = null) {
        var newList = [];
        for (const account of this.accountList) {
            const transactionList = account.transactionList.transactionList;
            for(const transaction of transactionList) {
                if (startDate != null && new Date(transaction.date) > startDate){
                    continue;
                }
                if (endDate != null && new Date(transaction.date) < endDate){
                    continue;
                }


                transactionDate = new Date(transaction.date);
                if (newList.length > 0) {
                    for (let i = 0; i < newList.length; i++) {
                        const listDate = new Date(newList[i].date);

                        if (transactionDate > listDate) {
                            newList.splice(i, 0, transaction);
                            break;
                        }
                        if (i == newList.length -1) {
                            newList.push(transaction);
                            break;
                        }
                    }
                }
                else {
                    newList.push(transaction);
                }

            };
        };
        return newList;
    }
}

export default new UserStore();