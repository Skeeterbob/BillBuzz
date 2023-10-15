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

//The main app stack navigator used to hold all the other navigators
const AppStack = createNativeStackNavigator();
//Used for welcome, login, signup, and sms verification screens
const WelcomeStack = createNativeStackNavigator();
//Used for all the main app navigation: home, dashboard, settings, etc
const MainStack = createNativeStackNavigator();

const App = () => {

    return (
        <>
            <StatusBar translucent={true} backgroundColor={'transparent'}/>

            <NavigationContainer>
                <AppStack.Navigator initialRouteName={'AppWelcome'}>
                    <AppStack.Screen
                        name={'AppMain'}
                        component={AppWelcome}
                        options={{headerShown: false}}
                    />

                    <AppStack.Screen
                        name={'AppWelcome'}
                        component={AppMain}
                        options={{headerShown: false}}
                    />
                </AppStack.Navigator>
            </NavigationContainer>
        </>
    );
}

const AppMain = ({navigation, route}) => (
    <MainStack.Navigator initialRouteName={'AppHome'} >
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
    </MainStack.Navigator>
)

const AppWelcome = ({navigation, route}) => (
    <WelcomeStack.Navigator initialRouteName={'SignIn'}>
        <WelcomeStack.Screen name="SignIn" component={LoginScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="SignUp" component={RegisterScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="RegisterInfo" component={RegisterInfoScreen} options={{headerShown: false}}/>
        <WelcomeStack.Screen name="VerifyCode" component={ConfirmCodeScreen} options={{headerShown: false, gestureEnabled: false}}/>
    </WelcomeStack.Navigator>
);

export default App;