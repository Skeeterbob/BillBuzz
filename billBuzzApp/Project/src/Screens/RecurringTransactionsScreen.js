import React from "react";
import { inject, observer } from "mobx-react";
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SERVER_ENDPOINT } from "@env";
import moment from 'moment'


// Authored by Hadi Ghaddar from line(s) 1 - 252




class RecurringTransactionsScreen extends React.Component {

    state = {
        transactions: [],
        loaded: false,
        overdraftAlertThreshold: '',
    };
    handleTransactionInputChange = (text) => {
        // Here you would parse the text input into a transaction object
        // This example assumes the input text is a JSON representation of the transaction
        try {
            let transaction = JSON.parse(text);
            this.setState(prevState => ({
                transactions: [...prevState.transactions, transaction]
            }), () => {
                // Now that the state is updated, you can check for overdraft
                this.calcProjectedBalance();
            });
        } catch (e) {
            console.error('Error parsing transaction input:', e);
        }
    };
    setOverdraftAlertThreshold = (newThreshold) => {
        if (newThreshold.trim() === "") {
            this.setState({ overdraftAlertThreshold: '' }); // Allow the user to clear the input
            return;
        }
    
        const numericThreshold = parseFloat(newThreshold);
        if (!isNaN(numericThreshold) && numericThreshold >= 0) {
            this.setState({ overdraftAlertThreshold: numericThreshold }, () => {
                // State is updated, now we can check for overdraft
                const overdraftPrediction = this.calcProjectedBalance();
                // ... your logic for handling overdraft prediction
            });
        } else {
            alert('Please enter a valid number for the overdraft alert threshold.');
        }
    };
    calcBalance = () => {
        let balance = 0.0;
        for (const account of this.props.userStore.accountList) {
            balance += parseFloat(account.balance);
        }

        return Math.round(balance * 100) / 100;
    }
    calcProjectedBalance = () => {
        const { overdraftAlertThreshold } = this.state;
        const user = this.props.userStore;
        let transactions = [];
        
        for (const account of user.accountList) {
            account.transactionList.transactionList.forEach(value => transactions.push(value));
        }
        
        let filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionAmount = parseFloat(transaction.amount);
            const start = this.state.startDate ? new Date(this.state.startDate) : null;
            const end = this.state.endDate ? new Date(this.state.endDate) : null;
        
            // Check if transaction date is within the range and amount is non-negative
            return (!start || transactionDate >= start) && (!end || transactionDate <= end) && transactionAmount >= 0;
        });
        
        filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB; // Sorting in ascending order by date
        });
        
        console.log('Filtered (non-negative) and Sorted Transactions:', filteredTransactions);
        let balance = this.calcBalance(); // Ensure this method returns the current balance correctly
        let projectedBalance = balance;
        console.log(`Initial balance: ${balance}`);
        
        // Now use the filtered and sorted transactions for the projection
        for (const transaction of filteredTransactions) {
            projectedBalance -= parseFloat(transaction.amount);
            console.log(`after transaction on ${transaction.date}: $${projectedBalance}`);
            if (projectedBalance < overdraftAlertThreshold) {
                // Overdraft is within the alert threshold
                return {
                    overdraft: true,
                    date: transaction.date, // Ensure this is the correct date property
                    overdraftAmount: Math.abs(projectedBalance - overdraftAlertThreshold),
                    withinThreshold: projectedBalance < 0
                };
            }
        }
        
        console.log('No overdraft will occur');
        // No overdraft will occur
        return { overdraft: false };
    }

    componentDidMount() {
        const token = this.props.route.params.accessToken;
    
        if (!token) {
            this.setState({ loaded: true });
            return;
        }
    
        fetch(SERVER_ENDPOINT + '/plaid/getrecurringTransactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accessToken: token
            })
        })
        .then(result => {
            if (!result.ok) {
                throw new Error('Network response was not ok');
            }
            return result.json();
        })
        .then(data => {
            if (!data.error) {
                this.setState({ transactions: data.transactions }, () => {
                    const overdraftPrediction = this.calcProjectedBalance();
                    console.log('Overdraft Prediction:', overdraftPrediction);
                    if (overdraftPrediction.overdraft) {
                        const message = overdraftPrediction.withinThreshold
                            ? `Warning: Projected overdraft of $${overdraftPrediction.overdraftAmount} on ${moment(overdraftPrediction.date).format('LL')}!`
                            : `Alert: Your balance is projected to go below your set threshold of $${this.state.overdraftAlertThreshold} on ${moment(overdraftPrediction.date).format('LL')}.`;
                        alert(message);
                    }
                });
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
            // Handle the error state here, maybe set some state to show an error message
        })
        .finally(() => {
            this.setState({ loaded: true });
        });
    }

    render() {
        const { transactions, loaded, overdraftAlertThreshold } = this.state;


        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ backgroundColor: '#0B0D10', width: '100%', height: '100%' }}
            >
                <ScrollView contentContainerStyle={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
                }}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.headerButton}
                            onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.summaryHeader}>
                        <View style={styles.alertThresholdInput}>
                            <Text style={{ color: '#FFFFFF' }}>Set Alert Threshold: $</Text>
                            <TextInput
                              value={overdraftAlertThreshold.toString()}
                              onChangeText={(text) => this.setOverdraftAlertThreshold(text)}
                              keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.lineChartTitle}>Recurring Transactions</Text>
                    </View>

                    {!loaded ? <ActivityIndicator size={'large'} color={'#eca239'} /> : null}

                    {loaded && transactions.length <= 0 ? <Text style={styles.noTransactionText}>No Recurring transactions found!</Text> : null}

                    {transactions.map(transaction =>
                        <TransactionComponent
                            key={transaction.name + '-' + Math.random()}
                            transaction={transaction}
                        />
                    )}

                </ScrollView>
            </RNLinearGradient>
        );
    }
}

