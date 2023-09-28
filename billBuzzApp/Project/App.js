import React from 'react';
import {StatusBar} from 'react-native';

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Signinscreen from "./src/Screens/SignInScreen/Signinscreen";
// import SignUpScreen from "./src/SignUpScreen";
// import ConfirmSignUP from "./src/Screens/SignInScreen/confirmSignUp";
import NavComponent from "./src/Components/NavComponent";
import CardDetailScreen from "./src/Screens/CardDetailScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import RegisterScreen from "./src/Screens/RegisterScreen";
import ConfirmCodeScreen from "./src/Screens/ConfirmCodeScreen";

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

const AppMain = ({navigation, route}) => (
    <MainStack.Navigator initialRouteName={'AppHome'} >
        <MainStack.Screen
            name={'AppHome'}
            component={NavComponent}
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
        <WelcomeStack.Screen name="VerifyCode" component={ConfirmCodeScreen} options={{headerShown: false, gestureEnabled: false}}/>
    </WelcomeStack.Navigator>
);

export default App;
