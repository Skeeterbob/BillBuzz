import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar, DatePickerAndroid, Modal } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { LinearGradient as RNLinearGradient } from 'react-native-linear-gradient';
import { inject, observer } from "mobx-react";
import Icon from "react-native-vector-icons/Ionicons";
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';


class TransactionScreen extends React.Component {
    //hwinczner
    state = {
        filterText: '',
        sortBy: 'default',
        open: false,
        startDate: null,
        endDate: null,
        selected: null,
        isDropdownOpen: false,

    };
    //hwinczner
    toggleDropdown = (isOpen) => {
        this.setState({ isDropdownOpen: isOpen });
    };
    //hwinczner
    clearDates = () => {
        this.setState({
            startDate: null,
            endDate: null,
            selected: null,
        });
    }
    //hwinczner
    setOpen = () => {
        this.setState(prevState => ({ open: !prevState.open })); // Toggle the open state

    };
    //hwinczner
    onDayPress = day => {
        if (!this.state.startDate || (this.state.startDate && this.state.endDate)) {
            this.setState({
                startDate: day.dateString,
                endDate: null,
                selected: { [day.dateString]: { startingDay: true, color: 'blue', textColor: 'white' } }
            });
        } else if (!this.state.endDate) {
            const newSelected = this.state.startDate
                ? this.getDatesList(this.state.startDate, day.dateString)
                : {};
            this.setState({
                endDate: day.dateString,
                selected: { ...this.state.selected, ...newSelected, [day.dateString]: { endingDay: true, color: 'blue', textColor: 'white' } }
            });
        }
    };
    //hwinczner
    getDatesList = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let date = start;
        const dateList = {};

        while (date <= end) {
            const dateString = date.toISOString().split('T')[0];
            if (dateString === startDate) {
                dateList[dateString] = { startingDay: true, color: 'blue', textColor: 'white' };
            } else if (dateString === endDate) {
                dateList[dateString] = { endingDay: true, color: 'blue', textColor: 'white' };
            } else {
                dateList[dateString] = { color: 'blue', textColor: 'white' };
            }

            date = new Date(date.setDate(date.getDate() + 1));
        }

        return dateList;
    };

    render() {


        const { filterText, sortBy, open } = this.state;

        const user = this.props.userStore;
        let transactions = [];

        for (const account of user.accountList) {
            account.transactionList.transactionList.forEach(value => transactions.push(value))
        }
        //hwinczner
        let filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = this.state.startDate ? new Date(this.state.startDate) : null;
            const end = this.state.endDate ? new Date(this.state.endDate) : null;

            // Check if transaction date is within the range
            const isWithinRange = (!start || transactionDate >= start) && (!end || transactionDate <= end);
            return transaction.subscriptionName.toLowerCase().includes(filterText.toLowerCase()) && isWithinRange;
        });
        //hwinczner
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

        return (
            <RNLinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ backgroundColor: '#0B0D10', width: '100%', height: '100%' }}
            >

                <ScrollView contentContainerStyle={{ width: '100%', display: 'flex', alignItems: 'center', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.summaryHeader}>
                        <Text style={styles.lineChartTitle}>Recent Transactions</Text>
                    </View>
                    {/* hwinczner */}
                    <View style={styles.filterContainer}>
                        <TouchableOpacity onPress={this.setOpen}><Text>📅</Text></TouchableOpacity>
                        <TextInput
                            style={styles.filterInput}
                            placeholder="Filter by keyword..."
                            value={this.state.filterText}
                            onChangeText={(text) => this.setState({ filterText: text })}
                            placeholderTextColor={'#FFFFFF'}
                        />
                        {/* hwinczner */}
                        <DropDownPicker
                            items={[
                                { label: 'Default', value: 'default' },
                                { label: 'Highest to Lowest Cost', value: 'cost' },
                                { label: 'Alphabetical', value: 'alpha' },
                            ]}
                            defaultValue={this.state.sortBy}
                            open={this.state.isDropdownOpen}
                            setOpen={this.toggleDropdown}
                            value={this.state.sortBy}
                            setValue={(callback) => this.setState(state => ({ sortBy: callback(state.sortBy) }))}
                            containerStyle={{ height: 40 }}
                            style={styles.filterPicker}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            dropDownStyle={{ backgroundColor: '#212121' }}
                            onChangeItem={(item) => this.setState({ sortBy: item.value })}
                        />


                    </View>
                    {/* hwinczner */}
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={open}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.inputButtonWrapper}>
                                    <TouchableOpacity onPress={this.setOpen}>
                                        <Text >Close</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.clearDates}>
                                        <Text>Clear</Text>
                                    </TouchableOpacity>
                                </View>
                                <Calendar
                                    markingType={'period'}
                                    markedDates={this.state.selected}
                                    onDayPress={this.onDayPress}
                                />
                            </View>
                        </View>
                    </Modal>

                    {filteredTransactions.map(transaction =>
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

const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + '...' : text;
};

const TransactionComponent = (transaction) => {
    console.log(JSON.stringify(transaction));

    return (
        //hwinczner
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

    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,  // changing margin to marginTop so only top spacing is affected
    },

    modalView: {
        width: '90%',  // set width to 90% of parent view
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,  // reduce padding to ensure more space for the calendar
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
});

export default inject('userStore')(observer(TransactionScreen));
