import React from "react";
import { Pressable, StatusBar } from 'react-native';
import { HStack, Icon, Text, Box, VStack, Badge, Center } from 'native-base';
import cfunc from "../constants/clsfunction";
import styles from '../constants/index';

export default function HeaderInner({navigation, route, show_icon, show_text, header, bgcolor, txtcolor, txtnotif, show_back_arrow}) {
    const lib = new cfunc();

    const toNotif = () => {
        if(route.params !== undefined){
            if(route.params.hasOwnProperty('onGoBack')){
                navigation.navigate("notifikasi",{
                    onGoBack : () => route.params.onGoBack()
                });
            }
            else{
                navigation.navigate("notifikasi");
            }
        }
        else{
            navigation.navigate("notifikasi");
        }
    }

    const goBack = () => {
        if(route.params !== undefined){
            if(route.params.hasOwnProperty('onGoBack')){
                route.params.onGoBack();
            }
        }
        navigation.goBack();
    }

    return (
        <VStack>
            <StatusBar backgroundColor={lib.black_color}></StatusBar>
            {/* , borderBottomWidth: 2, borderBottomColor: 'rgba(28, 163, 255, 0.3)' */}
            <Box h={110} w={'100%'} bg={bgcolor} px={30} style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
                <Box w='50%' style={{display: 'flex', flexDirection: 'row'}}>
                    <Box style={show_back_arrow === "Y" ? [styles.d_flex, {marginRight: 15}] : styles.d_none}>
                        <Box h='100%' style={{display: 'flex', justifyContent: 'center'}}>
                            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })} onPress={() => { goBack() }}>
                                <Icon as={lib.left_arr_icon()} color={txtcolor} size="lg"/>
                            </Pressable>
                        </Box>
                    </Box>
                    <Box style={{display: 'flex', justifyContent : 'center'}}>
                        <Text color={txtcolor} fontSize="20" fontWeight="bold">
                            {header}
                        </Text>
                    </Box>
                </Box>
                <Box style={show_icon === "Y" ? styles.d_flex : styles.d_none} w='50%'>
                    <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}} h={"100%"}>
                        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { toNotif() }}>
                            <Icon as={lib.notif_icon()} color={'#FFFFFF'} size="2xl"/>
                        </Pressable>
                        {
                            txtnotif > 0 && 
                            <Badge ml={-4} mt={-4} colorScheme={"danger"} rounded={"sm"} variant={"solid"} alignSelf="center" _text={{fontSize: 12}}>
                                {txtnotif}
                            </Badge>
                        }
                    </Box>
                </Box>
            </Box>
        </VStack>
    );
}