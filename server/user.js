class User {

    email = '';
    password = '';
    firstName = '';
    lastName = '';
    birthday = '';
    phoneNumber = '';
    bankBalance = 0.0;
    availableCredit = 0.0;

    constructor({
                    email,
                    password,
                    firstName,
                    lastName,
                    birthday,
                    phoneNumber,
                    bankBalance,
                    availableCredit
                }) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
        this.bankBalance = bankBalance;
        this.availableCredit = availableCredit;
    }
}

export { User };