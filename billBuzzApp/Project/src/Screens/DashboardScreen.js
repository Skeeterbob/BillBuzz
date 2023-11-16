import React, { useEffect, useState } from 'react';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import { inject, observer, autorun } from "mobx-react";
import PlaidComponent from "../Components/PlaidComponent";
import { SERVER_ENDPOINT } from "@env";
import { getAllTransactions } from "../utils/Utils";
import DropDownPicker from 'react-native-dropdown-picker';
import { ProjectionResultComponent } from '../Screens/OverdraftScreen';

// Authored by Henry Winczner from line(s) 1 - 58


const upcomingOverdrafts = [

    // Add more overdrafts as needed
];

class DashboardScreen extends React.Component {
    //hwinczner 
    state = {
        weeklyData: [],
        currentWeek: {},
        data: [],  // added for transactions
        chartData: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ data: [12, 20, 30, 40, 50, 60, 70] }]
        },
        filterText: '',
        sortBy: 'default',
        selectedAccount: 'All Accounts',
        dropdownOpen: false,
        projectionResult: { balanceDetails: [] },
    };



    //hwinczner
    componentDidMount() {
        this.compileChart();
       
    }

    toggleTransactions = () => {
        this.setState(prevState => ({ showTransactions: !prevState.showTransactions }));
    };

    toggleOverdrafts = () => {
        this.setState(prevState => ({ showOverdrafts: !prevState.showOverdrafts }));
    };
    // Bryan Hodgins authored the prevWeek() function
    prevWeek = () => {  // Go to the previous week
        let currentWeek = this.state.currentWeek;
        // if it is the current week view modify the date range to start on sunday
        if (currentWeek.startDate.getDay() != 0 || currentWeek.endDate == null) {
            const offset = currentWeek.startDate.getDay();
            // why is the day reading wrong here?
            currentWeek.startDate.setDate(currentWeek.startDate.getDate() - offset - 1);
            currentWeek.endDate = new Date(currentWeek.startDate);
            currentWeek.endDate.setDate(currentWeek.startDate.getDate() + 7);
            currentWeek.endDate.setHours(-4);
            currentWeek.startDate.setHours(-4);
            this.setState(() => ({ currentWeek: currentWeek }));
            this.compileChart(currentWeek.startDate, currentWeek.endDate, 1);
            // TODO: can add in code to change the text on the chart here.
        }
        else {
            currentWeek.startDate.setDate(currentWeek.startDate.getDate() - 7);
            currentWeek.endDate.setDate(currentWeek.endDate.getDate() - 7);
            this.setState(() => ({ currentWeek: currentWeek }));
            this.compileChart(currentWeek.startDate, currentWeek.endDate, 1);
            // TODO: can add in code to change the text on the chart here.
        }
    }
    // Bryan Hodgins authored the nextWeek function
    nextWeek = () => {  // Go to the next week
        let currentWeek = this.state.currentWeek;
        //increase the currentWeek by one week;
        currentWeek.startDate.setDate(currentWeek.startDate.getDate() + 7);
        if (currentWeek.endDate != null) {
            currentWeek.endDate.setDate(currentWeek.endDate.getDate() + 7);
        }
        //check to see if we will push the date forward past today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today <= currentWeek.endDate || currentWeek.endDate == null) {
            currentWeek.endDate = null;
            currentWeek.startDate.setDate(today.getDate() - 7);
            this.compileChart(currentWeek.startDate, currentWeek.endDate, 0);
            // TODO: can add in code to change the text on the chart here.
        }
        else {
            this.compileChart(currentWeek.startDate, currentWeek.endDate, 1);
            // TODO: can add in code to change the text on the chart here.
        }
        this.setState(() => ({ currentWeek: currentWeek }));
    }



    // Authored by Henry Winczner from line(s) 111 - 114

    handleToggleExpand = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    // function to return chart data.
    // mode 0 is chart data for the last 7 days.
    // mode 1 is chart data for a specified week
    // create new modes as needed.
    // Bryan Hodgins authored the compileChart function.
    compileChart = (startDate = null, endDate = null, mode = 0) => {
        const { selectedAccount } = this.state;
        const data = {};
        data['labels'] = []
        data['datasets'] = [{ data: [] }];
        const transList = [];
        let dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // mode for the last seven days of transactions.
        if (mode == 0) {
            const today = new Date();
            // iterate over days going backwards from today to create labels for chart
            const offset = 6 - today.getDay();
            for (let i = 0; i < dayList.length; i++) {
                let day = today.getDay() - i;
                if (day < 0) {
                    day = day + 7;
                }
                data['labels'][6 - i] = dayList[day];
                data['datasets'][0]['data'][i] = 0;
            }
            const threshold = new Date(today);
            threshold.setDate(threshold.getDate() - 7);
            threshold.setHours(0, 0, 0, 0);

            let accountList = [];
            for (const account of this.props.userStore.accountList) {
                if (selectedAccount === 'All Accounts' || selectedAccount === account.name) {
                    accountList.push(account);
                }
            }
            const transactionList = getAllTransactions({ accountList: accountList }, threshold, today);
            for (const transaction of transactionList) {
                const date = new Date(transaction.date);
                let index;
                // Calculate the index based on mode
                if (mode === 0 && threshold < date) {
                    index = offset + date.getDay() + 1;
                    if (index > 6) {
                        index -= 7;
                    }
                } else if (mode === 1) {
                    index = date.getDay();
                }

                // Add transaction amount to the dataset
                const transactionAmount = Number(transaction.amount);
                data['datasets'][0]['data'][index] += transactionAmount;

                // Assign color based on whether the transaction is positive or negative
                data['datasets'][0]['dataWithColor'] = data['datasets'][0]['dataWithColor'] || [];
                data['datasets'][0]['dataWithColor'][index] = {
                    value: transactionAmount,
                    color: transactionAmount > 0 ? 'red' : 'green'
                };
            }
            console.log('Final dataset for graph:', data['datasets'][0]['data']);
            this.setState(() => ({ currentWeek: { startDate: threshold, endDate: null } }))
        }
        //mode for standard weekly chart Sunday to Saturday. Requires Two date objects.
        if (mode == 1) {
            data['labels'] = dayList;
            let accountList = [];
            for (const account of this.props.userStore.accountList) {
                if (selectedAccount === 'All Accounts' || selectedAccount === account.name) {
                    accountList.push(account);
                }
            }
            const transactionList = getAllTransactions({ accountList: accountList }, startDate, endDate);
            for (let i = 0; i < dayList.length; i++) {
                data['datasets'][0]['data'][i] = 0;
            }
            for (const transaction of transactionList) {
                const date = new Date(transaction.date);
                let index = date.getDay() + 1;
                if (index > 6) {
                    index -= 7;
                }
                data['datasets'][0]['data'][index] += Number(transaction.amount);
            }
        }
        this.setState(() => ({ chartData: data }));
    }



    // Authored by Henry Winczner from line(s) 179 - 213


    plaidSuccessUpdate = () => {
        //Refresh the page when plaid is done updating so we get the new user data
        this.forceUpdate();
    }
    overdraftUpdate = () => {
        this.forceUpdate();
    }
    
    

    render() {
        const { chartData, currentWeek, selectedAccount, dropdownOpen } = this.state;
        const weekDate = new Date(currentWeek.startDate)
        const user = this.props.userStore;
        const { sortBy } = this.state;
        const { projectionResult } = this.props.userStore;
        const uniqueKey = JSON.stringify(projectionResult);
        
        let accounts = [{ label: 'All Accounts', value: 'All Accounts' }];
        for (const account of this.props.userStore.accountList) {
            accounts.push({ label: account.name, value: account.name });
        }

        let accountData = [];
        for (const account of this.props.userStore.accountList) {
            if (selectedAccount === 'All Accounts' || selectedAccount === account.name) {
                accountData.push(account);
            }
        }

        let transactions = [];
        for (const account of this.props.userStore.accountList) {
            if (selectedAccount === 'All Accounts' || selectedAccount === account.name) {
                account.transactionList.transactionList.forEach(value => transactions.push(value))
            }
        }

        let filteredTransactions = transactions.filter(transaction =>
            transaction.subscriptionName.toLowerCase()
        );

        filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        switch (sortBy) {
            case 'cost':
                filteredTransactions.sort((a, b) => b.amount - a.amount);
                break;
            case 'alpha':
                filteredTransactions.sort((a, b) => a.subscriptionName.localeCompare(b.subscriptionName));
                break;
            default:
                break;
        }



        // Authored by Hadi Ghaddar from line(s) 220 - 250


        const creditCard = user.accountList[0] ?? { name: 'Test Data', balance: 0 };

        user.accountList.forEach(account => {
            if (selectedAccount === 'All Accounts' || selectedAccount === account.name) {
                account.transactionList.transactionList.forEach(transaction => {
                    transactions.push({
                        name: transaction.vendor,
                        amount: transaction.amount
                    })
                })
            }
        });

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ backgroundColor: '#0B0D10', width: '100%', height: '100%' }}
            >

                <PlaidComponent successUpdate={this.plaidSuccessUpdate} />

                <View style={styles.dashboardButton}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Accounts');
                        }}
                    >
                        <Icon name={'card'} size={32} color={'#000000'} />
                    </TouchableOpacity>
                </View>



                {/*Authored by Henry Winczner from line(s) 259 - 341*/}




                <ScrollView contentContainerStyle={styles.body}>
                    <View style={styles.headerInfo}>
                        <Text
                            style={styles.welcomeText}>{`Hello ${user.firstName} ${user.lastName}!`}</Text>

                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => {
                                this.props.navigation.push('Profile');
                            }}
                        >
                            <Icon name={'person-circle-outline'} size={32} color={'#FFFFFF'} />
                        </TouchableOpacity>
                    </View>

                    <DropDownPicker
                        open={dropdownOpen}
                        value={selectedAccount}
                        items={accounts}
                        setOpen={item => this.setState({ dropdownOpen: item })}
                        setValue={(callback) => this.setState(state => ({ selectedAccount: callback(state.selectedAccount) }))}
                        onChangeItem={item => this.setState({ selectedAccount: item.value })}
                        defaultValue={selectedAccount}
                        style={styles.accountSelector}
                        textStyle={{ color: '#FFFFFF' }}
                        dropDownContainerStyle={styles.accountSelector}
                    />

                    <View style={styles.lineChartContainer}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.lineChartTitle}>Transactions by Week:</Text>
                        </View>

                        <View style={styles.weeklyView}>
                            <TouchableOpacity
                                onPress={() => { this.prevWeek() }}
                            >
                                <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                            </TouchableOpacity>

                            <View>

                            <Text style={styles.weeklyViewText}>{weekDate.getMonth() + 1 + '/' + weekDate.getDate() + '/' + weekDate.getFullYear() + ' - ' + (currentWeek.endDate ? (currentWeek.endDate.getMonth() + 1 + '/' + currentWeek.endDate.getDate() + '/' + currentWeek.endDate.getFullYear()) : 'Current')
                            }</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => { this.nextWeek() }}
                            >
                                <Icon name={'arrow-forward'} size={32} color={'#FFFFFF'} />
                            </TouchableOpacity>
                        </View>
                        <BarChart
                            data={this.state.chartData}
                            width={Dimensions.get('window').width - 50}
                            height={220}
                            yAxisLabel="$"
                            yAxisSuffix=""
                            yAxisInterval={0.5}
                            chartConfig={{
                                backgroundColor: '#13181d',
                                backgroundGradientFrom: '#13181d',
                                backgroundGradientTo: '#13181d',
                                decimalPlaces: 2,
                                color: (opacity = 1, index) => {
                                    const dataValue = this.state.chartData.datasets[0].data[index];
                                    return dataValue > 0 ? `rgba(255, 0, 0, ${opacity})` : `rgba(255, 252, 127, ${opacity})`;
                                },
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                barPercentage: 0.85,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />

                    </View>
                    <View style={styles.summary}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryText}>Recent Transactions</Text>
                        </View>

                        <View style={styles.summaryCards}>
                            {filteredTransactions.length === 0 ? (
                                <View>
                                    <Text style={styles.noTransactionsText}>No transactions found.</Text>
                                </View>
                            ) : (
                                filteredTransactions.slice(0, 3).map((transaction, index) =>
                                    <TransactionComponent
                                        key={transaction.name + '-' + Math.random()}
                                        transaction={transaction}
                                    />
                                )
                            )}



                            {/*Authored by Hadi Ghaddar from line(s) 348 - 393*/}


                        </View>
                        <TouchableOpacity
                            style={styles.summaryButton}
                            onPress={() => {
                                this.props.navigation.navigate('Transactions');
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

                            <View>
                                <ProjectionResultComponent
                                style={styles.overdraftTextContainer}
                                projectionResult={projectionResult}
                                update={this.overdraftUpdate}
                                 />
                            </View>

                        </View>
                        <TouchableOpacity
                            style={styles.summaryButton}
                            onPress={() => {
                                this.props.navigation.navigate('Overdrafts');
                            }}
                        >
                            <Text style={styles.summaryButtonText}>View all Overdrafts</Text>
                        </TouchableOpacity>
                    </View>

                    {creditCard ? <View style={styles.upcomingPayment}>

                    </View> : undefined}
                </ScrollView>
            </RNLinearGradient>

        );

    }
}



