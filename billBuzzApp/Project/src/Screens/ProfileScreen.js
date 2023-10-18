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
import {inject, observer} from "mobx-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

const profilePicture = 'https://i.pinimg.com/736x/03/4b/de/034bde783ea726b922100c86547831e8.jpg';

class ProfileScreen extends React.Component {

    render() {
        const user = this.props.userStore;
        const date = new Date(user.birthday);

        return (
            <LinearGradient
                colors={['rgba(228, 156, 17, 0.4)', 'rgba(38, 44, 46, 0.8)', 'rgba(19, 24, 29, 1)', 'rgba(38, 44, 46, 0.8)', 'rgba(202, 128, 23, 0.4)']}
                locations={[0, 0.2, 0.4, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{backgroundColor: '#0B0D10'}}
            >
                <ScrollView style={styles.body}>
                    <View style={styles.pageHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={'arrow-back'} size={32} color={'#FFFFFF'} />
                        </TouchableOpacity>
                        <Text style={styles.backText}>Back</Text>
                    </View>

                    <View style={styles.profileIntro}>
                        <Image style={styles.profileImage} source={{uri: profilePicture}} resizeMode={"cover"}/>
                        <Text style={styles.nameHeading}>
                            {`${user.firstName} ${user.lastName}`}
                        </Text>
                    </View>

                    <View style={styles.profileOptions}>
                        <Text style={styles.categoryHeader}>Profile Info</Text>
                        <View style={styles.category}>
                            <TextInput style={{...styles.dataInput, borderTopWidth: 2}} value={`${user.firstName} ${user.lastName}`} editable={false} />
                            <TextInput style={styles.dataInput} value={`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} editable={false} />
                            <TextInput style={styles.dataInput} value={user.email} editable={false} />
                            <TextInput style={styles.dataInput} value={user.phoneNumber} editable={false} />
                        </View>

                        <Text style={styles.categoryHeader}>Legal</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.settingText}>Terms of Service</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn}><Text style={styles.settingText}>Privacy Policy</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.categoryHeader}>Account</Text>
                        <View style={styles.category}>
                            <TouchableOpacity style={{...styles.settingsBtn, borderTopWidth: 2}}><Text style={styles.importantText}>Delete User Account</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn} onPress={() => {
                                this.props.userStore.clearUser();
                                AsyncStorage.removeItem('user').then(() => {
                                    this.props.navigation.navigate({
                                        name: 'AppWelcome'
                                    });
                                });
                            }}>
                                <Text style={styles.importantText}>Log Out</Text>
                            </TouchableOpacity>
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
    pageHeader: {
        width: '100%',
        height: 'auto',
        paddingLeft: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        width: 40,
        height: 40,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F4CE82',
        borderRadius: 25
    },
    backText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default inject('userStore')(observer(ProfileScreen));