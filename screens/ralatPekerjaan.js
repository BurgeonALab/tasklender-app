import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Menu, Icon, Center, Image } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function RalatPekerjaanScreen({ navigation, route }){
    const [bgColor, setBgColor] = useState(route.params.bgcolor);
    const [txtColor, setTxtColor] = useState(route.params.txtcolor);
    const [err, setErr] = useState(0);
    const [nama, setNama] = useState(route.params.nama);
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const arr = lib.list_color();
    const [email, setEmail] = useState();
    const id = route.params.id;
    const nmPkj = route.params.nmPkj;
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const editKrj = () => {
        setErr(0);
        setIsSave(true);

        if(nama === "" || bgColor === "" || txtColor === ""){
            setErr(-1);
            setIsSave(false);
        }
        else{
            lib.updKrj(id, nama, bgColor, txtColor, email).then((json) => {
                if(parseInt(json.err[0]) !== 0){
                    setErr(json.err[0]);
                    setIsSave(false);
                }
                else{
                    route.params.onGoBack();
                    navigation.goBack();
                }
            })
        }
    }

    const getEmail = async() => {
        const data = await lib.getUserID();
        setEmail(data);
    }

    const nav_goBack = () => {
        route.params.onGoBack();
        navigation.goBack();
    }

    useEffect(() => {
        getEmail();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "RalatPekerjaan", "");
        });
    
        return () => {
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    return (
        <NativeBaseProvider>
            <Header
                navigation={navigation}
                route={route}
                show_text={"Y"}
                header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>{nmPkj}</Text>
                        <Text fontWeight={'bold'} fontSize={20}>Ubah Pekerjaan</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <ScrollView paddingX={30} paddingY={30}>
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none}>
                    <Box>
                    <Input
                        InputLeftElement={
                            <Icon
                                as={lib.search_icon()}
                                size={18}
                                color='#1CA3FF'
                                marginLeft={5}
                            />
                        }
                        _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                        variant="unstyled"
                        bg='rgba(28, 163, 255, 0.3)'
                        placeholderTextColor='#1CA3FF'
                        h={50}
                        rounded={'sm'}
                        value={nmPkj}
                        placeholder="Cari Pekerjaan"
                        fontSize={"md"}
                        onChangeText={(val) => setNama(val)}>
                    </Input>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Pekerjaan wajib diisi</Text>
                    </Box>
                    <Box bg='rgba(28, 163, 255, 0.3)' mt={3} rounded={'sm'}>
                        <HStack>
                            <Center h={'50px'} w={'50px'} roundedTopLeft={'sm'} roundedBottomLeft={'sm'} bg={bgColor}></Center>
                            <Center marginLeft="15px" w="70%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize={'14px'} color={'#1CA3FF'}>Warna Background</Text>
                                <Menu w="100%" h={80} trigger={(props) => {
                                    return (<NPressable {...props} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.pallete_icon()} color={'#1CA3FF'} size="md"/></NPressable>)
                                }}>
                                {
                                    arr.map((data) => (
                                        <Menu.Item bgColor={data[0]} key={data[0]} onPress={() => { setBgColor(data[0]) }}><Text color={data[1]}>{data[0]}</Text></Menu.Item>
                                    ))
                                }
                                </Menu>
                            </Center>
                        </HStack>
                    </Box>
                    <Box bg='rgba(28, 163, 255, 0.3)' mt={3} rounded={'sm'}>
                        <HStack>
                            <Center h={'50px'} w={'50px'} roundedTopLeft={'sm'} roundedBottomLeft={'sm'} bg={txtColor}></Center>
                            <Center marginLeft="15px" w="70%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize={'14px'} color={'#1CA3FF'}>Warna Tulisan</Text>
                                <Menu w="100%" h={80} trigger={(props) => {
                                    return (<NPressable {...props} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.pallete_icon()} color={'#1CA3FF'} size="md"/></NPressable>)
                                }}>
                                {
                                    arr.map((data) => (
                                        <Menu.Item bgColor={data[0]} key={data[0]} onPress={() => { setTxtColor(data[0]) }}><Text color={data[1]}>{data[0]}</Text></Menu.Item>
                                    ))
                                }
                                </Menu>
                            </Center>
                        </HStack>
                    </Box>
                    <Box mt={30} display={'flex'} alignItems={'center'}>
                        <Button style={styles.tsk_btn_main} w={'50%'} size="lg" p={5} isLoading={isSave} onPress={editKrj}>Ubah</Button>
                    </Box>
                </VStack>
                <VStack style={err === -2 ? styles.d_flex : styles.d_none} space={8} py={4} px={4}>
                    <Center>
                        {
                            lib.error_400()
                        }
                    </Center>
                    <Box mt={30} display={'flex'} alignItems={'center'}>
                        <Button size={"lg"} p={5} style={styles.tsk_btn_main} onPress={() => { nav_goBack(); }} rounded={"xl"}>Kembali</Button>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