// Authored by Henry Winczner from line(s) 400 - 548


const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + '...' : text;
};

const TransactionComponent = (transaction) => {
    console.log(JSON.stringify(transaction));

    return (
        <View style={styles.transaction}>

            <View style={styles.transactionData}>
                <Text style={{ color: '#f3a111' }}>{truncateText(transaction.transaction.subscriptionName)}</Text>
                <Text style={{ color: '#f3a111' }}>${transaction.transaction.amount}</Text>
            </View>
            <View style={styles.transactionDate}>
                <Text style={{ color: '#ffffff', fontStyle: 'italic' }}>{formatDate(transaction.transaction.date)}</Text>
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
    recurringBtn: {
        width: '90%',
        height: 'auto',
        borderRadius: 6,
        padding: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eca239',
        marginBottom: 16,
        shadowColor: '#232323',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 10,
        elevation: 4,
    },
    recurringBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000'
    },
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
    transactionDate: {
        alignSelf: 'flex-end',
        fontStyle: 'italic',
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
        marginBottom: 4,
        alignContent: 'center',
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
    // Authored by Hadi Ghaddar from line(s) 557 - 796
    accountSelector: {
        backgroundColor: '#181818',
        width: '80%',
        marginLeft: '10%'
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
        marginTop: 4,
        alignItems: 'center',
    },
    recentTransactionsText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 8,
        marginLeft: 'auto',
        marginRight: 'auto',

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
    },
    noTransactionsText: {
        color: 'red',  // Orange-red color as an example
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'italic',
        textAlign: 'center',

    }
});

export default inject('userStore')(observer(DashboardScreen));