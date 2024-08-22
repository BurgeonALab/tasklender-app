import React, { useState, useRef, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { NativeBaseProvider, Image, Center, Spinner, VStack } from 'native-base';
import cfunc from '../constants/clsfunction';

export default function Splash({ navigation }) {
    const lib = new cfunc();

    const cekUser = async () => {
        const email = await lib.getUserID();
        var count = 0;
        if(email !== null){
            count = await lib.countUserID(email);
        }
        
        if (count > 0) {
            navigation.replace('root');
        }
        else {
            navigation.replace("login");
        }
    };

    useEffect(() => {
        cekUser();
    }, []);

    return (
        <NativeBaseProvider>
            <Center flex={1}>
                <ImageBackground source={require("../assets/images/main-bg.jpg")} style={{ width: "100%", height: "100%" }}>
                    <Center flex={1}>
                        <VStack space={2}>
                            <Image source={require('../assets/images/winson-logo-resize-blue.png')} alt="Logo" />
                            { /* <Spinner size={"sm"} accessibilityLabel="Loading posts" /> */ }
                        </VStack>
                    </Center>
                </ImageBackground>
            </Center>
        </NativeBaseProvider>
    );
}