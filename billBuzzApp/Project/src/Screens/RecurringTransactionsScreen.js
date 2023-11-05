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
    View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SERVER_ENDPOINT } from "@env";



// Authored by Hadi Ghaddar from line(s) 1 - 252




class RecurringTransactionsScreen extends React.Component {

    state = {
        transactions: [],
        loaded: false,
        isAtRiskOfOverdraft: false, // New state property
        overdraftAmount: 0,         // New state property
    };

    checkOverdraftRisk = async () => {
        const token = this.props.route.params.accessToken;
        if (!token) {
            // Handle error, such as showing an alert or updating the state
            console.error('Access token is required!');
            return;
        }

        try {
            const response = await fetch(`${SERVER_ENDPOINT}/checkOverdraftRisk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: token,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                this.setState({
                    isAtRiskOfOverdraft: data.isAtRisk,
                    overdraftAmount: data.overdraftAmount,
                });
                if (data.isAtRisk) {
                    alert(`Warning: You are at risk of overdrafting by $${data.overdraftAmount}!`);
                }
            } else {
                throw new Error(data.error || 'An error occurred while checking for overdraft risk.');
            }
        } catch (error) {
            console.error(error);
            // Handle error, such as showing an alert or updating the state
        }
    };

    componentDidMount() {
        const token = this.props.route.params.accessToken;
        this.checkOverdraftRisk();
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
    }

    render() {
        const { transactions, loaded, isAtRiskOfOverdraft, overdraftAmount } = this.state;

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
                    {isAtRiskOfOverdraft && (
                        <View style={styles.overdraftWarning}>
                            <Text style={styles.overdraftWarningText}>
                                Warning: You are at risk of overdrafting by ${overdraftAmount.toFixed(2)}!
                            </Text>
                        </View>
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
    overdraftWarning: {
        padding: 10,
        margin: 10,
        backgroundColor: 'red', // or any color indicating a warning
        borderRadius: 5,
    },
    overdraftWarningText: {
        color: 'white',
        textAlign: 'center',
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