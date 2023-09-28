import React from "react";
import {
    Image,
    Platform,
    Pressable,
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
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import {TextInputMask} from "react-native-masked-text";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const CAPITAL_REGEX = /[A-Z]/;
const SYMBOL_REGEX = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

class RegisterScreen extends React.Component {

    state = {
        email: '',
        firstName: '',
        lastName: '',
        birthday: '',
        phoneNumber: '',
        password: '',
        repeatPassword: '',
        passwordVisible: '',
        loading: false
    };

    registerUser = () => {
        const {email, firstName, lastName, birthday, phoneNumber, password} = this.state;
        this.setState({loading: true});
        if (this.validateInputs()) {
            //TODO: Register user on server here
            fetch('http://10.0.2.2:3000/register/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    birthday,
                    phoneNumber,
                    bankBalance: 0,
                    availableCredit: 0,
                    accountList: []
                })
            })
                .then(data => data.json())
                .then(data => {
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
                .catch(console.error)
        }
    };

    validateInputs = () => {
        const {email, firstName, lastName, birthday, phoneNumber, password, repeatPassword} = this.state;
        if (!email || !firstName || !lastName || !password || !repeatPassword || !phoneNumber || !birthday) {
            this.showError('Make sure all fields are entered!');
            return false;
        }

        if (!EMAIL_REGEX.test(email)) {
            this.showError('Invalid email entered!');
            return false;
        }

        if (birthday.length < 10) {
            this.showError('Invalid birthday entered!');
            return false;
        }

        if (!PHONE_NUMBER_REGEX.test(phoneNumber) || phoneNumber.length < 14) {
            this.showError('Invalid phone number entered!');
            return false;
        }

        if (password !== repeatPassword) {
            this.showError('Passwords do not match!');
            return false;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long!');
            return false;
        }

        if (!CAPITAL_REGEX.test(password)) {
            this.showError('Password must contain at least one capital letter!');
            return false;
        }

        if (!SYMBOL_REGEX.test(password)) {
            this.showError('Password must contain one special symbol of !,@,#,$,%,^,&,*')
            return false;
        }

        return true;
    }

    showError = (message) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'bottom'
        });

        this.setState({loading: false});
    };

    render() {
        const {
            email,
            firstName,
            lastName,
            birthday,
            phoneNumber,
            password,
            repeatPassword,
            passwordVisible,
            loading
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
                            <Text style={styles.registerText}>Register</Text>

                            <TextInput
                                style={styles.textInput}
                                placeholder={'Enter your email'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({email: text})}
                                value={email}
                                autoCapitalize={'none'}
                                autoComplete={'email'}
                                keyboardType={'email-address'}
                                textContentType={'emailAddress'}
                                autoFocus={false}
                            />

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

                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'MM/DD/YYYY'
                                }}
                                style={styles.textInput}
                                placeholder={'Enter your birthday'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({birthday: text})}
                                value={this.state.birthday}
                                autoCapitalize={'none'}
                                autoComplete={'birthdate-full'}
                                keyboardType={'number-pad'}
                                textContentType={'none'}
                                autoFocus={false}
                            />

                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '(999) 999-9999'
                                }}
                                style={styles.textInput}
                                placeholder={'Enter your phone number'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({phoneNumber: text})}
                                value={this.state.phoneNumber}
                                autoCapitalize={'none'}
                                autoComplete={'off'}
                                keyboardType={'number-pad'}
                                textContentType={'telephoneNumber'}
                                autoFocus={false}
                            />
                            <View style={styles.passwordContainer}>
                                <Pressable
                                    style={styles.passwordIcon}
                                    onPress={() => this.setState({passwordVisible: !passwordVisible})}
                                >
                                    <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={24} color={'#000000'}/>
                                </Pressable>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'Enter your password'}
                                    placeholderTextColor={'#000000'}
                                    onChangeText={text => this.setState({password: text})}
                                    value={password}
                                    autoCapitalize={'none'}
                                    autoComplete={'password'}
                                    textContentType={'password'}
                                    secureTextEntry={!passwordVisible}
                                    autoFocus={false}
                                    maxLength={30}
                                />
                            </View>

                            <TextInput
                                style={styles.textInput}
                                placeholder={'Re-Enter your password'}
                                placeholderTextColor={'#000000'}
                                onChangeText={text => this.setState({repeatPassword: text})}
                                value={repeatPassword}
                                autoCapitalize={'none'}
                                autoComplete={'password'}
                                textContentType={'password'}
                                secureTextEntry={!passwordVisible}
                                autoFocus={false}
                                maxLength={30}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomHalf}>
                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                {
                                    backgroundColor: loading ? '#F4CE82' : '#eca239'
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

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'space-between',
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

export default RegisterScreen;