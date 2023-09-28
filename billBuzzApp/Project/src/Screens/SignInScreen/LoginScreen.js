import React from "react";
import {
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Logo from '../../../assets/images/bee_logo.png';
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

class LoginScreen extends React.Component {

    state = {
        email: '',
        password: '',
        passwordVisible: false,
        loading: false
    };

    login = () => {
        const {email, password} = this.state;
        console.log(email + ", " + password);
        this.setState({loading: true});

        fetch('http://localhost:3000/register/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        })
            .then(result => result.json())
            .then(user => {
                this.props.navigation.navigate({
                    name: 'VerifyCode',
                    params: {
                        email,
                        password,
                        phoneNumber: user.phoneNumber
                    }
                })
            })
    };

    render() {
        const {email, password, passwordVisible, loading} = this.state;

        return (
            <LinearGradient
                colors={['#3D3E43', '#202125', '#101215']}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}
                locations={[0.1, 0.7, 1]}
                style={styles.body}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.topHalf}>
                        <View style={styles.logoHeader}>
                            <Image source={Logo} style={styles.logo}/>
                        </View>

                        <View style={styles.formFields}>
                            <Text style={styles.loginText}>Login</Text>

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

                            <View style={styles.subLoginContent}>
                                <Text
                                    style={styles.forgotPassText}
                                    onPress={() => {
                                        console.log("Forgot password clicked, need to implement this");
                                    }}
                                >
                                    Forgot Password? Click Here.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomHalf}>
                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                {
                                    backgroundColor: loading ? '#F4CE82' : '#eca239'
                                }
                            ]}
                            disabled={loading}
                            onPress={() => this.login()}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>

                        <Text
                            style={styles.registerText}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                            New user? Click here to register.
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    loginText: {
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
        zIndex: 100,
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 24
    },
    subLoginContent: {
        width: '90%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -12
    },
    forgotPassText: {
        color: '#F4CE82',
        fontSize: 14
    },
    registerText: {
        color: '#F4CE82',
        fontSize: 14,
        marginBottom: 22
    },
    loginButton: {
        width: '90%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 12
    },
    loginButtonText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#000000',
        fontSize: 24
    }
});

export default LoginScreen;