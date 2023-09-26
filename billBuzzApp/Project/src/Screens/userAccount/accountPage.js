import React from 'react'
import { View, Text, Pressable, StyleSheet, Image} from 'react-native'
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../CustomButton/CustomButton';

const AccountPage = () => {
const navigation = useNavigation();
const confrimPressed =() =>{
    console.warn('confrimPressed');

    navigation.navigate('SignIn');
}
return(
  <View style={styles.container}>
  <View style={styles.header}>
    <Image
      source={{ uri: 'https://example.com/your-profile-picture.jpg' }}
      style={styles.profilePicture}
    />
    <Text style={styles.profileUsername}>John Doe</Text>
    <Text style={styles.profileBio}>Web Developer</Text>
  </View>

  <View style={styles.info}>
    <Text style={styles.infoItem}>Email: john@example.com</Text>
    <Text style={styles.infoItem}>Location: New York</Text>
    <Text style={styles.infoItem}>Interests: React Native, JavaScript</Text>
  </View>
  <CustomButton text="Edit profile" onPress={confrimPressed}/>

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