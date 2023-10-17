import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    Text,
    StyleSheet,
    View,
    Platform,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";

const MOCK_USER = {
    firstName: 'Hadi',
    lastName: 'Ghaddar',
    email: 'hadimghaddar@gmail.com',
    birthday: '09/10/2001',
    phoneNumber: '+1 (313) 421-6784',
    profilePicture: 'https://i.pinimg.com/736x/03/4b/de/034bde783ea726b922100c86547831e8.jpg'
};

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
                    <View style={styles.profileIntro}>
                        <Image style={styles.profileImage} source={{uri: MOCK_USER.profilePicture}} resizeMode={"cover"}/>
                        <Text style={styles.nameHeading}>
                            {`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
                        </Text>
                    </View>

                    <View style={styles.profileOptions}>
                        <Text style={styles.categoryHeader}>Profile Info</Text>
                        <View style={styles.category}>
                            <TextInput style={{...styles.dataInput, borderTopWidth: 2}} value={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`} editable={false} />
                            <TextInput style={styles.dataInput} value={MOCK_USER.birthday} editable={false} />
                            <TextInput style={styles.dataInput} value={MOCK_USER.email} editable={false} />
                            <TextInput style={styles.dataInput} value={MOCK_USER.phoneNumber} editable={false} />
                        </View>

                        <Text style={styles.categoryHeader}>Legal</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.settingText}>Terms of Service</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn}><Text style={styles.settingText}>Privacy Policy</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.categoryHeader}>Account</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.importantText}>Delete User Account</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn}><Text style={styles.importantText}>Log Out</Text></TouchableOpacity>
                        </View>
                    </View>
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
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    profileOptions: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 32
    },
    profileIntro: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    nameHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
        borderBottomWidth: 2,
        borderColor: '#F4CE82'
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderColor: '#F4CE82',
        borderWidth: 4
    },
    categoryHeader: {
        color: '#dcdcdc',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginLeft: 20,
        marginBottom: 5
    },
    category: {
        backgroundColor: '#363636',
        width: '100%',
        height: 'auto',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#2c2c2c',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        marginBottom: 40
    },
    dataInput: {
        width: '100%',
        height: 'auto',
        padding: 5,
        borderBottomWidth: 2,
        borderColor: '#F4CE82',
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    settingsBtn: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#F4CE82',
        borderBottomWidth: 1,
    },
    settingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    importantText: {
        color: '#f65858',
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ProfileScreen;