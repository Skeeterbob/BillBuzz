/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ImageBackground, StyleSheet, Text, View, SafeAreaView } from 'react-native';

import Navigation from './src/Navigation/index';



const App = () => {

  return (
    <SafeAreaView style={styles.root}>
        
    
      <Navigation/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 root:{
flex: 2,
backgroundColor: "#FAE526",

 },
 image: {
 
  
  height: '100%',
  width: '100%',
},

});

export default App;
