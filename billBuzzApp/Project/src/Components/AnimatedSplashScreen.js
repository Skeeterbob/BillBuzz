import React from 'react';
import {Image, Modal, Text, View} from 'react-native';
import Logo from '../../assets/images/bee_logo.png';

const AnimatedSplashScreen = ({loaded, backgroundColor, logoWidth, logoHeight}) => {

    console.log(loaded)
    return (
        <Modal
            visible={!loaded}
            animationType="fade"
            transparent={false}
        >
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: backgroundColor
                }}
            >
                <Image source={Logo} style={{width: logoWidth, height: logoHeight}} resizeMode={"contain"}/>
                <Text style={{fontSize: 42, fontWeight: 'bold', color: '#F4CE82', marginTop: -32}}>BillBuzz</Text>
            </View>
        </Modal>
    );
};

export default AnimatedSplashScreen;