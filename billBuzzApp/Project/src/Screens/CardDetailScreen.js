import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    ImageBackground,
    SafeAreaView,
    Platform,
    StatusBar,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import CreditCardImage from '../../assets/images/credit_card.png';
import Icon from "react-native-vector-icons/Ionicons";
import {inject, observer} from "mobx-react";
import {SERVER_ENDPOINT} from "@env";
import Toast from "react-native-toast-message";


// Authored by Hadi Ghaddar from line(s) 1 - 137


class CardDetailScreen extends React.Component {

    cardData = null;
    state = {
        editor: false,
        cardName: ''
    };

    constructor(props) {
        super(props);
        this.cardData = this.props.route.params.cardData;
    }

    componentDidMount() {
        this.setState({cardName: this.cardData?.name});
    }

    showDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete this account?',
            [
                {
                    text: 'Cancel',
                    onPress: undefined,
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => this.deleteAccount()
                },
            ],
            {
                cancelable: true,
                onDismiss: undefined
            }
        );
    };

    deleteAccount = () => {
        fetch(SERVER_ENDPOINT + '/plaid/removeAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.props.userStore.email,
                accessToken: this.props.route.params.cardData.accessToken
            })
        })
            .then(data => data.json())
            .then(response => {
                if (response['removed']) {
                    const newUser = response.user;
                    this.props.userStore.updateUser(newUser);
                    this.props.navigation.navigate({name: 'Accounts'});
                    console.log("deleted")
                }
            })
            .catch(console.error);
    };

    openEditor = () => {
        this.setState({editor: true});
    }

    saveDate = () => {
        const { cardName } = this.state;
        const user = this.props.userStore;
        if (cardName !== this.cardData?.name) {
            let accountList = user.accountList.map(item => {
                if (item.name === this.cardData?.name) {
                    return { ...item, name: cardName }; // Create a new object with updated name
                }
                return item; // Return the item as is if the name doesn't match
            });

            // Create a newUser object with all the user details and the updated account list
            let newUser = {
                ...user, // Spread the existing user properties
                accountList: accountList // Set the updated accountList
            };

            // Send the newUser object to the server
            fetch(SERVER_ENDPOINT + '/register/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user: newUser,
                    email: user.email
                })
            })
                .then(result => result.json())
                .then(data => {
                    this.props.userStore.updateUser(data); // Update the user store with the response
                    this.showSuccess("Updated profile!");
                    this.setState({ editor: false });
                })
                .catch(console.error);
        } else {
            this.setState({ editor: false });
        }
    }


    showSuccess = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'top'
        });
    };

    render() {
        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.body}
            >
                <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'}/>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.backButton} onPress={() => {
                            this.showDeleteAccount();
                        }}>
                            <Text style={styles.deleteText}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <ImageBackground source={CreditCardImage} style={styles.creditCard} resizeMode={"stretch"}>
                            <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => {
                                this.openEditor();
                            }}>
                                <Text style={styles.creditCardTitle}>
                                    {this.state.cardName}&nbsp;
                                </Text>

                                <Icon name={'pencil'} size={28} color={'#030303'}/>
                            </TouchableOpacity>
                        </ImageBackground>

                        <View style={styles.transactions}>
                            <View style={styles.transactionsHeader}>
                                <Text style={styles.transactionsTitle}>Transactions</Text>
                            </View>

                            <TouchableOpacity style={styles.recurringBtn} onPress={() => {
                                this.props.navigation.navigate({
                                    name: 'RecurringTransactions',
                                    params: {
                                        accessToken: this.props.route.params.cardData.accessToken
                                    }
                                })
                            }}>
                                <Text style={styles.recurringBtnText}>Show Recurring Transactions</Text>
                            </TouchableOpacity>

                            {this.cardData.transactions.map(transaction => (
                                <TransactionCardComponent
                                    key={`${transaction.name}-${transaction.date}-${Math.random()}`}
                                    name={transaction.subscriptionName}
                                    date={transaction.date}
                                    amount={transaction.amount}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>

                {this.state.editor ? <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {
                        this.setState({editor: !this.state.editor});
                    }}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.editTextInput}
                            onChangeText={text => this.setState({cardName: text})}
                            value={this.state.cardName}
                        />

                        <TouchableOpacity style={styles.editButton} onPress={() => this.saveDate()}>
                            <Text style={styles.editButtonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.editButton} onPress={() => this.setState({editor: false, cardName: this.cardData?.name})}>
                            <Text style={styles.editButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal> : null}

                <Toast />
            </LinearGradient>
        );
    }
}


// Authored by Henry Winczner from line(s) 143 - 338


const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + '...' : text;
}

const TransactionCardComponent = ({name, date, amount}) => {
    const formattedDate = formatDate(date);

    return (
        <LinearGradient
            colors={['rgba(28, 28, 29, 0.6)', 'rgba(77, 75, 70, 0.6)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0.8, 1]}

            style={styles.transactionCard}
        >
            
            <View styles={styles.transaction}>

                <Text style={{color: '#eca239', fontSize: 16, fontWeight: 'bold'}}>{truncateText(name)}</Text>

            </View>
            <View style={styles.transactionDate}>
                <Text style={{color: '#eca239', fontSize: 16, fontWeight: 'bold'}}>${amount}</Text>
                <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>{formattedDate}</Text>
            </View>
            {/* hwinczner end */}

        </LinearGradient>
    );
};

function formatDate(dateString) {
    const date = new Date(dateString);

    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0B0D10'
    },
    //hwinczner start 
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
    transactionData: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4
    },
    transactionDate: {
        alignSelf: 'flex-end',

    },
    //hwinczner end
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
    },
    pageHeader: {
        width: '100%',
        height: 'auto',
        paddingLeft: 8,
        paddingRight: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        width: 'auto',
        height: 40,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F4CE82',
    },
    backText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    deleteText: {
        color: '#e73c3c',
        fontSize: 16,
        fontWeight: 'bold'
    },
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
    modalView: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    editTextInput: {
        width: '100%',
        height: 60,
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 24
    },
    editButton: {
        width: '80%',
        height: 40,
        backgroundColor: '#40940a',
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    editButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000'
    }
});

export default inject('userStore')(observer(CardDetailScreen));