import React from 'react'
import React, {useState} from 'react'
import { View, Text, Pressable, StyleSheet, Image, useState} from 'react-native'
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../CustomButton/CustomButton';

const AccountPage = () => {
const navigation = useNavigation();
const confrimPressed =() =>{
    console.warn('confrimPressed');

    navigation.navigate('SignIn');
}
const [username, setUsername] = useState('John Doe');
const [bio, setBio] = useState('Web Developer');
const [email, setEmail] = useState('john@example.com');
const [location, setLocation] = useState('New York');
const [interests, setInterests] = useState('React Native, JavaScript');

const handleEditProfile = () => {
  // Handle the logic for updating the user's profile here
  // You can send the updated data to a server or update it locally
  console.log('Profile updated!');
};

return (
  <View>
    <View>
      <Image
        source={{ uri: 'https://example.com/your-profile-picture.jpg' }}
        style={styles.profilePicture}
      />
      <TextInput
        style={styles.profileUsername}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.profileBio}
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
    </View>

    <View>
      <Text>Email:</Text>
      <TextInput
        style={styles.infoItem}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Text>Location:</Text>
      <TextInput
        style={styles.infoItem}
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <Text>Interests:</Text>
      <TextInput
        style={styles.infoItem}
        value={interests}
        onChangeText={(text) => setInterests(text)}
      />
    </View>

    <CustomButton text="Edit profile" onPress={handleEditProfile} />
  </View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
backgroundColor: '#FAE526',
},
header: {
alignItems: 'center',
},
profilePicture: {
width: 150,
height: 150,
borderRadius: 75,
marginBottom: 10,
},
profileUsername: {
fontSize: 24,
fontWeight: 'bold',
},
profileBio: {
fontSize: 18,
color: '#555',
},
info: {
marginTop: 20,
},
infoItem: {
fontSize: 16,
marginBottom: 10,
},
});

export default AccountPage;