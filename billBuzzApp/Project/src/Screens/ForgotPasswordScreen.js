//hwinczner whole page
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SERVER_ENDPOINT } from "@env";


class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  handleForgotPassword = async () => {
    try {
      const response = await fetch(SERVER_ENDPOINT + '/login/forgot-password', {
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

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Forgot Password</Text>

        <TextInput
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })}
          placeholder="Email"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 }}
        />

        <TouchableOpacity
          onPress={this.handleForgotPassword}
          style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }}
        >
          <Text style={{ color: 'white' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ForgotPasswordScreen;
