import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, Alert} from 'react-native'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../CustomButton';
import {useNavigation} from '@react-navigation/native';






const Signinscreen = () => {
    const {height} = useWindowDimensions();
    
    const [password, setPassword] = useState('');
   
    const [seePassword, setSeePassword] = useState(true);
    const [codeInputVisible, setCodeInputVisible] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [checkValidEmail, SetCheckValidEmail] = useState(false)
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const handleCheckEmail = text =>{
      let re = /\S+@\S+\.\S+/;
      let regex = /^[\+]?[(]?\d{3}[)]?[-\s\.]?\d{3}[-\s\.]?\d{4,6}$/;
      $/im;

      setEmail(text)
      if(re.test(text)|| regex.test(test)){
        SetCheckValidEmail(false);
      }else{
        SetCheckValidEmail(true);
      }
    }
   
    
   async function onSignInPressed () {

    navigation.navigate('Confirm');
    
        // const result = await verifyUser(email, password)

        
        //  if(result.validate == true){
          
        //   console.warn('Sign in');
         
        // }
        // else{
        //   console.warn('Sign in failed');
        // }

       
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
       
        <CustomInput placeholder="Email Address" value={email} setValue={setEmail} onChangeText={(text)=>handleCheckEmail(text)}/>
        
        {checkValidEmail ? <Text> Wrong Format</Text> : <Text></Text>}
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true} />
        <CustomButton text="Sign In" onPress={onSignInPressed}/>
        <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="container_SECONDARY"/>
        
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
      hexagon: {
        width: 100,
        height: 100,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white', // Adjust the border color as needed
        margin: 5, // Adjust the margin for spacing between hexagons
        transform: [{ rotate: '30deg' }],
      },
});
export default Signinscreen;