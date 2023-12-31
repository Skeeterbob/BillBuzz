import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Logo from "../../assets/images/bee_logo.png";
import Toast from "react-native-toast-message";
import {TextInputMask} from "react-native-masked-text";
import DatePicker from "react-native-date-picker";

import {SERVER_ENDPOINT} from "@env";



// Authored by Hadi Ghaddar from line(s) 1 - 329




class RegisterInfoScreen extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        birthday: undefined,
        loading: false,

        email: '',
        password: '',
        phoneNumber: '',

        datePicker: false
    };

    componentDidMount() {
        //TODO get data from previous page
        this.setState({
            email: this.props.route.params.email,
            password: this.props.route.params.password,
            phoneNumber: this.props.route.params.phoneNumber
        })
    }

    registerUser = () => {
        const {email, password, phoneNumber, firstName, lastName, birthday} = this.state;
        console.log('server endpoint:',SERVER_ENDPOINT)
        this.setState({loading: true});
        if (this.validateInputs()) {
            const birthdayString = formatDate(birthday);
            //TODO: Register user on server here
            fetch(SERVER_ENDPOINT + '/register/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        overdraftThreshold: '0',
                        email,
                        password,
                        firstName,
                        lastName,
                        birthday: birthdayString,
                        phoneNumber,
                        bankBalance: 0,
                        availableCredit: 0,
                        accountList: []
                    }
                })
            })
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    if (data['acknowledged'] === true) {
                        this.props.navigation.navigate({
                            name: 'VerifyCode',
                            params: {
                                email,
                                password,
                                phoneNumber
                            }
                        })
                    }
                })

            console.log(console.error);
        }
    };

    validateInputs = () => {
        const {firstName, lastName, birthday} = this.state;
        if (!firstName || !lastName || !birthday) {
            this.showError('Make sure all fields are entered!');
            return false;
        }

        const birthdayString = formatDate(birthday);
        if (birthdayString.length < 10) {
            this.showError('Invalid birthday entered!');
            return false;
        }

        return true;
    }

    showError = (message) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'top'
        });

        this.setState({loading: false});
    };

    render() {
        const {
            firstName,
            lastName,
            birthday,
            loading,
            datePicker
        } = this.state;

        return (
            <LinearGradient
                colors={['#3D3E43', '#202125', '#101215']}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}
                locations={[0.1, 0.7, 1]}
                style={styles.body}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.topHalf}>
                        <View style={styles.logoHeader}>
                            <Image source={Logo} style={styles.logo}/>
                        </View>

                        <View style={styles.formFields}>
                            <Text style={styles.registerText}>Profile Info</Text>

                            <TextInput
                                style={styles.textInput}
                                placeholder={'Enter your first name'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({firstName: text})}
                                value={firstName}
                                autoCapitalize={'none'}
                                autoComplete={'name-given'}
                                keyboardType={'default'}
                                textContentType={'givenName'}
                                autoFocus={false}
                            />

                            <TextInput
                                style={styles.textInput}
                                placeholder={'Enter your last name'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({lastName: text})}
                                value={lastName}
                                autoCapitalize={'none'}
                                autoComplete={'name-family'}
                                keyboardType={'default'}
                                textContentType={'familyName'}
                                autoFocus={false}
                            />

                            {/*<TextInputMask*/}
                            {/*    type={'datetime'}*/}
                            {/*    options={{*/}
                            {/*        format: 'MM/DD/YYYY'*/}
                            {/*    }}*/}
                            {/*    style={styles.textInput}*/}
                            {/*    placeholder={'Enter your birthday'}*/}
                            {/*    placeholderTextColor={'#000000'}*/}
                            {/*    onChangeText={text => this.setState({birthday: text})}*/}
                            {/*    value={birthday}*/}
                            {/*    autoCapitalize={'none'}*/}
                            {/*    autoComplete={'birthdate-full'}*/}
                            {/*    keyboardType={'number-pad'}*/}
                            {/*    textContentType={'none'}*/}
                            {/*    autoFocus={false}*/}
                            {/*    onPressIn={() => {*/}
                            {/*        this.setState({datePicker: true});*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <TouchableOpacity style={styles.birthdayInput} onPress={() => this.setState({datePicker: true})}>
                                <Text style={styles.birthdayText}>{birthday ? formatDate(birthday) : 'Select your birthday'}</Text>
                            </TouchableOpacity>

                            <DatePicker
                                modal={true}
                                open={datePicker}
                                date={birthday ? birthday : new Date()}
                                mode="date"
                                onConfirm={(date) => {
                                    this.setState({datePicker: false, birthday: date});
                                }}
                                onCancel={() => {
                                    this.setState({datePicker: false});
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomHalf}>
                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                {
                                    backgroundColor: loading ? '#ed8439' : '#f26805'
                                }
                            ]}
                            disabled={loading}
                            onPress={() => this.registerUser()}
                        >
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <Toast/>
                </ScrollView>
            </LinearGradient>
        );
    }
}

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        height: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    body: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    topHalf: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bottomHalf: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 204,
        height: 136,
        margin: 0,
        padding: 0
    },
    appName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 28
    },
    formFields: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32
    },
    registerText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12
    },
    textInput: {
        width: '90%',
        height: 60,
        marginBottom: 24,
        borderRadius: 16,
        backgroundColor: '#eca239',
        color: '#000000',
        paddingLeft: 24,
        fontWeight: 'bold',
        fontSize: 16,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.62,
        elevation: 2,
        overflow: 'hidden'
    },
    birthdayInput: {
        width: '90%',
        height: 60,
        marginBottom: 24,
        borderRadius: 16,
        backgroundColor: '#eca239',
        shadowColor: '#000000',
        paddingLeft: 24,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.62,
        elevation: 2,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
    },
    birthdayText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000'
    },
    passwordContainer: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    passwordIcon: {
        position: 'absolute',
        right: 30,
        zIndex: 1,
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 24
    },
    registerButton: {
        width: '90%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 32
    },
    registerButtonText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#000000',
        fontSize: 24
    }
});

export default RegisterInfoScreen;