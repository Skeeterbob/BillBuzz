import Svg, {Defs, G, LinearGradient, Path, Stop} from "react-native-svg";
import {StyleSheet, View} from "react-native";
import React from "react";


// Authored by Hadi Ghaddar from line(s) 1 - 78


const HexagonComponent = (props) => {
    return (
        <Svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1929.11 1748.58"
            width={props.size}
            height={props.size}
        >
            <Defs>
                <LinearGradient
                    id="linear-gradient"
                    x1={0}
                    y1={876.29}
                    x2={1929.11}
                    y2={876.29}
                    gradientTransform="matrix(1 0 0 -1 0 1750.58)"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0} stopColor="#faf9e2"/>
                    <Stop offset={0.11} stopColor="#f4e5bb"/>
                    <Stop offset={0.25} stopColor="#edce8f"/>
                    <Stop offset={0.4} stopColor="#e6ba6b"/>
                    <Stop offset={0.55} stopColor="#e1ad50"/>
                    <Stop offset={0.7} stopColor="#dca139"/>
                    <Stop offset={0.85} stopColor="#da9c2e"/>
                    <Stop offset={1} stopColor="#da992b"/>
                </LinearGradient>
            </Defs>
            <G opacity={0.15}>
                <Path
                    d="M1268.89 1662.84H660.22c-93.1 0-179.86-50.09-226.41-130.72l-304.33-527.11c-46.55-80.63-46.55-180.8 0-261.43l304.33-527.13c46.55-80.63 133.31-130.72 226.41-130.72h608.67c93.1 0 179.86 50.09 226.41 130.72l304.33 527.12c46.55 80.63 46.55 180.81 0 261.43l-304.33 527.12c-46.55 80.63-133.31 130.72-226.41 130.72z"
                    fill="#faba45"
                    strokeWidth={0}
                />
            </G>
            <G opacity={0.7}>
                <Path
                    d="M1177 1484.74H705.81c-72.07 0-139.23-38.77-175.27-101.19l-235.6-408.07c-36.04-62.42-36.04-139.97 0-202.39l235.6-408.07c36.04-62.42 103.2-101.19 175.27-101.19H1177c72.08 0 139.24 38.78 175.27 101.19l235.6 408.07c36.04 62.42 36.04 139.97 0 202.39l-235.6 408.07c-36.04 62.42-103.2 101.19-175.27 101.19z"
                    fill="none"
                    stroke="#e39a29"
                    strokeMiterlimit={10}
                    strokeWidth="6px"
                />
            </G>
            <Path
                d="M1301.99 1748.56H627.15c-103.23 0-199.41-55.53-251.01-144.93L38.7 1019.22c-51.6-89.39-51.6-200.46 0-289.85l337.43-584.44C427.74 55.53 523.92 0 627.15 0h674.84C1405.22 0 1501.4 55.53 1553 144.93l337.41 584.43c51.6 89.39 51.6 200.46 0 289.85L1553 1603.64c-51.6 89.39-147.81 144.93-251.01 144.93v-.02zM627.15 119.09c-60.81 0-117.48 32.71-147.88 85.38L141.83 788.9c-30.41 52.68-30.41 118.09 0 170.77l337.41 584.43c30.41 52.68 87.07 85.38 147.88 85.38h674.84c60.81 0 117.48-32.71 147.88-85.38l337.41-584.43c30.41-52.68 30.41-118.09 0-170.77l-337.41-584.43c-30.41-52.68-87.07-85.38-147.88-85.38H627.12h.02z"
                strokeWidth={0}
                fill="url(#linear-gradient)"
            />

            <View style={styles.hexagonChildrenView}>
                {props.children}
            </View>
        </Svg>
    )
};

const styles = StyleSheet.create({
    hexagonChildrenView: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HexagonComponent;