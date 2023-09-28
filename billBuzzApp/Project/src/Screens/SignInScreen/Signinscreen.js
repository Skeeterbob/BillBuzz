import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, Alert} from 'react-native'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../CustomButton';
import {useNavigation} from '@react-navigation/native';






const Signinscreen = () => {
    const {height} = useWindowDimensions();
    
    const [password, setPassword] = useState('');
   
   
    
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
   
    
   async function onSignInPressed () {  
        const result = await verifyUser(email, password)

        
         if(result.validate == true){
          
          console.warn('Sign in');
          navigation.navigate('Confirm');
         
        }
        else{
          Alert.alert('Error','Invalid Email or Password')
        }

       
    }
  
    async function verifyUser(email, password) {
     
     
      const response = await fetch("http://10.0.2.2:3000/login/verify", options = {
        method: "POST",
        headers: {
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin":'http://10.0.2.2:3000',
        Accept:"application/json",
        },
        body:JSON.stringify({
          
            "email": email,
            "password": password
            
        })
      
      })
      return response.json();
    }
  
  
    
    
    const onSignUpPressed =() =>{
      console.warn('Sign up');
      navigation.navigate('SignUp');
      
        

        
    }


return(
    
    <View style={styles.root}> 
    
       
        <Image source={logo} style = {[styles.logo, {height:height * .3}]} resizeMode='contain' />
       
        <CustomInput placeholder="Email Address" value={email} setValue={setEmail}/>
        
        
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true} />
        <CustomButton text="Sign In" onPress={onSignInPressed}/>
        <CustomButton text  = "Don't have an account? Create one" onPress={onSignUpPressed} type="container_SECONDARY"/>
        
    </View>
    
);
}
const styles = StyleSheet.create({
    root:{
        width: '100%',
        height: '100%',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    text:{
      fontWeight: 'bold',

    }
});
export default Signinscreen;