import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signinscreen from '../Screens/SignInScreen/Signinscreen';
import SignUpScreen from '../SignUpScreen/SignUpScreen';
//import image from './assets/images/uibillbuzz.png'
import ConfirmSignUP from '../Screens/SignInScreen/confirmSignUp/confirmSignUP';

const Stack = createNativeStackNavigator();

const Navigation = () => {
return(
   <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name = "SignIn" component={Signinscreen}/>
    </Stack.Navigator>
   </NavigationContainer>
       
);
};
export default Navigation;