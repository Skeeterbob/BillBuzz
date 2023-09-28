import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, Button, TextInput, Alert} from 'react-native'

import CustomInput from '../../../Components/CustomInput';
import CustomButton from '../../../CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
//import RNSharedPreferences from 'react-native-android-shared-preferences';

//var sharedPreferences = RNSharedPreferences.getSharedPreferences("billBuzzInfo");

//We can cut this and take it to wherever we need to get the token from.
/*var sharedPreferences = RNSharedPreferences.getSharedPreferences("billBuzzInfo");
sharedPreferences.getString("name", (result) => {
     // Should return Karthik here ...
     console.log("Get result :: " + result);
})*/

const ConfirmSignUP = () => {
  const [getCode, setGetCode] = useState('');
  const navigation = useNavigation();
  


    async function confrimPressed () {
        const result = await verifyUser();
        console.log(result.validate);
        console.warn('confrimPressed');
        if(result.validate){
          //let authToken = result['token'];
          // sharedPreferences.putString("jwtAuthToken", authToken, (result) => {
          //   console.log("sharedPreferencese PUT result: " + result);
          // })
          navigation.navigate('Account');
        }
        else{
          Alert.alert("Error", "Code Invalid");
        }
      }
        
       

    async function verifyUser(code, phNum) {
     
     
      const response = await fetch("http://10.0.2.2:3000/login/verify/sms", options = {
        method: "POST",
        headers: {
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin":'http://10.0.2.2:3000/login/verify/sms',
        "Accept":"application/json"
        },
        body:{
            "code": code,
            "phNum": phNum             
        }
        
      })
      console.log(response);
      return response
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
          setGetCode(setGetCode);
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
        value={getCode}
        onChangeText={handleCodeChange}
        
      />
      
    </View>
       
        <CustomButton text="Confirm" onPress={confrimPressed}/>
        <CustomButton text="Resend code" onPress={resendCodePressed} type="container_Fourth"/>
        <CustomButton text="Back to sign in"  onPress={backToSignIn} type="container_Fourth"/>
        
        
    </View>
    
)
}
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