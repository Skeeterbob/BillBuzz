import React from 'react'
import { View, Text, TextInput, StyleSheet} from 'react-native'

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
return(
    <View style={styles.container}> 
       <TextInput style={styles.input} 
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        />
       
    </View>
);
};
const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 60,
        marginVertical: 15,
        borderColor: 'black',
        borderWidth: 1.5,
        borderRadius: 30, 
        alignItems: 'center',
    },
input: {
    marginTop: 1.5,
    fontStyle: 'italic',
    fontSize: 19,
},
text:{

}
})

 export default CustomInput;