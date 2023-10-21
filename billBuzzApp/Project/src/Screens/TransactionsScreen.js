import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import {inject, observer} from "mobx-react";

class TransactionScreen extends React.Component {

    render() {
        const user = this.props.userStore;
        let transactions = [];
        for (const account of user.accountList) {
            account.transactionList.transactionList.forEach(value => transactions.push(value))
        }

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ backgroundColor: '#0B0D10', width: '100%', height: '100%' }}
            >

                <ScrollView contentContainerStyle={{width: '100%', display: 'flex', alignItems: 'center'}}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.lineChartTitle}>Recent Transactions</Text>
                    </View>

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
    console.log(JSON.stringify(transaction));

    return (
        <View style={styles.transaction}>
            <View style={styles.transactionHeader}>
                <Text style={{color: '#FFFFFF'}}>Merchant</Text>
                <Text style={{color: '#FFFFFF'}}>Amount</Text>
                <Text style={{color: '#FFFFFF'}}>Date</Text>
            </View>

            <View style={styles.transactionData}>
                <Text style={{color: '#f3a111'}}>{transaction.transaction.subscriptionName}</Text>
                <Text style={{color: '#f3a111'}}>${transaction.transaction.amount}</Text>
                <Text style={{color: '#f3a111'}}>{formatDate(transaction.transaction.date)}</Text>
            </View>
        </View>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
}

const styles = StyleSheet.create({
    
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
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
        paddingTop: 40,
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
    }
});

export default inject('userStore')(observer(TransactionScreen));
