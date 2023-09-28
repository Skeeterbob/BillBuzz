import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import DashboardScreen from "../Screens/DashboardScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import {View} from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const TabNavigator = createBottomTabNavigator();
const NAV_LINKS = {
    UserAccounts: {
        name: 'UserAccounts',
        icon: 'card',
        showHeader: false,
        component: DashboardScreen
    },
    UserProfile: {
        name: 'UserProfile',
        icon: 'settings',
        showHeader: false,
        component: ProfileScreen
    }
};

const navbarStyles = {
    backgroundColor: '#2d2d2d',
    position: 'absolute',
    borderRadius: 25,
    height: 60,

    left: 25,
    right: 25,
    bottom: 10,
    elevation: 2,
    borderTopWidth: 0
};

const NavButton = ({icon, size, colors}) => (
    <View
        style={{
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <MaskedView
            style={{flexDirection: 'row', height: size}}
            maskElement={
                <View style={{alignItems: 'center'}}>
                    <Icon name={icon} size={size} color={"white"}/>
                </View>
            }
        >
            <LinearGradient colors={colors} style={{flex: 1}}/>
        </MaskedView>
    </View>
);

const tabBarIconFunction = (route) => ({focused}) => {
    const iconName = NAV_LINKS[route.name].icon;
    const iconColors = focused ? ['#F4CE82', '#eca239'] : ['#D7D7D7', '#FFFFFF'];
    return <NavButton icon={iconName} size={32} colors={iconColors} />;
};

const NavComponent = () => (
    <TabNavigator.Navigator
        screenOptions={({route}) => ({
            tabBarIcon: tabBarIconFunction(route),
            tabBarActiveTintColor: '#d08f33',
            tabBarInactiveTintColor: '#D7D7D7',
            tabBarShowLabel: false,
            tabBarStyle: navbarStyles
        })}
    >
        {Object.values(NAV_LINKS).map(navLink => (
            <TabNavigator.Screen
                key={navLink.name}
                name={navLink.name}
                component={navLink.component}
                options={{headerShown: navLink.showHeader}}
            />
        ))}
    </TabNavigator.Navigator>
);

export default NavComponent;