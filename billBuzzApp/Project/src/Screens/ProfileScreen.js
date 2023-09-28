import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {ScrollView, Text, StyleSheet} from "react-native";

class ProfileScreen extends React.Component {

    render() {
        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{backgroundColor: '#0B0D10'}}
            >
                <ScrollView style={styles.body}>
                    <Text style={{color: '#FFFFFF', fontSize: 28, fontWeight: 'bold'}}>Hello Profile Home</Text>
                </ScrollView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
});

export default ProfileScreen;