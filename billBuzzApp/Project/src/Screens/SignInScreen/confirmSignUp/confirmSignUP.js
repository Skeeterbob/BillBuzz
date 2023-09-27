import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, Button, TextInput, Alert} from 'react-native'

import CustomInput from '../../../Components/CustomInput';
import CustomButton from '../../../CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';



const ConfirmSignUP = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  


    const confrimPressed =() =>{
        console.warn('confrimPressed');
        if(code==123456){
          navigation.navigate('Account');
        }
        else{
          Alert.alert("Error", "Code Invalid")
        }
        
       
      }
    
        
    
    const backToSignIn =() =>{
        console.warn('backToSignIn');
        
        navigation.navigate('SignIn');
        
    }
   
   
    const resendCodePressed =() =>{
        console.warn('resendCodePressed');
    }
    


    const handleCodeChange = (text) => {
        // Ensure the input consists of only numeric characters and has a length of 6
        if (/^\d{0,6}$/.test(text)) {
          setCode(text);
        }
       
      };
return(
    
    <View style={styles.root}> 
       <Text style={styles.title}>Confirm Sign Up</Text>
       <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={handleCodeChange}
        
      />
      
    </View>
       
        <CustomButton text="Confirm" onPress={confrimPressed}/>
        <CustomButton text="Resend code" onPress={resendCodePressed} type="container_Fourth"/>
        <CustomButton text="Back to sign in"  onPress={backToSignIn} type="container_Fourth"/>
        
        
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

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        width: 200,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 20,
      }
});
export default ConfirmSignUP;