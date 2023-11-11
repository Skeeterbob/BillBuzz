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
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      Alert.alert('Success', 'Your password has been reset successfully.');
      setPassword('');  // Clear the password input field

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
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

export default ForgotPasswordScreen;*/

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.0.165/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Enter your email to reset your password:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Reset Password" onPress={handleResetPassword} disabled={loading} />
    </View>
  );
};

export default ForgotPasswordScreen;
