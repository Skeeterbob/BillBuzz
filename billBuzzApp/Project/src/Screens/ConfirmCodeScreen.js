import React from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Logo from "../../assets/images/bee_logo.png";

class ConfirmCodeScreen extends React.Component {

    state = {
        code: '',
        loading: false
    };

    componentDidMount() {
      
        fetch('http://192.168.1.40:3000/login/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.props.route.params.email,
                password: this.props.route.params.password
            })
        }).catch(console.error)
    }

    verifyCode = () => {
        const {code} = this.state;

        fetch('http://192.168.1.40:3000/login/login/verify/sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                phNum: this.props.route.params.phoneNumber,
                code
            })
        }).then(data => data.json())
            .then(data => {
                if (data['validate'] === true) {
                    this.props.navigation.navigate({
                        name: 'AppMain',
                        params: {
                            email: this.props.route.params.email,
                            password: this.props.route.params.password
                        }
                    })
                }
            })
            .catch(console.error)
    }

    render() {
        const {code, loading} = this.state;

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

                        <Text style={styles.verificationText}>Verification Code</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Enter verification code'}
                            placeholderTextColor={'#000000'}
                            onChangeText={text => this.setState({code: text})}
                            value={code}
                            autoCapitalize={'none'}
                            autoComplete={'one-time-code'}
                            keyboardType={'number-pad'}
                            textContentType={'oneTimeCode'}
                            autoFocus={false}
                        />
                    </View>

                    <View style={styles.bottomHalf}>
                        <TouchableOpacity
                            style={[
                                styles.verifyButton,
                                {
                                    backgroundColor: loading ? '#ed8439' : '#f26805'
                                }
                            ]}
                            disabled={loading}
                            onPress={() => this.verifyCode()}
                        >
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </TouchableOpacity>

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
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomHalf: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
    textInput: {
        width: '90%',
        height: 60,
        marginTop: 0,
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
    verifyButton: {
        width: '90%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 24
    },
    verifyButtonText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#000000',
        fontSize: 24
    },
    verificationText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 24
    },
});

export default ConfirmCodeScreen;