import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'

import CustomInput from '../../../Components/CustomInput';
import CustomButton from '../../../CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';



const ConfirmSignUP = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
    const confrimPressed =() =>{
        console.warn('confrimPressed');
        
        navigation.navigate('Account');
    }
    const backToSignIn =() =>{
        console.warn('backToSignIn');
        
        navigation.navigate('SignIn');
        
    }
    const resendCodePressed =() =>{
        console.warn('resendCodePressed');
    }
return(
    
    <View style={styles.root}> 
       <Text style={styles.title}>Confirm Sign Up</Text>
        
       <CustomInput placeholder="Code" value={code} setValue={setCode}/>
        <CustomButton text="Confirm" onPress={confrimPressed}/>
        <CustomButton text="Resend code" onPress={resendCodePressed} type="container_THIRD"/>
        <CustomButton text="Back to sign in" onPress={backToSignIn} type="container_Fourth"/>
        
        
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
export default ConfirmSignUP;