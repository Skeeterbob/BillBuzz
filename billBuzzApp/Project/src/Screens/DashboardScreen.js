import React from "react";
import {View, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions} from "react-native";
import {LinearGradient as RNLinearGradient} from 'react-native-linear-gradient';
import Svg, {Defs, Path, Stop, LinearGradient, G} from "react-native-svg";

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

class DashboardScreen extends React.Component {

    navigation = null;

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    calcHexagonSize = () => {
        const dimensions = Dimensions.get('screen');
        return Math.min(300, (dimensions.width - 32));
    };

    calcBalance = () => {
        let balance = 0.0;
        for (const card of MOCK_CARDS_DATA) {
            balance += card.balance;
        }

        return Math.round(balance * 100) / 100;
    }

    render = () => {
        const hexagonSize = this.calcHexagonSize();
        const balance = this.calcBalance();

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{backgroundColor: '#0B0D10'}}
            >
                <ScrollView style={styles.body}>
                    <View style={styles.dashboardTop}>
                        <HexagonComponent size={hexagonSize}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 32}}>${balance}</Text>
                            <Text style={{color: '#FFFFFF', fontSize: 18}}>Total Balance</Text>
                        </HexagonComponent>
                    </View>

                    <View style={styles.creditCardView}>
                        {MOCK_CARDS_DATA.map(card => (
                            <CreditCardComponent
                                key={card.name}
                                name={card.name}
                                balance={card.balance}
                                amountDue={card.amountDue}
                                dueDate={card.dueDate}
                                transactions={card.transactions}
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

const HexagonComponent = (props) => {
    return (
        <Svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1929.11 1748.58"
            width={props.size}
            height={props.size}
        >
            <Defs>
                <LinearGradient
                    id="linear-gradient"
                    x1={0}
                    y1={876.29}
                    x2={1929.11}
                    y2={876.29}
                    gradientTransform="matrix(1 0 0 -1 0 1750.58)"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0} stopColor="#faf9e2"/>
                    <Stop offset={0.11} stopColor="#f4e5bb"/>
                    <Stop offset={0.25} stopColor="#edce8f"/>
                    <Stop offset={0.4} stopColor="#e6ba6b"/>
                    <Stop offset={0.55} stopColor="#e1ad50"/>
                    <Stop offset={0.7} stopColor="#dca139"/>
                    <Stop offset={0.85} stopColor="#da9c2e"/>
                    <Stop offset={1} stopColor="#da992b"/>
                </LinearGradient>
            </Defs>
            <G opacity={0.15}>
                <Path
                    d="M1268.89 1662.84H660.22c-93.1 0-179.86-50.09-226.41-130.72l-304.33-527.11c-46.55-80.63-46.55-180.8 0-261.43l304.33-527.13c46.55-80.63 133.31-130.72 226.41-130.72h608.67c93.1 0 179.86 50.09 226.41 130.72l304.33 527.12c46.55 80.63 46.55 180.81 0 261.43l-304.33 527.12c-46.55 80.63-133.31 130.72-226.41 130.72z"
                    fill="#faba45"
                    strokeWidth={0}
                />
            </G>
            <G opacity={0.7}>
                <Path
                    d="M1177 1484.74H705.81c-72.07 0-139.23-38.77-175.27-101.19l-235.6-408.07c-36.04-62.42-36.04-139.97 0-202.39l235.6-408.07c36.04-62.42 103.2-101.19 175.27-101.19H1177c72.08 0 139.24 38.78 175.27 101.19l235.6 408.07c36.04 62.42 36.04 139.97 0 202.39l-235.6 408.07c-36.04 62.42-103.2 101.19-175.27 101.19z"
                    fill="none"
                    stroke="#e39a29"
                    strokeMiterlimit={10}
                    strokeWidth="6px"
                />
            </G>
            <Path
                d="M1301.99 1748.56H627.15c-103.23 0-199.41-55.53-251.01-144.93L38.7 1019.22c-51.6-89.39-51.6-200.46 0-289.85l337.43-584.44C427.74 55.53 523.92 0 627.15 0h674.84C1405.22 0 1501.4 55.53 1553 144.93l337.41 584.43c51.6 89.39 51.6 200.46 0 289.85L1553 1603.64c-51.6 89.39-147.81 144.93-251.01 144.93v-.02zM627.15 119.09c-60.81 0-117.48 32.71-147.88 85.38L141.83 788.9c-30.41 52.68-30.41 118.09 0 170.77l337.41 584.43c30.41 52.68 87.07 85.38 147.88 85.38h674.84c60.81 0 117.48-32.71 147.88-85.38l337.41-584.43c30.41-52.68 30.41-118.09 0-170.77l-337.41-584.43c-30.41-52.68-87.07-85.38-147.88-85.38H627.12h.02z"
                strokeWidth={0}
                fill="url(#linear-gradient)"
            />

            <View style={styles.hexagonChildrenView}>
                {props.children}
            </View>
        </Svg>
    )
}

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
    hexagonChildrenView: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});

export default DashboardScreen;