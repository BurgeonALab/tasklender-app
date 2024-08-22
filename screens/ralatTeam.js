import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Alert, Icon, Center, Circle, Pressable as NBPressable, Skeleton, useDisclose, Modal } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function RalatTeamScreen({ navigation, route }){
    const id = route.params.id;
    const [err, setErr] = useState(0);
    const [nama, setNama] = useState(route.params.nama);
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
    const responseListener = useRef();
    const [isSync, setIsSync] = useState(false);
    const [showModalSync, setShowModalSync] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const group_icon = lib.group_icon();

    const editTeam = () => {
        setErr(0);
        setIsSave(true);

        if(nama === "" || lpst.length === 0){
            setErr(-1);
            setIsSave(false);
        }

        else{
            lib.updTeam(id, nama, email, lpst).then((json) => {
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
    
    const syncContact = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync();
            if (data.length > 0) {
                setIsSync(true);
                lib.syncContact(email, data).then(() => {
                    setIsSync(false);
                    Toast.show({
                        render: () => {
                            return <Box bgColor={lib.success_color} px="2" py="1" rounded="lg" mb={5}>
                                Sinkronisasi kontak berhasil
                            </Box>;
                        },
                    placement: "bottom"
                })
            });
        }}}

    const getData = async() => {
        const email = await lib.getUserID();
        const data = await lib.getDataTeam(id);
        
        setEmail(email);
        setLctc(data.lctc);
        setLmctc(data.lctc);
        setLpst(data.lmmbr);
        
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

    const nav_goBack = () => {
        route.params.onGoBack();
        navigation.goBack();
    }

    useEffect(() => {
        setIsLoad(true);
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "RalatTeam", "");
        });
    
        return () => {
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    return (
        <NativeBaseProvider>
            <ScrollView _contentContainerStyle={{ flexGrow: 1 }}>
                <Header
                    navigation={navigation}
                    route={route}
                    show_icon={"N"}
                    show_text={"Y"}
                    header={
                        <Box>
                            <Text fontWeight={'light'} fontSize={20}>Edit Tim</Text>
                        </Box>
                    }
                    bgcolor={styles.bg_transparent}
                    txtcolor={styles.txt_black}
                    show_back_arrow={"Y"}
                />
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none} py={'30px'} px={'30px'}>
                    <Box w="100%" style={{display: 'flex', flexDirection: 'row'}}>
                        <Box w="80%">
                            <Input
                                InputLeftElement={
                                    <Icon
                                        as={group_icon}
                                        size="6"
                                        color='#1CA3FF'
                                        ml={4}
                                    />
                                }
                                _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                variant="unstyled"
                                bg='rgba(28, 163, 255, 0.3)'
                                placeholderTextColor='#1CA3FF'
                                w="100%"
                                h={"50"}
                                size="lg"
                                placeholder={nama}
                                onChangeText={(val) => setNama(val)}
                                borderColor={parseInt(err) === -1 ? lib.danger_color : lib.main_color}
                                value={nama}>
                            </Input>
                        </Box>
                        <Box w="20%">
                            <NBPressable onPress={() => { setShowModalSync(true) }} key={1} isLoad={isSync} isDisabled={isSync} style={{display: 'flex', alignItems: 'flex-end'}}>
                                {({ isPressed }) => {
                                    return (
                                        <HStack w={'50px'} h={'50px'} bgColor={'rgba(28, 163, 255, 0.3)'} rounded={"sm"} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }], display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Center>
                                                {
                                                    isSync &&
                                                    <Spinner size="lg" /> ||
                                                    !isSync &&
                                                    <Icon as={lib.sync_icon()} color={'#1CA3FF'} size={7} />
                                                }
                                            </Center>
                                        </HStack>
                                    )
                                }}
                            </NBPressable>
                        </Box>
                    </Box>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Team wajib diisi</Text>

                    <VStack my={5}>
                        <Text fontSize={20} color={styles.txt_black} fontWeight={"bold"}>Anggota Tim</Text>
                        <Text fontSize={16} color={styles.txt_black} fontWeight={"normal"}>Peserta: {lpst.length} orang</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Team wajib diisi</Text>
                        <ScrollView>
                            <HStack>
                                {
                                    lpst.map((data) => {
                                        return (
                                            <VStack key={data[3]}>
                                                <NBPressable
                                                    bgColor={"white"}
                                                    rounded="full"
                                                    zIndex={1}
                                                    variant="solid"
                                                    alignSelf="flex-end"
                                                    onPress={() => { removeSCtc(data[0], data[3]) }}><Icon as={lib.minus_circle_icon()}
                                                    size={6}
                                                    color={lib.danger_color}
                                                />
                                                </NBPressable>
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
                    <VStack>
                        <Box>
                            <Input
                                InputLeftElement=
                                {
                                    isSearch ? <Spinner size={"sm"}/>
                                :
                                    <Icon as={lib.search_icon()
                                }
                                    size="6"
                                    ml={4}
                                    color='#1CA3FF'
                                    />
                                }
                                _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                variant="unstyled"
                                w="100%"
                                bg='rgba(28, 163, 255, 0.3)'
                                placeholder="Cari Kontak"
                                placeholderTextColor='#1CA3FF'
                                onChangeText={(val) => { schCtc(val); }}
                                h={"60"}
                                size="lg"
                                >
                            </Input>
                        </Box>
                        {
                            isLoad &&
                            <ScrollView>
                                <VStack>
                                    {
                                        arrLoad.map((index) => {
                                            return (
                                                <HStack key={index} mt='20px'>
                                                    <Box w="12%">
                                                        <Skeleton size={"10"} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    </Box>
                                                    <VStack justifyContent={"center"} space={1} w="70%">
                                                        <Skeleton h={4} w="60%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                        <Skeleton h={3} w="60%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })
                                    }
                                </VStack>
                            </ScrollView> || 
                            !isLoad &&
                            <ScrollView py={2}>
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
                            </ScrollView>
                        }
                    </VStack>

                    <Box mt={'50px'} style={{flexDirection: 'row', alignSelf: "center"}}>
                        <Button style={styles.tsk_btn_main} fontWeight='bold' w='50%' size="lg" p={5} isLoading={isSave} onPress={editTeam}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>Edit Team</Text>
                        </Button>
                    </Box>
                </VStack>
                <VStack style={err === -2 ? styles.d_flex : styles.d_none} space={8} py={4} px={4}>
                    <Center>
                        {
                            lib.error_400()
                        }
                    </Center>
                    
                    <Box>
                        <Button size={"lg"} p={3} bgColor={lib.main_color} onPress={() => { nav_goBack(); }} rounded={"xl"}>Kembali</Button>
                    </Box>
                </VStack>
                <Box>
                    <Modal isOpen={showModalSync} onClose={() => setShowModalSync(false)} size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton />
                            <Modal.Header>Sinkronisasi Kontak</Modal.Header>
                            <Modal.Body>
                            <Alert w="100%" status={"warning"} mb={1}>
                                <HStack space={2} flexShrink={1} px={1}>
                                <Alert.Icon mt="1" />
                                <Text fontSize="md" color="coolGray.800">
                                    Anda yakin kinkronisasi kontak ?
                                </Text>
                                </HStack>
                            </Alert>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModalSync(false) }}>Batal</Button>
                                <Button onPress={() => { setShowModalSync(false), onClose(), syncContact() }}>Ya</Button>
                            </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
}
