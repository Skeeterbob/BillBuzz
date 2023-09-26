import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, TextInput, Modal, Button } from 'react-native'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../CustomButton';
import {useNavigation} from '@react-navigation/native';




const Signinscreen = () => {
    const {height} = useWindowDimensions();
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
   
  const [passwordError, setPasswordError] = useState('');
    const [codeInputVisible, setCodeInputVisible] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleShowPasswordInput = () => {
        setShowPasswordInput(true);
      };
    
      const handleLogin = () => {
        // Perform login logic here
    
        // If login is successful, show the code input prompt
        if (true /* Replace with your login logic */) {
          setCodeInputVisible(true);
        }
      };
    
      const handleCodeSubmit = () => {
        // Validate and process the entered code
        if (code.length !== 6) {
          // Display an error message for an invalid code
          // You can set an error state variable similar to passwordError
        } else {
          // Process the code (e.g., validate it against the server)
          // If the code is valid, you can close the code input prompt
          setCodeInputVisible(false);
        }
      };

    const onSignInPressed =() =>{
        console.warn('Sign in');

        navigation.navigate('Confirm');

        fetch("http://localhost:3000", options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        })
        
        // fetch('http://localhost:3000/login')
        // .then(res => res.json())
        // .then(data => console.log(data))
        // .catch(error => console.error('Error:', error));
      
    }
  
    async function verfyUser() {
        
      }
    const onSignUpPressed =() =>{
        console.warn('Sign up');

        navigation.navigate('SignUp');
    }
return(
    
    <View style={styles.root}> 
    
       
        <Image source={logo} style = {[styles.logo, {height:height * .3}]} resizeMode='contain' />
        <Modal
        visible={codeInputVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />
          <Button title="Submit Code" onPress={handleCodeSubmit} />
        </View>
      </Modal>
        
        <CustomInput placeholder="Email Address" value={Username} setValue={setUsername}/>
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