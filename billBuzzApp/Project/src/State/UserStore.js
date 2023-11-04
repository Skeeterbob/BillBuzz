import {makeObservable, observable, action} from "mobx";



// Authored by Hadi Ghaddar from line(s) 1 - 65



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
}

export default new UserStore();