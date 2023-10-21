import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import { SERVER_ENDPOINT } from "@env";


const TransactionScreen = () => {
    const [data]= useState([]);
    const endDate = new Date().toLocaleDateString('en-CA');

    fetch(SERVER_ENDPOINT + '/plaid/getTransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: 'ACCESS_TOKEN', 
          startDate: '2022-1-1', 
          endDate: endDate, 
        }),
      })
        .then(response => response.json())
        .then(transactions => {
          if (transactions && transactions.length > 0) {
            this.setState({ transactions: data.transactions || [] });
          } else {
            console.log('No transactions available');
          }
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    return (

        <RNLinearGradient
            colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
            locations={[0, 0.2, 0.4, 0.8, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ backgroundColor: '#0B0D10', width: '100%', height: '100%' }}
        >
            <View style={styles.summaryHeader}>
                <Text style={styles.lineChartTitle}>Recent Transactions</Text>
            </View>
            <SectionList
                sections={data}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text style={item.type === 'debit' ? styles.debit : styles.credit}>
                            {item.description}: ${item.amount}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </RNLinearGradient>
    );

};

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
});

export default TransactionScreen;
