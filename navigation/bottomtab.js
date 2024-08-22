import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/home';
import TeamScreen from '../screens/team';
import AkunScreen from '../screens/akun';
import ProyekScreen from '../screens/proyek';

export default function BottomTabNavigator() {
    const BottomTab = createBottomTabNavigator()
    return (
        <BottomTab.Navigator
            initialRouteName="Home">
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown : false,
                    tabBarIcon: ({color}) => <MaterialCommunityIcons marginTop={10} size={30} name="home" color={color} />,
                    tabBarStyle: {height:70, borderTopWidth: 2, borderTopColor: 'rgba(28, 163, 255, 0.3)'},
                    tabBarLabelStyle: {fontSize:12, fontWeight: 'bold', marginBottom: 10}
                }}
            />
            <BottomTab.Screen
                name="Tim"
                component={TeamScreen}
                options={{
                    headerShown : false,
                    tabBarIcon: ({color}) => <MaterialCommunityIcons size={30} marginTop={10} name="account-group" color={color} />,
                    tabBarStyle: {height:70, borderTopWidth: 2, borderTopColor: 'rgba(28, 163, 255, 0.3)'},
                    tabBarLabelStyle:{fontSize:12, fontWeight: 'bold', marginBottom: 10}
                }}
            />
            <BottomTab.Screen
                name="Proyek"
                component={ProyekScreen}
                options={{
                    headerShown : false,
                    tabBarIcon: ({color}) => <MaterialCommunityIcons size={30} marginTop={10} name="view-list" color={color} />,
                    tabBarStyle: {height:70, borderTopWidth: 2, borderTopColor: 'rgba(28, 163, 255, 0.3)'},
                    tabBarLabelStyle:{fontSize:12, fontWeight: 'bold', marginBottom: 10}
                }}
            />
            <BottomTab.Screen
                name="Akun"
                component={AkunScreen}
                options={{
                    headerShown : false,
                    tabBarIcon: ({color}) => <MaterialCommunityIcons size={30} marginTop={10} name="account" color={color} />,
                    tabBarStyle: {height:70, borderTopWidth: 2, borderTopColor: 'rgba(28, 163, 255, 0.3)'},
                    tabBarLabelStyle:{fontSize:12, fontWeight: 'bold', marginBottom: 10}
                }}
            />
        </BottomTab.Navigator>
    );
}