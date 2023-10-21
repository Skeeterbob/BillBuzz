import React from "react";
import {View, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions, Platform, StatusBar} from "react-native";
import {LinearGradient as RNLinearGradient} from 'react-native-linear-gradient';
import HexagonComponent from "../Components/HexagonComponent";
import Icon from "react-native-vector-icons/Ionicons";
import {inject, observer} from "mobx-react";

const MOCK_TRANSACTIONS = [
    {
        name: 'Netflix',
        date: '09/01/2023',
        amount: '17.99'
    },
    {
        name: 'Statbucks',
        date: '09/01/2023',
        amount: '16.99'
    },
    {
        name: 'Costco',
        date: '09/02/2023',
        amount: '148.23'
    },
    {
        name: 'Statbucks',
        date: '09/03/2023',
        amount: '5.13'
    },
    {
        name: 'Walmart',
        date: '09/03/2023',
        amount: '284.20'
    },
    {
        name: 'Statbucks',
        date: '09/04/2023',
        amount: '8.59'
    },
    {
        name: 'Discord',
        date: '09/05/2023',
        amount: '9.99'
    },
    {
        name: 'Statbucks',
        date: '09/06/2023',
        amount: '24.83'
    },
]

const MOCK_CARDS_DATA = [
    {
        name: "American Express",
        balance: 1000.84,
        amountDue: 100,
        dueDate: '09/24/2023',
        transactions: MOCK_TRANSACTIONS
    },
    {
        name: "Chase Sapphire Reserve",
        balance: 2540,
        amountDue: 324.27,
        dueDate: '09/12/2023',
        transactions: MOCK_TRANSACTIONS
    },
    {
        name: "Discover IT Student",
        balance: 3480.28,
        amountDue: 124.86,
        dueDate: '09/15/2023',
        transactions: MOCK_TRANSACTIONS
    },
    {
        name: "TJ Max Rewards",
        balance: 524.12,
        amountDue: 24.78,
        dueDate: '09/20/2023',
        transactions: MOCK_TRANSACTIONS
    }
];

class AccountsScreen extends React.Component {

    navigation = null;

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    componentDidMount() {
        console.log(JSON.stringify(this.props.userStore.accountList))
    }

    calcHexagonSize = () => {
        const dimensions = Dimensions.get('screen');
        return Math.min(300, (dimensions.width - 32));
    };

    calcBalance = () => {
        let balance = 0.0;
        for (const account of this.props.userStore.accountList) {
            balance += parseFloat(account.balance);
        }

        return Math.round(balance * 100) / 100;
    }

    render() {
        const hexagonSize = this.calcHexagonSize();
        const balance = this.calcBalance();

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{backgroundColor: '#0B0D10', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}
            >
                <ScrollView style={styles.body}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                        </TouchableOpacity>
                        <Text style={styles.backText}>Back</Text>
                    </View>

                    <View style={styles.dashboardTop}>
                        <HexagonComponent size={hexagonSize}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 32}}>${balance}</Text>
                            <Text style={{color: '#FFFFFF', fontSize: 18}}>Total Balance</Text>
                        </HexagonComponent>
                    </View>

                    <View style={styles.creditCardView}>
                        {this.props.userStore.accountList.map(account => (
                            <CreditCardComponent
                                key={account.id}
                                name={account.name}
                                balance={account.balance}
                                amountDue={0}
                                dueDate={'N/A'}
                                transactions={account.transactionList.transactionList}
                                navigation={this.navigation}
                            />
                        ))}
                    </View>
                </ScrollView>
            </RNLinearGradient>
        );
    };
}

const CreditCardComponent = ({name, balance, amountDue, dueDate, transactions, navigation}) => (
    <TouchableOpacity style={styles.creditCard} onPress={() => {
        navigation.navigate({
            name: 'CardDetails',
            params: {
                cardData: {
                    name,
                    balance,
                    amountDue,
                    dueDate,
                    transactions
                }
            }
        })
    }}>
        <RNLinearGradient
            style={styles.creditCardGradient}
            colors={['#F4CE82', '#eca239']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            <View style={styles.creditCardTop}>
                <Text style={styles.creditCardNameText}>{name}</Text>
            </View>

            <RNLinearGradient
                style={styles.divider}
                colors={['#FFFFFF', '#eca239']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />

            <View style={styles.creditCardBottom}>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.cardDataTitleText}>Payment Date</Text>
                    <Text style={styles.cardDataText}>{dueDate}</Text>
                </View>

                <View style={{alignItems: 'center'}}>
                    <Text style={styles.cardDataTitleText}>Card Balance</Text>
                    <Text style={styles.cardDataText}>${balance}</Text>
                </View>

                <View style={{alignItems: 'center'}}>
                    <Text style={styles.cardDataTitleText}>Amount Due</Text>
                    <Text style={styles.cardDataText}>${amountDue}</Text>
                </View>
            </View>
        </RNLinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    bodyGradient: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    body: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    dashboardTop: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,

        borderBottomColor: '#19191B',
        borderBottomWidth: 4,
        borderStyle: 'solid'
    },
    creditCardNameText: {
        color: '#0B0D10',
        fontSize: 18,
        fontWeight: 'bold'
    },
    cardDataTitleText: {
        fontSize: 16,
        color: '#0B0D10',
        fontWeight: 'bold'
    },
    cardDataText: {
        fontSize: 16,
        color: '#1f1f1f'
    },
    creditCardView: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16
    },
    creditCardGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    creditCard: {
        width: '90%',
        height: 100,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 6,

        shadowColor: '#626262',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 10,
        elevation: 4
    },
    creditCardTop: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    divider: {
        width: '100%',
        height: 2,
    },
    creditCardBottom: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    pageHeader: {
        width: '100%',
        height: 'auto',
        paddingLeft: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        width: 40,
        height: 40,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F4CE82',
        borderRadius: 25
    },
    backText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default inject('userStore')(observer(AccountsScreen));