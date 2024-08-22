import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Menu, Icon, Center } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TambahProyekScreen({ navigation, route }){
    const [bgColor, setBgColor] = useState("dark.900");
    const [txtColor, setTxtColor] = useState("dark.100");
    const [err, setErr] = useState(0);
    const [nama, setNama] = useState("");
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const arr = lib.list_color();
    const [email, setEmail] = useState();
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();
    const job_icon = lib.job_icon();

    const addPyk = () => {
        setErr(0);
        setIsSave(true);

        if(nama === "" || bgColor === "" || txtColor === ""){
            setErr(-1);
            setIsSave(false);
        }
        else{
            lib.newPyk(nama, bgColor, txtColor, email).then((json) => {
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

    const getData = async() => {
        const email = await lib.getUserID();
        
        setEmail(email);
    }

    const toMShip = () => {
        navigation.navigate('membership');
    }

    useEffect(() => {
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "Proyek", "");
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
                show_icon={"N"}
                show_text={"Y"}
                header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>Tambah Proyek</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <ScrollView>
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none} px='30px' py='30px'>
                    <Box>
                        <Input
                            InputLeftElement={
                                <Icon
                                    as={job_icon}
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
                            placeholder="Nama Proyek"
                            fontSize={"md"}
                            onChangeText={(val) => setNama(val)}>
                        </Input>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Proyek wajib diisi</Text>
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
                    <Box style={{display: 'flex', alignItems: 'center', marginTop: 30}}>
                        <Button w='50%' bgColor={'#1CA3FF'} size="lg" p={5} isLoading={isSave} onPress={addPyk}>
                            <Text fontSize={'md'} color={'#FFFFFF'} fontWeight={'bold'}>Tambah</Text>
                        </Button>
                    </Box>
                </VStack>
                <VStack style={err === -2 ? styles.d_flex : styles.d_none} space={8} py={4} px={4}>
                    <Center>
                        {
                            lib.upgrade_image()
                        }
                    </Center>
                    <Center>
                        <Text fontSize={"lg"}>Oops! Pemakaian melebihi batas, tingkatkan produktivitas anda dengan upgrade membership anda</Text>
                    </Center>
                    <Box style={{display: 'flex', alignItems: 'center', marginTop: 30}}>
                        <Button w='50%' size={"lg"} p={5} bgColor={lib.new_color_orange} onPress={() => { toMShip(); }} rounded={"sm"}>
                            <Text fontSize={'md'} color={'#FFFFFF'} fontWeight={'bold'}>
                                Upgrade Membership
                            </Text>
                        </Button>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
