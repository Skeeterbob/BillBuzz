import React from 'react'
import { View, Text, Pressable, StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../CustomButton/CustomButton';

const accountPage = () => {
const navigation = useNavigation();
const confrimPressed =() =>{
    console.warn('confrimPressed');

    navigation.navigate('SignIn');
}
return(
  <View>
    <CustomButton text="Confirm" onPress={confrimPressed}/>

  </View>
       
);
};

export default accountPage;