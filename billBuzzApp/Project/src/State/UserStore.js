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
            updateUser: action
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
    }
}

export default new UserStore();