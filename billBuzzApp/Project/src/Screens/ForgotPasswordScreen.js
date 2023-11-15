/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const ForgotPasswordScreen = ({ route }) => {
  const token  = route.params ? route.params.token : null;  // Assuming you're passing the token through navigation params

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Password is required!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
        }),
      });
      if (!response.ok) {
        //throw new Error('Network response was not ok ' + response.statusText);
        console.log(response.status, response.statusText);
      }
      const data = await response.json();
      Alert.alert(data.message);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to send email. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Enter your new password:</Text>
      <TextInput 
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        secureTextEntry={true}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Submit" onPress={handleResetPassword} disabled={loading} />
    </View>
  );
};

export default ForgotPasswordScreen;
