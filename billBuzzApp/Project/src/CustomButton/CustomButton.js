import React from 'react'
import { View, Text, Pressable, StyleSheet} from 'react-native'

const CustomButton = ({onPress, text, type = "container_PRIMARY" }) => {
return(
    <Pressable onPress={onPress} 
    style={[styles.container, styles[type]]}> 
      <Text style={[styles.Text, styles[type]]}>{text}</Text>
    </Pressable>
     
       
);
};
const styles = StyleSheet.create({
   container: {
    alignItems: 'center',
    width: '60%',
    padding: 5,
   },
   container_PRIMARY:{
    backgroundColor: '#FBEE7B',
    marginVertical: 15,
    borderRadius: 30,
    fontSize: 17,
    fontWeight: 'bold',
    
   },
   container_SECONDARY:{
    width: '100%',
    top: 152,
    left: 27,
   },
   container_THIRD:{
    borderColor: 'white',
    borderWidth: 2,
    
   },
   container_Fourth:{
  
   },
   Text_PRIMARY: {
    
   }

});

export default CustomButton