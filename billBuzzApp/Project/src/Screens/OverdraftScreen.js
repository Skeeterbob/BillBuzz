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
import moment from 'moment'

class OverdraftScreen extends React.Component {

    state = {
        transactions: [],
        loaded: false,
        overdraftAlertThreshold: '',
        projectionResult: { balanceDetails: [] },
    };
    saveOverdraftAlertThreshold = () => {
        // const { overdraftAlertThreshold } = this.state;
        // const { userStore } = this.props;
        // const { email } = userStore; // Assuming the email is used as a unique identifier for the user

        // // Now using fetch to send the updated threshold to the server
        // fetch(SERVER_ENDPOINT + '/user/updateThreshold', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         email: email, // Assuming this is how you identify the user whose threshold you are updating
        //         overdraftAlertThreshold: overdraftAlertThreshold
        //     })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             console.log('Threshold saved successfully!');
        //             // Here, you might want to update your userStore with the new threshold
        //             userStore.overdraftAlertThreshold = overdraftAlertThreshold;
        //             // And perhaps call a method to show success to the user
        //             this.showSuccess("Threshold updated successfully!");
        //         } else {
        //             throw new Error('Server returned an error when saving threshold.');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Failed to save threshold:', error);
        //         // Handle any errors here, such as displaying an error message to the user
        //         this.showError('Failed to save threshold.');
        //     });

    };
    getNextMonthDate = (dateString) => {
        const date = new Date(dateString);
        const nextMonth = new Date(date.setMonth(date.getMonth() + 1));
        return nextMonth.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };
    setOverdraftAlertThreshold = (newThreshold) => {
        if (newThreshold.trim() === "") {
            this.setState({ overdraftAlertThreshold: '' }); // Allow the user to clear the input
            return;
        }

        const numericThreshold = parseFloat(newThreshold);
        if (!isNaN(numericThreshold) && numericThreshold >= 0) {
            this.setState({ overdraftAlertThreshold: numericThreshold }, () => {
                // State is updated, now we can check for overdraft
                const overdraftPrediction = this.calcProjectedBalance();
                this.checkAndAlertOverdraft();
                // ... your logic for handling overdraft prediction
            });
        } else {
            alert('Please enter a valid number for the overdraft alert threshold.');
        }
        this.saveOverdraftAlertThreshold();
    };
    calcBalance = () => {
        let balance = 0.0;
        for (const account of this.props.userStore.accountList) {
            balance += parseFloat(account.balance);
        }

        return Math.round(balance * 100) / 100;
    }
    calcProjectedBalance = () => {
        const { overdraftAlertThreshold } = this.state;
        const user = this.props.userStore;
        let transactions = [];
        let balanceDetails = []; // Array to store balance after each transaction
        let projectedBalance = this.calcBalance(); // Start with the current balance

        // Iterate over each account and their transaction list
        for (const account of user.accountList) {
            for (const transaction of account.transactionList.transactionList) {
                // Clone the transaction and set its date to the next month
                let predictedTransaction = { ...transaction };
                let transactionDate = new Date(transaction.date);
                transactionDate.setMonth(transactionDate.getMonth() + 1); // Move to the next month
                predictedTransaction.date = transactionDate.toISOString(); // Set new date
                transactions.push(predictedTransaction);
            }
        }

        // Filter and sort the transactions
        let filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionAmount = parseFloat(transaction.amount);
            const start = this.state.startDate ? new Date(this.state.startDate) : null;
            const end = this.state.endDate ? new Date(this.state.endDate) : null;

            // Check if transaction date is within the range and amount is non-negative
            return (!start || transactionDate >= start) && (!end || transactionDate <= end) && transactionAmount >= 0;
        });

        filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB; // Sorting in ascending order by date
        });

        console.log('Filtered (non-negative) and Sorted Transactions:', filteredTransactions);



        // Now use the filtered and sorted transactions for the projection
        for (const transaction of filteredTransactions) {
            projectedBalance -= parseFloat(transaction.amount);
            balanceDetails.push({
                date: transaction.date,
                balance: projectedBalance
            });

            // As soon as projectedBalance falls below the threshold, break the loop and return
            if (projectedBalance < overdraftAlertThreshold) {
                // Ensure that the date and amount are from the transaction that caused the overdraft
                return {
                    overdraft: true,
                    date: transaction.date, // This should be the date of the overdraft-causing transaction
                    overdraftAmount: Math.abs(projectedBalance - overdraftAlertThreshold),
                    withinThreshold: projectedBalance < 0,
                    balanceDetails: balanceDetails
                };
            }
        }

        console.log('No overdraft will occur');
        // No overdraft will occur
        //return { overdraft: false};
        return { overdraft: false, transactions: filteredTransactions, balanceDetails };
    }

    checkAndAlertOverdraft = () => {
        const overdraftPrediction = this.calcProjectedBalance();
        console.log('Overdraft Prediction:', overdraftPrediction);
        this.setState({ projectionResult: overdraftPrediction });
        // if (overdraftPrediction.overdraft) {
        //     const message = overdraftPrediction.withinThreshold
        //         ? `Warning: Projected overdraft of $${overdraftPrediction.overdraftAmount} on ${moment(overdraftPrediction.date).format('LL')}!`
        //         : `Alert: Your balance is projected to go below your set threshold of $${this.state.overdraftAlertThreshold} on ${moment(overdraftPrediction.date).format('LL')}.`;
        //     alert(message);
        // }

    };
    renderProjectionResult = () => {
        const { projectionResult } = this.state;
        if (!projectionResult) {
            return null;
        }


        // Map over balanceDetails to create the list of balance texts with conditional styling
        const balanceAfterEachTransaction = projectionResult.balanceDetails.map((detail, index) => {
            // Determine if the balance is below the overdraft threshold
            const isOverdraftTransaction = detail.balance < projectionResult.overdraftAlertThreshold;
            // Apply the red color style if the balance is below the overdraft threshold
            const transactionStyle = isOverdraftTransaction ? styles.overdraftTransaction : styles.transactionDetailText;


            return (
                <View key={index} style={styles.overdraftContainer}>
                    <Text style={styles.overdraftText}>
                        After transaction - {moment(detail.date).format('LL')}:
                    </Text>
                    <Text style={styles.balanceText}>
                        ${detail.balance.toFixed(2)}
                    </Text>
                </View>
            );
        });

        // Overdraft message
        const overdraftMessage = projectionResult.overdraft ? (

            <Text style={styles.warningText}>
                Projected Overdraft: ${projectionResult.overdraftAmount.toFixed(2)} on {moment(projectionResult.date).format('LL')}

            </Text>
        ) : (
            <Text style={styles.noOverdraftText}>
                No projected overdraft. Balance is healthy!
            </Text>
        );

        return (

            <View style={styles.projectionResult}>
                {overdraftMessage}
                <View style={styles.balanceDetails}>
                    {balanceAfterEachTransaction}
                </View>
            </View>
        );
    };

    componentDidMount() {
        const { userStore } = this.props;

        // Assuming userStore has a method getOverdraftThreshold which retrieves the saved threshold
        if (userStore && typeof userStore.getOverdraftThreshold === 'function') {
            const savedThreshold = userStore.getOverdraftThreshold();
            this.setState({ overdraftAlertThreshold: savedThreshold });
        }

        // Load transactions or any other initial data here
    }

    render() {
        const { overdraftAlertThreshold } = this.state;

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
                            <TextInput style={{ color: '#FFFFFF' }}
                                value={overdraftAlertThreshold.toString()}
                                onChangeText={(text) => this.setOverdraftAlertThreshold(text)}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.lineChartTitle}>Potential Overdrafts</Text>

                    </View>
                    {this.renderProjectionResult()}


                </ScrollView>
            </RNLinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    overdraftText: {
        fontSize: 14,
        color: '#FFFFFF',
        display: "flex",
    },
    overdraftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,

    },
    balanceText: {
        fontSize: 14,
        color: "orange",
        display: "flex",

    },
    projectionResult: {
        padding: 10,
        margin: 10,

        borderRadius: 5,

        borderColor: '#ddd',
    },
    balanceDetails: {
        width: '90%',
        height: 'auto',
        borderRadius: 8,
        backgroundColor: '#13181d',
        marginTop: 8,
        paddingTop: 8,
        alignItems: "center"
    },
    transactionDetailText: {
        color: '#333', // Choose a color that fits your app's theme
        fontSize: 14,
        // ... additional styles ...
    },
    warningText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 13,
        alignContent: "center"
    },
    noOverdraftText: {
        color: 'green',
        alignItems: "center",
        fontSize: 13,
    },
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

export default inject('userStore')(observer(OverdraftScreen));