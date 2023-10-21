import React from 'react';
import {StatusBar} from 'react-native';

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import CardDetailScreen from './src/Screens/CardDetailScreen';
import LoginScreen from "./src/Screens/LoginScreen";
import RegisterScreen from "./src/Screens/RegisterScreen";
import ConfirmCodeScreen from "./src/Screens/ConfirmCodeScreen";
import DashboardScreen from "./src/Screens/DashboardScreen";
import AccountsScreen from "./src/Screens/AccountsScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import RegisterInfoScreen from "./src/Screens/RegisterInfoScreen";
import TransactionScreen from "./src/Screens/TransactionsScreen";
import ForgotPasswordScreen from "./src/Screens/ForgotPasswordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {inject, observer} from "mobx-react";


//The main app stack navigator used to hold all the other navigators
const AppStack = createNativeStackNavigator();
//Used for welcome, login, signup, and sms verification screens
const WelcomeStack = createNativeStackNavigator();
//Used for all the main app navigation: home, dashboard, settings, etc
const MainStack = createNativeStackNavigator();

import {SERVER_ENDPOINT} from "@env";
import AnimatedSplashScreen from "./src/Components/AnimatedSplashScreen";

class App extends React.Component {

    state = {
        loaded: false
    }

    componentDidMount() {
    console.log('in app.js compenentDidMount()');
        this.getUserCredentials().then(user => {
            if (user) {
                try {
                    console.log('before getUserData');
                    this.getUserData(user.email, user.password).then(userData => {
                        console.log(userData);
                        this.props.userStore.updateUser(userData);
                        this.setState({loaded: true});
                    });
                } catch (e) {
                    AsyncStorage.removeItem('user').then(() => {
                        this.setState({loaded: true});
                    });
                }
            } else {
                this.setState({loaded: true});
            }
        });
    }

    getUserData = async (email, password) => {
        console.log('in getuserdata', email, password);
        response = await fetch(SERVER_ENDPOINT + '/login/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': password
            })
        })
        console.log(response);
        data = await response.json();
        console.log(data);
        return data;
    };

    getUserCredentials = async () => {
        return AsyncStorage.getItem('user').then(result => {
            return result ? JSON.parse(result) : null;
        });
    };

    render() {
        const {loaded} = this.state;

        if (!loaded) {
            return (
                <>
                    <StatusBar translucent={true} backgroundColor={'transparent'}/>
                    <AnimatedSplashScreen
                        loaded={loaded}
                        backgroundColor="#202125"
                        logoWidth={256}
                        logoHeight={256}
                    />
                </>
            );
        }

        return (
            <>
                <StatusBar translucent={true} backgroundColor={'transparent'}/>
                <AnimatedSplashScreen
                    loaded={loaded}
                    backgroundColor="#202125"
                    logoWidth={256}
                    logoHeight={256}
                />

                <NavigationContainer>
                    <AppStack.Navigator initialRouteName={this.props.userStore.email ? 'AppMain' : 'AppWelcome'}>
                        <AppStack.Screen
                            name={'AppWelcome'}
                            component={AppWelcome}
                            options={{headerShown: false}}
                        />

                        <AppStack.Screen
                            name={'AppMain'}
                            component={AppMain}
                            options={{headerShown: false}}
                        />
                    </AppStack.Navigator>
                </NavigationContainer>
            </>
        );
    }
}

const AppMain = ({navigation, route}) => (
    <MainStack.Navigator initialRouteName='Dashboard'>
        <MainStack.Screen
            name={'Dashboard'}
            component={DashboardScreen}
            options={{headerShown: false}}
        />

        <MainStack.Screen
            name={'Accounts'}
            component={AccountsScreen}
            options={{headerShown: false}}
        />

        <MainStack.Screen
            name={'Profile'}
            component={ProfileScreen}
            options={{headerShown: false}}
        />

        <MainStack.Screen
            name={'CardDetails'}
            component={CardDetailScreen}
            options={{headerShown: false}}
        />

        <MainStack.Screen
            name={'Transactions'}
            component={TransactionScreen}
            options={{headerShown: false}}
        />

      
    </MainStack.Navigator>
)

const AppWelcome = ({navigation, route}) => (
    <WelcomeStack.Navigator initialRouteName={'SignIn'}>
        <WelcomeStack.Screen name="SignIn" component={LoginScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="SignUp" component={RegisterScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="RegisterInfo" component={RegisterInfoScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="VerifyCode" component={ConfirmCodeScreen}
                             options={{headerShown: false, gestureEnabled: false}}/>
        <WelcomeStack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
                             options={{headerShown: false, gestureEnabled: false}}/>
    </WelcomeStack.Navigator>
);

export default inject('userStore')(observer(App));