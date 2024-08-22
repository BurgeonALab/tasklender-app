import React, { useState } from "react";
import { Pressable } from "react-native";
import { HStack, Icon, Text, IconButton, StatusBar, VStack } from 'native-base';
import cfunc from "../constants/clsfunction";
import styles from '../constants/index';

export default function HeaderOuter({navigation, show_icon, show_text, header, bgcolor, txtcolor}) {
    const lib = new cfunc();
    const icon = <IconButton icon={<Icon as={lib.left_arr_icon()} color={txtcolor} />} style={show_icon === "Y" ? styles.d_flex : styles.d_none} onPress={() => {lib.nav_goback(navigation)}} />;

    return (
        <VStack>
            <StatusBar backgroundColor={lib.main_color_hex} translucent={true}></StatusBar>
            <HStack bg={bgcolor} px={1} pt={7} pb={2} justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems={"center"}>
                    <Pressable  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { lib.nav_goback(navigation) }}>
                        <Icon as={lib.left_arr_icon()} color={txtcolor} size="lg"/>
                    </Pressable>
                    <Text color={txtcolor} fontSize="20" fontWeight="bold" style={show_text === "Y" ? styles.d_flex : styles.d_none} pl={1}>
                        {header}
                    </Text>
                </HStack>
            </HStack>
        </VStack>
    );
}