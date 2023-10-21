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
    TouchableOpacity
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import CreditCardImage from '../../assets/images/credit_card.png';
import Icon from "react-native-vector-icons/Ionicons";

class CardDetailScreen extends React.Component {

    cardData = null;

    constructor(props) {
        super(props);
        this.cardData = this.props.route.params.cardData;
    }

    render() {

        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.body}
            >
                <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                        </TouchableOpacity>
                        <Text style={styles.backText}>Back</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <ImageBackground source={CreditCardImage} style={styles.creditCard} resizeMode={"stretch"}>
                            <Text style={styles.creditCardTitle}>{this.cardData.name}</Text>
                        </ImageBackground>

                        <View style={styles.transactions}>
                            <View style={styles.transactionsHeader}>
                                <Text style={styles.transactionsTitle}>Transactions</Text>
                            </View>

                            {this.cardData.transactions.map(transaction => (
                                <TransactionCardComponent
                                    key={`${transaction.name}-${transaction.date}-${transaction.amount}`}
                                    name={transaction.subscriptionName}
                                    date={transaction.date}
                                    amount={transaction.amount}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const TransactionCardComponent = ({name, date, amount}) => {
    const formattedDate = formatDate(date);

    return (
        <LinearGradient
            colors={['rgba(28, 28, 29, 0.6)', 'rgba(77, 75, 70, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.8, 1]}

            style={styles.transactionCard}
        >
            <View>
                <Text style={{color: '#F4CE82', fontSize: 14}}>Merchant</Text>
                <Text style={{color: '#eca239', fontSize: 14, fontWeight: 'bold'}}>{name}</Text>
            </View>

            <View>
                <Text style={{color: '#F4CE82', fontSize: 14}}>Amount</Text>
                <Text style={{color: '#eca239', fontSize: 18, fontWeight: 'bold'}}>${amount}</Text>
            </View>

            <View>
                <Text style={{color: '#F4CE82', fontSize: 14}}>Date</Text>
                <Text style={{color: '#eca239', fontSize: 18, fontWeight: 'bold'}}>{formattedDate}</Text>
            </View>
        </LinearGradient>
    )
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

export default CardDetailScreen;