import React from "react";
import {View, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions, Platform, StatusBar} from "react-native";
import {LinearGradient as RNLinearGradient} from 'react-native-linear-gradient';
import HexagonComponent from "../Components/HexagonComponent";
import Icon from "react-native-vector-icons/Ionicons";
import {inject, observer} from "mobx-react";


// Authored by Hadi Ghaddar from Line(s) 1 - 277


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
                        {this.props.userStore.accountList.length <= 0 ? <Text style={styles.noAccountsText}>No accounts linked!</Text> : null}
                        
                        {this.props.userStore.accountList.map(account => (
                            <CreditCardComponent 
                                names={account.names}
                                key={account.id}
                                name={account.name}
                                balance={account.balance}
                                amountDue={0}
                                dueDate={'N/A'}
                                transactions={account.transactionList ? account.transactionList.transactionList : []}
                                token={account.accessToken}
                                navigation={this.navigation}
                            />
                        ))}
                    </View>
                    
                </ScrollView>
            </RNLinearGradient>
        );
    };
}

const CreditCardComponent = ({names, name, balance, amountDue, dueDate, transactions, token, navigation}) => (
    
    <TouchableOpacity style={styles.creditCard} onPress={() => {
        navigation.navigate({
            name: 'CardDetails',
            params: {
                cardData: {
                    names,
                    name,
                    balance,
                    amountDue,
                    dueDate,
                    transactions,
                    accessToken: token
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
                <Text style={styles.cardDataTitleText}></Text>
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
    cardContainer: {
        borderWidth: 3,
        borderColor: '#696969', // changed border color to darker gray
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#696969', // changed background color to darker gray
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
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
    noAccountsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF'
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