/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ImageBackground, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Signinscreen from './src/Screens/SignInScreen/Signinscreen';
import SignUpScreen from './src/SignUpScreen/SignUpScreen';
//import image from './assets/images/uibillbuzz.png'
import ConfirmSignUP from './src/Screens/SignInScreen/confirmSignUp/confirmSignUP';




const App = () => {

  return (
    <SafeAreaView style={styles.root}>
        
    
      <Signinscreen/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 root:{
flex: 1,
backgroundColor: "#FAE526",

 },
 image: {
 
  
  height: '100%',
  width: '100%',
},

});

export default App;
