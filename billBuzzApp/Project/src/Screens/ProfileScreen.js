import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    Text,
    StyleSheet,
    View,
    Platform,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import {inject, observer} from "mobx-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Logo from '../../assets/images/bee_logo.png';

import {SERVER_ENDPOINT} from "@env";
import Toast from "react-native-toast-message";
import {TextInputMask} from "react-native-masked-text";

const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;



// Authored by Hadi Ghaddar from line(s) 1 - 336





class ProfileScreen extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthday: '',
        saving: false
    };

    componentDidMount() {
        const user = this.props.userStore;
        this.setState({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            birthday: user.birthday
        });
    }

    saveData = () => {
        const user = this.props.userStore;
        const {firstName, lastName, email, phoneNumber} = this.state;
        this.setState({saving: true});
        if (!EMAIL_REGEX.test(email)) {
            this.showError('Invalid email entered!');
            this.setState({saving: false});
            return;
        }

        if (!PHONE_NUMBER_REGEX.test(phoneNumber) || phoneNumber.length < 14) {
            this.showError('Invalid phone number entered!');
            this.setState({saving: false});
            return;
        }

        let newUser = {
            firstName,
            lastName,
            email,
            phoneNumber,
            password: user.password,
            birthday: user.birthday,
            bankBalance: user.bankBalance,
            availableCredit: user.availableCredit,
            accountList: user.accountList
        };

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
                this.props.userStore.updateUser(data);
                this.showSuccess("Updated profile!");
                this.setState({saving: false});
            })
            .catch(console.error)
    };

    canSave = () => {
        const user = this.props.userStore;
        const {firstName, lastName, email, phoneNumber} = this.state;
        return user.firstName !== firstName || user.lastName !== lastName || user.email !== email || user.phoneNumber !== phoneNumber;
    }

    showError = (message) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'top'
        });
    };

    showSuccess = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'top'
        });
    };

    render() {
        const user = this.props.userStore;
        const {firstName, lastName, email, phoneNumber, birthday, saving} = this.state;
        const date = new Date(birthday);
        const canSave = this.canSave();

        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{backgroundColor: '#0B0D10'}}
            >
                <ScrollView style={styles.body}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        {canSave && !saving ? <TouchableOpacity style={styles.headerButton} onPress={() => this.saveData()}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity> : null}
                    </View>

                    <View style={styles.profileIntro}>
                        <Image style={styles.profileImage} source={Logo} resizeMode={"cover"}/>
                        <Text style={styles.nameHeading}>
                            {`${user.firstName} ${user.lastName}`}
                        </Text>
                    </View>

                    <View style={styles.profileOptions}>
                        <Text style={styles.categoryHeader}>Profile Info</Text>
                        <View style={styles.category}>
                            <TextInput style={{...styles.dataInput, borderTopWidth: 2}} value={firstName} onChangeText={text => this.setState({firstName: text})} />
                            <TextInput style={styles.dataInput} value={lastName} onChangeText={text => this.setState({lastName: text})} />
                            <TextInput style={styles.dataInput} value={`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} editable={false} />
                            <TextInput style={styles.dataInput} value={email} onChangeText={text => this.setState({email: text})} />
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '(999) 999-9999'
                                }}
                                style={styles.dataInput}
                                onChangeText={text => this.setState({phoneNumber: text})}
                                value={phoneNumber}
                                autoCapitalize={'none'}
                                autoComplete={'off'}
                                keyboardType={'number-pad'}
                                textContentType={'telephoneNumber'}
                                autoFocus={false}
                            />
                        </View>

                        <Text style={styles.categoryHeader}>Legal</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.settingText}>Terms of Service</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn}><Text style={styles.settingText}>Privacy Policy</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.categoryHeader}>Account</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.importantText}>Delete User Account</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn} onPress={() => {
                                this.props.userStore.clearUser();
                                AsyncStorage.removeItem('user').then(() => {
                                    this.props.navigation.navigate({
                                        name: 'AppWelcome'
                                    });
                                });
                            }}>
                                <Text style={styles.importantText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Toast />
                </ScrollView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    profileOptions: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 32
    },
    profileIntro: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    nameHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
        borderBottomWidth: 2,
        borderColor: '#F4CE82'
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderColor: '#F4CE82',
        borderWidth: 4
    },
    categoryHeader: {
        color: '#dcdcdc',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginLeft: 20,
        marginBottom: 5
    },
    category: {
        backgroundColor: '#363636',
        width: '100%',
        height: 'auto',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#2c2c2c',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        marginBottom: 40
    },
    dataInput: {
        width: '100%',
        height: 'auto',
        padding: 5,
        borderBottomWidth: 2,
        borderColor: '#F4CE82',
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    settingsBtn: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#F4CE82',
        borderBottomWidth: 1,
    },
    settingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    importantText: {
        color: '#f65858',
        fontSize: 16,
        fontWeight: 'bold'
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
    saveText: {
        color: '#39cc11',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default inject('userStore')(observer(ProfileScreen));