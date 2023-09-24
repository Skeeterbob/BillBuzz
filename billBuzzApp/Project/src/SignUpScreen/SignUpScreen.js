import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'

import CustomInput from '../Components/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';

const SignUpScreen = () => {
    const {height} = useWindowDimensions();
    const [Username, setUsername] = useState('');
    const [Email, SetEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const navigation = useNavigation();
    const onRegesteredPressed =() =>{
        console.warn('onRegesteredPressed');
    }
    const onSignUpPressed =() =>{
        console.warn('SignUp');
        navigation.navigate('SignIn');

    }
return(
    
    <View style={styles.root}> 
       <Text style={styles.title}>Create An Account</Text>
        
        
        <CustomInput placeholder="User Name" value={Username} setValue={setUsername}/>
        <CustomInput placeholder="Email Address" value={Email} setValue={SetEmail}/>
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true} />
        <CustomInput placeholder="Repeat Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={true} />
        <CustomButton text="Register" onPress={onRegesteredPressed}/>
        <CustomButton text="Have and account already? Sign in" onPress={onSignUpPressed} type="container_THIRD"/>
        
    </View>
    
);
};

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
       padding:30,
       backgroundColor: "#FAE526",

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