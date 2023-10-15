import React from "react";
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import HexagonComponent from "../Components/HexagonComponent";


const MOCK_DATA = {
    firstName: 'Hadi',
    lastName: 'Ghaddar',
    balance: 24846.12,
    availableCredit: 8453.54,
    creditBalance: 12642.64,
    transactions: [
        {
            name: 'Netflix',
            amountDue: 17.99
        },
        {
            name: 'Starbucks',
            amountDue: 8.54
        },
        {
            name: 'Hulu',
            amountDue: 12.99
        }
    ],
    upcomingOverdrafts: [
        {
            name: 'Utility Bill',
            dueDate: '10/15/2023',
            amountDue: 50.00
        },
        {
            name: 'Phone Bill',
            dueDate: '10/20/2023',
            amountDue: 30.00
        },
        // Add more overdrafts as needed
    ],
    creditCard: {
        name: 'American Express',
        dueDate: '10/22/2023',
        amountDue: 321.54
    }

}

class DashboardScreen extends React.Component {

    state = {
        expanded: false,
        showTransactions: false,
        showOverdrafts: false,
        currentWeek: 0,  // New state to track the current week being displayed
        weeklyData: [    // Weekly data example, replace with your own data
            {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: [200, 50, 100, 25, 10, 35, 10] }]
            },
            // ... more weeks data
        ]
    };

    toggleTransactions = () => {
        this.setState(prevState => ({ showTransactions: !prevState.showTransactions }));
    };

    toggleOverdrafts = () => {
        this.setState(prevState => ({ showOverdrafts: !prevState.showOverdrafts }));
    };
    prevWeek = () => {  // Go to the previous week
        this.setState(prevState => ({ currentWeek: prevState.currentWeek - 1 }));
    }

    nextWeek = () => {  // Go to the next week
        this.setState(prevState => ({ currentWeek: prevState.currentWeek + 1 }));
    }

    handleToggleExpand = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    render() {

        const { currentWeek, weeklyData, expanded } = this.state;

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ backgroundColor: '#0B0D10' }}
            >

                <View style={styles.addAccount}>
                    {/*TODO: Make this button work with plaid to add a new account*/}
                    <TouchableOpacity>
                        <Icon name={'add'} size={48} color={'#000000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.dashboardButton}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Accounts');
                        }}
                    >
                        <Icon name={'card'} size={32} color={'#000000'} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body}>
                    <View style={styles.headerInfo}>
                        <Text
                            style={styles.welcomeText}>{`Hello ${MOCK_DATA.firstName} ${MOCK_DATA.lastName}!`}</Text>

                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => {
                                this.props.navigation.navigate('Profile');
                            }}
                        >
                            <Icon name={'person-circle-outline'} size={32} color={'#FFFFFF'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.lineChartContainer}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.lineChartTitle}>Transactions This Week:</Text>
                        </View>

                        <View style={styles.weeklyView}>
                            <TouchableOpacity>
                                <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                            </TouchableOpacity>

                            <View>
                                <Text style={styles.weeklyViewText}>This Week</Text>
                            </View>

                            <TouchableOpacity>
                                <Icon name={'arrow-forward'} size={32} color={'#FFFFFF'} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={this.handleToggleExpand}>
                            <LineChart
                                data={weeklyData[currentWeek]}
                                width={Dimensions.get('window').width - 50} // from react-native
                                animationType="fade"
                                height={220}
                                yAxisLabel="$"
                                yAxisSuffix=" "
                                yAxisInterval={.5}
                                chartConfig={{
                                    backgroundColor: '#13181d',
                                    backgroundGradientFrom: '#13181d',
                                    backgroundGradientTo: '#13181d',
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForDots: {
                                        r: '6',
                                        strokeWidth: '2',
                                        stroke: '#ffa726',
                                    },
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}

                            />
                        </TouchableOpacity>
                        <Modal
                            visible={expanded}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.handleToggleExpand}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                                <View style={{
                                    width: Dimensions.get('window').width - 50,
                                    borderRadius: 16,
                                    padding: 10,
                                    backgroundColor: '#13181d'
                                }}>
                                    <LineChart
                                        data={weeklyData[currentWeek]}
                                        width={Dimensions.get('window').width - 70} // from react-native
                                        height={350}
                                        yAxisLabel="$"
                                        yAxisSuffix=" "
                                        yAxisInterval={.5}
                                        chartConfig={{
                                            backgroundColor: '#13181d',
                                            backgroundGradientFrom: '#13181d',
                                            backgroundGradientTo: '#13181d',
                                            decimalPlaces: 2, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                            propsForDots: {
                                                r: '6',
                                                strokeWidth: '2',
                                                stroke: '#ffa726',
                                            },
                                        }}
                                        bezier
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                    />
                                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }}
                                        onPress={this.handleToggleExpand}>
                                        <Text style={styles.Text}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryText}>Summary</Text>
                        </View>

                        <View style={styles.summaryDetails}>
                            <Text style={styles.detailsText}>Total Bank Balance: <Text
                                style={styles.detailsInfoText}>${MOCK_DATA.balance}</Text></Text>
                            <Text style={styles.detailsText}>Total Available Credit: <Text
                                style={styles.detailsInfoText}>${MOCK_DATA.availableCredit}</Text></Text>
                            <Text style={styles.detailsText}>Total Credit Balance: <Text
                                style={styles.detailsInfoText}>${MOCK_DATA.creditBalance}</Text></Text>
                        </View>

                        <Text style={styles.recentTransactionsText}>Recent Transactions</Text>
                        <View style={styles.summaryCards}>
                            {MOCK_DATA.transactions.map(card => (
                                <View
                                    key={card.name}
                                    style={styles.summardCard}
                                >
                                    <Text style={styles.creditCardText}>{card.name}</Text>
                                    <Text style={styles.creditCardText}>${card.amountDue}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.summaryButton}
                            onPress={() => {
                                console.log("Hello World");
                            }}
                        >
                            <Text style={styles.summaryButtonText}>View all transactions</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.upcomingOverdrafts}>
                        <View style={styles.upcomingOverdraftsHeader}>
                            <Text style={styles.upcomingOverdraftsTitle}>Upcoming Overdrafts</Text>
                        </View>

                        <View style={styles.upcomingOverdraftsDetails}>
                            {MOCK_DATA.upcomingOverdrafts.map((overdraft, index) => (
                                <View key={index} style={styles.overdraftTextContainer}>
                                    <Text style={styles.overdraftText}>{overdraft.name}</Text>
                                    <Text style={styles.overdraftText}>{overdraft.dueDate}</Text>
                                    <Text style={styles.overdraftText}>${overdraft.amountDue}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.upcomingPayment}>
                        <View style={styles.upcomingPaymentHeader}>
                            <Text style={styles.upcomingPaymentTitle}>Upcoming Card Payment</Text>
                        </View>

                        <View style={styles.upcomingPaymentDetails}>
                            <Text style={styles.paymentText}>{MOCK_DATA.creditCard.name}</Text>
                            <Text style={styles.paymentText}>{MOCK_DATA.creditCard.dueDate}</Text>
                            <Text style={styles.paymentText}>${MOCK_DATA.creditCard.amountDue}</Text>
                        </View>
                    </View>
                </ScrollView>
            </RNLinearGradient>

        );

    }
}

