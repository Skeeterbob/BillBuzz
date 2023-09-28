import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signinscreen from '../Screens/SignInScreen/Signinscreen';
import SignUpScreen from '../SignUpScreen/SignUpScreen';
//import image from './assets/images/uibillbuzz.png'
import ConfirmSignUP from '../Screens/SignInScreen/confirmSignUp/confirmSignUP';
import AccountPage from '../Screens/userAccount/accountPage';

const Stack = createNativeStackNavigator();

const Navigation = () => {
return(
   <NavigationContainer style={styles.root}>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name = "SignIn" component={Signinscreen}/>
      <Stack.Screen name = "SignUp" component={SignUpScreen}/>
      <Stack.Screen name = "Confirm" component={ConfirmSignUP}/>
      <Stack.Screen name = "Account" component={AccountPage}/>
      
    </Stack.Navigator>
   </NavigationContainer>
       
);
};
const styles = StyleSheet.create({
   root:{
  flex: 1,
  backgroundColor: "#FAE526",
  width: '100%',
  height: '100%',
   },
   image: {
   
    
    height: '100%',
    width: '100%',
  },
  
  });
export default Navigation;