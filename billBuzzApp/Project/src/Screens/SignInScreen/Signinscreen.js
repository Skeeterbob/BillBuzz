import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../CustomButton';
import {useNavigation} from '@react-navigation/native';

const Signinscreen = () => {
    const {height} = useWindowDimensions();
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const onSignInPressed =() =>{
        console.warn('Sign in');

        navigation.navigate('Confirm');
    }
    const onSignUpPressed =() =>{
        console.warn('Sign up');

        navigation.navigate('SignUp');
    }
return(
    
    <View style={styles.root}> 
       
        <Image source={logo} style = {[styles.logo, {height:height * .3}]} resizeMode='contain' />
        
        <CustomInput placeholder="Email Address" value={Username} setValue={setUsername}/>
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true} />
        <CustomButton text="Sign In" onPress={onSignInPressed}/>
        <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="container_SECONDARY"/>
        
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
    }
});
export default Signinscreen