const styles = StyleSheet.create({
    Text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Arial',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        padding: 5,
    },
    upcomingOverdrafts: {
        width: '90%',
        height: 'auto',
        backgroundColor: '#13181d',
        borderRadius: 8,
        marginTop: 16,
    },
    upcomingOverdraftsHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderBottomWidth: 2,
    },
    upcomingOverdraftsTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 22
    },
    upcomingOverdraftsDetails: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: 8
    },
    overdraftTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    overdraftText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#eca239'
    },
    lineChartContainer: {
        width: '90%',
        height: 'auto',
        borderRadius: 8,
        backgroundColor: '#13181d',
        marginTop: 16,
        padding: 8,
    },
    lineChartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    weeklyView: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 8
    },
    weeklyViewText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    bodyGradient: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    addAccount: {
        width: 64,
        height: 64,
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 100,
        backgroundColor: '#eca239',
        borderRadius: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    dashboardButton: {
        width: 64,
        height: 64,
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 100,
        backgroundColor: '#eca239',
        borderRadius: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headerInfo: {
        width: '90%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    profileButton: {
        width: 'auto',
        height: 'auto'
    },
    summary: {
        width: '90%',
        height: 'auto',
        borderRadius: 8,
        backgroundColor: '#13181d',
        marginTop: 8,
        paddingTop: 8
    },
    summaryHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderBottomWidth: 2
    },
    summaryText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    summaryDetails: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
        paddingLeft: 8,
        paddingRight: 8
    },
    detailsText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 2,
        marginBottom: 2
    },
    detailsInfoText: {
        fontSize: 16,
        color: '#eca239'
    },
    summaryCards: {
        width: '100%',
        height: 'auto',
        borderColor: '#FFFFFF',
        borderTopWidth: 2,
        marginTop: 4
    },
    recentTransactionsText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 8,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    summardCard: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#FFFFFF',
        borderBottomWidth: 2,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    creditCardText: {
        fontSize: 16,
        color: '#FFFFFF'
    },
    summaryButton: {
        width: '100%',
        height: 32,
        backgroundColor: '#eca239',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    summaryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18
    },
    upcomingPayment: {
        width: '90%',
        height: 'auto',
        backgroundColor: '#13181d',
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 100
    },
    upcomingPaymentHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderBottomWidth: 2,
    },
    upcomingPaymentTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 22
    },
    upcomingPaymentDetails: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8
    },
    paymentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#eca239'
    },
    dashboardLinks: {
        width: 200,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8
    },
    dashboardLink: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }
});

export default DashboardScreen;