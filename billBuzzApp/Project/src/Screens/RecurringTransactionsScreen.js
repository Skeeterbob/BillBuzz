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



// Authored by Hadi Ghaddar from line(s) 1 - 252




class RecurringTransactionsScreen extends React.Component {

    state = {
        transactions: [],
        loaded: false,
        overdraftAlertThreshold: 250,
    };
    setOverdraftAlertThreshold = (newThreshold) => {
        if (newThreshold.trim() === "") {
            this.setState({ overdraftAlertThreshold: '' }); // Allow the user to clear the input
            return;
        }
    
        const numericThreshold = parseFloat(newThreshold);
        if (!isNaN(numericThreshold) && numericThreshold >= 0) {
            this.setState({ overdraftAlertThreshold: numericThreshold });
            // Save to backend here if necessary
            // For instance, if you have an API endpoint to update this value, make an API call here
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
        const { transactions, overdraftAlertThreshold } = this.state;
        let balance = this.calcBalance();
        let projectedBalance = balance;

        let sortedTransactions = [...transactions].sort(
            (a, b) => new Date(a.nextDate) - new Date(b.nextDate)
        );

        for (const transaction of sortedTransactions) {
            projectedBalance -= transactions.amount;
            if (projectedBalance < overdraftAlertThreshold) {
                // Overdraft is within the alert threshold
                return {
                    overdraft: true,
                    date: transactions.nextDate,
                    overdraftAmount: Math.abs(projectedBalance),
                    withinThreshold: projectedBalance < 0
                };
            }
        }
        // No overdraft will occur
        return { overdraft: false };
    }

    componentDidMount() {
        const token = this.props.route.params.accessToken;
        // this.checkOverdraftRisk();
      
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
            .then(result => result.json())
            .then(data => {
                if (!data.error) {
                    this.setState({ transactions: data.transactions })
                }
            })
            .catch(console.error)

        this.setState({ loaded: true });
        this.setState({ loaded: true }, () => {
            const overdraftPrediction = this.calcProjectedBalance();
            if (overdraftPrediction.overdraft) {
                const message = overdraftPrediction.withinThreshold
                    ? `Warning: Predicted overdraft of $${overdraftPrediction.overdraftAmount} on ${moment(overdraftPrediction.date).format('LL')}!`
                    : `Alert: Your balance is projected to go below your set threshold of $${this.state.overdraftAlertThreshold} on ${moment(overdraftPrediction.date).format('LL')}.`;
                alert(message);
                console.log("fuck");
                console.log("fuck");
                console.log("fuck");
                console.log("fuck");
            }
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
                                value={this.state.overdraftAlertThreshold.toString()}
                                onChangeText={(text) => this.setOverdraftAlertThreshold(text)}
                                keyboardType="numeric" // This prompts the user for a numeric input
                            // ... other props ...
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