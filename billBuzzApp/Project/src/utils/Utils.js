// function to return all transactions for a user in chronological order.
// can pass two date objects to only retrieve transactions for a specified time frame
// can also pass one date object to retrieve transaction from today back to a certain date.
const getAllTransactions = (user, endDate = null, startDate = null) => {
    let newList = [];
    for (const account of user.accountList) {
        const transactionList = account.transactionList.transactionList;
        for(const transaction of transactionList) {
            if (startDate != null && new Date(transaction.date) > startDate){
                continue;
            }
            if (endDate != null && new Date(transaction.date) < endDate){
                continue;
            }
            const transactionDate = new Date(transaction.date);
            if (newList.length > 0) {
                for (let i = 0; i < newList.length; i++) {
                    const listDate = new Date(newList[i].date);

                    if (transactionDate > listDate) {
                        newList.splice(i, 0, transaction);
                        break;
                    }
                    if (i === newList.length -1) {
                        newList.push(transaction);
                        break;
                    }
                }
            }
            else {
                newList.push(transaction);
            }
        }
    }

    return newList;
}

export {
    getAllTransactions
}