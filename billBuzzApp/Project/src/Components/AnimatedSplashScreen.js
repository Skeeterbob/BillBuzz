import React, { useState, useEffect } from 'react';
import { Modal, View } from 'react-native';
import LottieView from 'lottie-react-native';

const AnimatedSplashScreen = ({ loaded, backgroundColor, logoWidth, logoHeight }) => {
    const [isSplashVisible, setIsSplashVisible] = useState(!loaded);

    useEffect(() => {
        const frameRate = 60;
        const animationDuration = 207 / frameRate;

        const timer = setTimeout(() => {
            setIsSplashVisible(false);
        }, animationDuration * 1000); // Convert to milliseconds

        return () => clearTimeout(timer);
    }, [loaded]);

    return (
        <Modal
            visible={isSplashVisible}
            animationType="fade"
            transparent={false}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor || 'white'
            }}>
                <LottieView
                    source={require('../../assets/animations/animation.json')}
                    autoPlay
                    loop={false}
                    resizeMode="cover"
                    style={{
                        width: '50%',
                        height: '50%'
                    }}
                />
            </View>
        </Modal>
    );
};

export default AnimatedSplashScreen;