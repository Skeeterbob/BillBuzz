import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native'

import CustomInput from '../Components/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';

const SignUpScreen = () => {
    const {height} = useWindowDimensions();
    const [Username, setUsername] = useState('');
    const [Email, SetEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();
    const onRegesteredPressed =() =>{
        const userAuthenticated = true; 
        const uppercaseRegex = /[A-Z]/;
        const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/

        if (userAuthenticated) {
            if (!uppercaseRegex.test(password) && !uppercaseRegex.test(passwordRepeat) ) {
                
                Alert.alert('Error', 'Password must contain at least one uppercase letter');
                
            }
            if (!specialCharacterRegex.test(password) && !specialCharacterRegex.test(passwordRepeat) ) {
               
                Alert.alert('Error', 'Password must contain at least one special character');
                
            }
            if (password.length = 8) {
            
                    Alert.alert('Error', 'Password Must be 8 Charcters');
            }         
            if(password != passwordRepeat) {
                    Alert.alert('Error', 'Passwords Must Match');

            }
            else{
                navigation.navigate('SignIn');
            }
        }
      
    }
    const onSignUpPressed =() =>{
        console.warn('SignUp');
        navigation.navigate('SignIn');

    }
return(
    
    <View style={styles.root}> 
       <Text style={styles.title}>Create An Account</Text>
        
        
        <CustomInput placeholder="User Name" value={Username} setValue={setUsername}/>
        <CustomInput placeholder="Phone Number" value={phoneNumber} setValue={setPhoneNumber}/>
        <CustomInput placeholder="Email Address" value={Email} setValue={SetEmail}/>
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={false} />
        <CustomInput placeholder="Repeat Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={false} />
        <CustomButton text="Register" onPress={onRegesteredPressed}/>
        <CustomButton text="Have and account already? Sign in" onPress={onSignUpPressed} type="container_Fourth"/>
        
    </View>
    
);
};

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
       padding:30,
       backgroundColor: "#FAE526",
       width: '100%',
        height: '100%',

    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 125,
        flex: -1,
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,

    }
});
export default SignUpScreen;