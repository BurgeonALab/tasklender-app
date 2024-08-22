import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Icon, Center, Circle, Pressable as NBPressable, Skeleton, Toast } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import styles from '../constants/index';

export default function TambahContactProyekScreen({ navigation, route }){
    const [err, setErr] = useState(0);
    const id = route.params.id;
    const nama = route.params.nama;
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const lcolor = lib.list_color_hex_simple();
    const [email, setEmail] = useState();
    const [lpst, setLpst] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(7));
    const [lctc, setLctc] = useState([]);
    const [lmctc, setLmctc] = useState([]);
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const invCtcPyk = () => {
        setErr(0);
        setIsSave(true);
        
        lib.invCtc(id, lpst).then((json) => {
            Toast.show({
                render: () => {
                    return <Box bgColor={lib.success_color} px="2" py="1" rounded="lg" mb={5}>
                        Kontak berhasil di undang
                    </Box>;
                },
                placement: "bottom"
            });
            
            setIsSave(false);
            getData();
            setLpst([]);
        })
    }

    const getData = async() => {
        const email = await lib.getUserID();
        const data = await lib.getAllCtc(email);
        const notif = await lib.getCNotif(email);

        setCNotif(notif.data.length + notif.dgroup.length);
        setEmail(email);
        setLctc(data.data);
        setLmctc(data.data);
        
        setIsLoad(false);
    }

    const selectCtc = (id, nama, color, midx) => {
        var cek = false;
        for(var i = 0; i < lpst.length; i++){
            if(id === lpst[i][0]){
                removeSCtc(id, midx);
                cek = true;
                break;
            }
        }
        
        if(!cek){
            var nctc = [id, nama, color, midx], linitial = nama.split(" "), initial = "", arr_lmctc = lmctc, fidx = lctc.findIndex(data => data[6] === midx);
    
            for(var i = 0; i < linitial.length; i++){
                initial += linitial[i][0];
            }
    
            nctc.push(initial);
            
            setLpst([...lpst, nctc]);

            arr_lmctc[midx][5] = true;
            setLmctc(arr_lmctc);
            
            if(fidx !== -1){
                var arr_lctc = lctc;
                arr_lctc[fidx][5] = true;

                setLctc(arr_lctc);
            }
        }
    }

    const removeSCtc = (id, midx) => {
        var arr_lmctc = lmctc, fidx = lctc.findIndex(data => data[6] === midx);
        setLpst(lpst.filter(data => data[0] !== id));
        
        arr_lmctc[midx][5] = false;
        setLmctc(arr_lmctc);
        
        if(fidx !== -1){
            var arr_lctc = lctc;
            arr_lctc[fidx][5] = false;

            setLctc(arr_lctc);
        }
    }

    const schCtc = (val) => {
        setIsSearch(true);
        setLctc(lmctc.filter(data => data[1].toLowerCase().indexOf(val.toLowerCase()) >= 0 || data[2].toLowerCase().indexOf(val.toLowerCase()) >= 0 || data[3].toLowerCase().indexOf(val.toLowerCase()) >= 0));
        setIsSearch(false);
    }

    useEffect(() => {
        setIsLoad(true);
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "TambahContactProyek", "");
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
                      <Text fontWeight={'light'} fontSize={20}>{nama}</Text>
                      <Text fontWeight={'bold'} fontSize={20}>Undang Kontak</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <VStack>
                {
                    lpst.length > 0 &&
                    <VStack>
                        <ScrollView horizontal={true}>
                            <HStack>
                                {
                                    lpst.map((data) => {
                                        return (
                                            <VStack key={data[3]}>
                                                <NBPressable bgColor={"white"} rounded="full" mb={-3} zIndex={1} variant="solid" alignSelf="flex-end" onPress={() => { removeSCtc(data[0], data[3]) }}><Icon as={lib.minus_circle_icon()} size={6} color={lib.danger_color} /></NBPressable>
                                                <Circle size={"sm"} bgColor={data[2]}>
                                                    <Text fontSize={"lg"} fontWeight={"bold"}>{data[4]}</Text>
                                                </Circle>
                                                <Box>
                                                    <Text fontSize={"xs"}>{data[1].length > 8 ? data[1].substring(0,8)+"..." : data[1]}</Text>
                                                </Box>
                                            </VStack>
                                        )
                                    })
                                }
                            </HStack>
                        </ScrollView>
                    </VStack>
                }

                <VStack px={'30px'} py={'30px'}>
                    <Text color={'#000000'} fontSize={'xl'} mb={3} fontWeight={"light"}>Daftar Kontak ({lib.numberFormat(lctc.length)} orang)</Text>
                    <Box mb={3}>
                        <Input
                            InputLeftElement={
                                isSearch ? <Spinner size={"sm"}/> :
                                <Icon as={lib.search_icon()} size="6" color='#1CA3FF' marginLeft={'4'}/>
                                }
                                w="100%"
                                placeholder="Cari Kontak"
                                fontSize={"md"}
                                _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                variant="unstyled"
                                bg='rgba(28, 163, 255, 0.3)'
                                placeholderTextColor='#1CA3FF'
                                h={"60"}
                                size="lg"
                                onChangeText={(val) => { schCtc(val); }}>
                        </Input>
                    </Box>
                    {
                        isLoad &&
                        <ScrollView>
                            <VStack>
                                {
                                    arrLoad.map((index) => {
                                        return (
                                            <HStack key={index} w='100%' mt={'10px'} mb={'10px'}>
                                                <Box w="15%">
                                                    <Skeleton size={"10"} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                </Box>
                                                <VStack justifyContent={"center"} space={1} w="85%">
                                                    <Skeleton h={4} w="100%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    <Skeleton h={3} w="70%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                </VStack>
                                            </HStack>
                                        )
                                    })
                                }
                            </VStack>
                        </ScrollView> || 
                        !isLoad && lctc.length > 0 &&
                        <ScrollView py={2} h={lpst.length > 0 ? "66%" : "79%"}>
                            <VStack space={4}>
                            {
                                lctc.map((data) => {
                                    return (
                                        <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { selectCtc(data[0], data[1], lcolor[data[4]], data[6]) }} key={data[6]}>
                                            <HStack space={4}>
                                                <HStack w={8}>
                                                    <Circle size={"xs"} bgColor={lcolor[data[4]]}>
                                                        <Text fontSize={"md"} fontWeight={"bold"}>{data[3]}</Text>
                                                    </Circle>
                                                    {
                                                        data[5] &&
                                                        <NBPressable bgColor={lib.white_color} borderWidth={1} borderColor={lib.white_color} rounded="full" zIndex={1} variant="solid" alignSelf="flex-end" onPress={() => { removeSCtc(data[0]) }} mt={-5} ml={-4}><Icon as={lib.check_circle_icon()} size={4} color={lib.success_color} bgColor={lib.white_color} rounded={"full"} /></NBPressable>
                                                    }
                                                </HStack>
                                                <VStack justifyContent={"center"}>
                                                    <Text fontSize={"md"} fontWeight={"medium"}>{data[1]}</Text>
                                                    <Text fontSize={"xs"} color={lib.muted_color}>{data[2]}</Text>
                                                </VStack>
                                            </HStack>
                                        </NPressable>
                                    )
                                })
                            }
                            </VStack>
                        </ScrollView> ||
                        !isLoad &&
                        <HStack w="100%" mx="auto" rounded={'sm'}>
                          <Center w="50%">
                            {
                              lib.no_team_image()
                            }
                          </Center>
                          <Box w="50%" justifyContent={"center"}>
                            <Text fontSize="lg" fontWeight={'bold'} color={lib.main_color}>Wah, belum ada kontak</Text>
                            <Text fontSize="sm" fontWeight={'light'} color={lib.muted_color}>Yuk, sinkronisasi kontakmu dulu</Text>
                          </Box>
                        </HStack>
                    }
                </VStack>
                {
                    !isLoad && lmctc.length > 0 &&
                    <Box mt={-1}>
                        <Button bgColor={"primary.600"} size="lg" p={3} isLoading={isSave} onPress={invCtcPyk}>Undang</Button>
                    </Box>
                }
            </VStack>
        </NativeBaseProvider>
    );
}
