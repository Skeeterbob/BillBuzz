import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, Alert} from 'react-native'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../CustomButton';
import {useNavigation} from '@react-navigation/native';






const Signinscreen = () => {
    const {height} = useWindowDimensions();
    
    const [password, setPassword] = useState('');
   
  const [passwordError, setPasswordError] = useState('');
    const [codeInputVisible, setCodeInputVisible] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    // const handleShowPasswordInput = () => {
    //     setShowPasswordInput(true);
    //   };
    
    //   const handleLogin = () => {
    //     // Perform login logic here
    
    //     // If login is successful, show the code input prompt
    //     if (true /* Replace with your login logic */) {
    //       setCodeInputVisible(true);
    //     }
    //   };
    
    //   const handleCodeSubmit = () => {
    //     // Validate and process the entered code
    //     if (code.length !== 6) {
    //       // Display an error message for an invalid code
    //       // You can set an error state variable similar to passwordError
    //     } else {
    //       // Process the code (e.g., validate it against the server)
    //       // If the code is valid, you can close the code input prompt
    //       setCodeInputVisible(false);
    //     }
    //   };

    const onSignInPressed =() =>{
    
      const uppercaseRegex = /[A-Z]/;
      const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

       
       const userAuthenticated = true; 

    if (userAuthenticated) {
     
      if (password.length > 8) {
        
        Alert.alert('Error', 'Password Must be 8 Charcters');
      } else {
        setCodeInputVisible(true);
        navigation.navigate('Confirm');
        }
      } else {
      setPasswordError('Invalid email or password');
      }

        // if(verfyUser.validate == true){
          
        //   console.warn('Sign in');
        // }
        // else{
        //   console.warn('Sign in failed');
        // }
    }
  
    // async function verfyUser() {
    //   try {
    //     const response = await fetch("http://localhost:3001/login/verify"); // Replace with the URL of the website you want to fetch data from
    //     if (!response.ok) {
    //       throw new Error(`Network response was not ok, status: ${response.status}`);
    //     }
        
    //     // You can process the response here
    //     const data = await response.text(); // Use response.text() for non-JSON data
        
    //     // Log or use the fetched data
    //     console.log(data);
        
    //     return data;
    //   } catch (error) {
    //     console.error('Fetch failed:', error);
    //     throw error; // You can handle or rethrow the error as needed
    //   }
     
    //   const response = await fetch("http://localhost:3000", options = {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     Accept:'application/json',
    //     },
    //     body:{
    //     "username":email,
    //     "password":password,
    //     }
       
    // });
    //     return response.json();
    //   }
   
    
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
        <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="container_SECONDARY"/>
        
    </View>
    
);
};

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
});
export default Signinscreen