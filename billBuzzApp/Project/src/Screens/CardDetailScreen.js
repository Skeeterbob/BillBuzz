import React from "react";
import {View, StyleSheet, Text, ScrollView, ImageBackground} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import CreditCardImage from '../../assets/images/credit_card.png';

const MOCK_CARD_DATA = {
    cardName: 'American Express',
    balance: 1000.84,
    amountDue: 100,
    dueDate: '09/24/2023',
    transactions: [
        {
            name: 'Netflix',
            date: '09/01/2023',
            amount: '17.99'
        },
        {
            name: 'Costco',
            date: '09/02/2023',
            amount: '148.23'
        },
        {
            name: 'Walmart',
            date: '09/03/2023',
            amount: '284.20'
        },
        {
            name: 'Discord',
            date: '09/04/2023',
            amount: '9.99'
        }
    ]
};

class CardDetailScreen extends React.Component {

    render() {

        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.body}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <ImageBackground source={CreditCardImage} style={styles.creditCard} resizeMode={"stretch"}>
                        <Text style={styles.creditCardTitle}>{MOCK_CARD_DATA.cardName}</Text>
                    </ImageBackground>

                    <View style={styles.transactions}>
                        <View style={styles.transactionsHeader}>
                            <Text style={styles.transactionsTitle}>Transactions</Text>
                        </View>

                        {MOCK_CARD_DATA.transactions.map(transaction => (
                            <TransactionCardComponent
                                key={`${transaction.name}-${transaction.date}-${transaction.amount}`}
                                name={transaction.name}
                                date={transaction.date}
                                amount={transaction.amount}
                            />
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    }
}

const TransactionCardComponent = ({name, date, amount}) => (
    <LinearGradient
        colors={['rgba(28, 28, 29, 0.6)', 'rgba(77, 75, 70, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.8, 1]}

        style={styles.transactionCard}
    >
        <View>
            <Text style={{color: '#F4CE82', fontSize: 14}}>Merchant</Text>
            <Text style={{color: '#eca239', fontSize: 18, fontWeight: 'bold'}}>{name}</Text>
        </View>

        <View>
            <Text style={{color: '#F4CE82', fontSize: 14}}>Amount</Text>
            <Text style={{color: '#eca239', fontSize: 18, fontWeight: 'bold'}}>${amount}</Text>
        </View>

        <View>
            <Text style={{color: '#F4CE82', fontSize: 14}}>Date</Text>
            <Text style={{color: '#eca239', fontSize: 18, fontWeight: 'bold'}}>{date}</Text>
        </View>
    </LinearGradient>
);

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0B0D10'
    },
    scrollViewContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    creditCard: {
        width: 380,
        height: 250,
        borderRadius: 6,
        display: 'flex',
        marginTop: 20,
        paddingTop: 12,
        paddingLeft: 20
    },
    creditCardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e1e1e'
    },
    transactions: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    transactionsHeader: {
        width: '90%',
        height: 'auto',
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#FFFFFF',
        borderStyle: 'solid',
        marginBottom: 16
    },
    transactionsTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 26
    },
    transactionCard: {
        width: '90%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 6,
        padding: 8,

        shadowColor: '#232323',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 10,
        elevation: 4,
    }
});

export default CardDetailScreen;