const TransactionComponent = (transaction) => {
    console.log(transaction)

    return (
        <View style={styles.transaction}>
            <View style={styles.transactionData}>
                <Text style={{ color: '#f3a111' }}>{transaction.transaction.name}</Text>
                <Text style={{ color: '#f3a111' }}>${transaction.transaction.amount}</Text>
            </View>
            <View style={styles.transactionDate}>
                <Text style={{ color: '#ffffff', fontStyle: 'italic' }}>{transaction.transaction.vendorName ? transaction.transaction.vendorName : 'N/A'}</Text>
            </View>
        </View>
    );
};

const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + '...' : text;
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
}

const styles = StyleSheet.create({
    alertThresholdInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        // Add other styling as needed
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        padding: 8,
        width: 100, // Adjust width as needed
        // Add other styling as needed
    },
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    transactionDate: {
        alignSelf: 'flex-end',

    },
    lineChartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(221, 221, 221, 0.5)', // semi-transparent background for headers
        padding: 10,
        marginTop: 10,
    },
    summaryHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderBottomWidth: 2,
    },
    debit: {
        color: 'red',
    },
    credit: {
        color: 'green',
    },
    transaction: {
        width: '90%',
        height: 'auto',
        borderRadius: 6,
        backgroundColor: '#212121',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 12,
        padding: 8
    },
    transactionHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    transactionData: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignItems: 'center',
        marginTop: 16
    },
    filterInput: {
        width: '60%',
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#212121',
        color: '#FFFFFF'
    },
    pickerContainer: {
        borderRadius: 6,
        marginLeft: 6
    },
    filterPicker: {
        flex: 1,
        backgroundColor: '#eca239',
        color: '#FFFFFF',
        marginLeft: 8
    },
    pageHeader: {
        width: '100%',
        height: 'auto',
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerButton: {
        width: 'auto',
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F4CE82',
        borderRadius: 25
    },
    backText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    noTransactionText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold'
    }
})

export default inject('userStore')(observer(RecurringTransactionsScreen));