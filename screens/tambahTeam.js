import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Icon, Center, Circle, Modal, Pressable as NBPressable, Skeleton, Alert, useDisclose } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';

export default function TambahTeamScreen({ navigation, route }){
    const [err, setErr] = useState(0);
    const [nama, setNama] = useState("");
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
    const [isSync, setIsSync] = useState(false);
    const [showModalSync, setShowModalSync] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const responseListener = useRef();
    const group_icon = lib.group_icon();

    const addTeam = () => {
        setErr(0);
        setIsSave(true);

        if(nama === "" || lpst.length === 0){
            setErr(-1);
            setIsSave(false);
        }
        else{
            lib.newTeam(nama, email, lpst).then((json) => {
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
        const data = await lib.getAllCtc(email);
        
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

    const toMShip = () => {
        navigation.navigate('membership');
    }

    useEffect(() => {
        setIsLoad(true);
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "Team", "");
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
                    show_text={"Y"}
                    header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>Tambah Tim</Text>
                    </Box>
                    }
                    bgcolor={styles.bg_transparent}
                    txtcolor={styles.txt_black}
                    show_back_arrow={"Y"}
                />
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none} py={'30px'} px={'30px'}>
                    <Box>
                        <Input
                            InputLeftElement={
                                <Icon
                                    as={group_icon}
                                    size="6"
                                    marginLeft={'4'}
                                    color='#1CA3FF'
                                />
                            }
                            _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                            variant="unstyled"
                            w="100%"
                            bg='rgba(28, 163, 255, 0.3)'
                            placeholderTextColor='#1CA3FF'
                            placeholder="Nama Tim"
                            h={"60"}
                            size="lg"
                            onChangeText={(val) => setNama(val)}
                            borderColor={parseInt(err) === -1 ? lib.danger_color : lib.main_color}
                        >
                        </Input>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Team wajib diisi</Text>
                    </Box>

                    <VStack py={5}>
                        <Text fontSize={20} style={styles.txt_black} fontWeight={"bold"}>
                            Kontak yang Diundang
                        </Text>
                        <Text fontSize={16}>Peserta: {lpst.length} orang</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Belum ada kontak yang di tambahkan di team</Text>
                        <ScrollView>
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
                    <VStack>
                        <Text color={'#000000'} fontSize={20} fontWeight={"bold"}>
                            Daftar Kontak
                        </Text>
                        <Text fontSize={16} pb={5}>({lib.numberFormat(lctc.length)} orang)</Text>
                        <Box w="100%" style={{display: 'flex', flexDirection: 'row'}}>
                            <Box w="80%">
                                <Input
                                    InputLeftElement={isSearch ? <Spinner size={"sm"}/> : <Icon as={lib.search_icon()}
                                    size={18}
                                    color='#1CA3FF'
                                    ml={4}/>}
                                    _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                    variant="unstyled"
                                    w="100%"
                                    bg='rgba(28, 163, 255, 0.3)'
                                    placeholderTextColor='#1CA3FF'
                                    placeholder="Cari Kontak"
                                    h={"50"}
                                    size="lg"
                                    onChangeText={(val) => { schCtc(val); }}>
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
                        {
                            isLoad &&
                            <ScrollView>
                                <VStack my={'20px'}>
                                    {
                                        arrLoad.map((index) => {
                                            return (
                                                <HStack key={index} w='100%' mb="20px">
                                                    <Box w='15%'>
                                                        <Skeleton size={"10"} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    </Box>
                                                    <VStack justifyContent={"center"} space={2} w="85%">
                                                        <Skeleton h={4} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                        <Skeleton h={4} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })
                                    }
                                </VStack>
                            </ScrollView> || 
                            !isLoad && lctc.length > 0 &&
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
                            </ScrollView> ||
                            !isLoad &&
                            <HStack w="90%" mx="auto" borderRadius={10} pl={2}>
                            <Center w="50%">
                                {
                                lib.no_team_image()
                                }
                            </Center>
                            <Box w="50%" justifyContent={"center"}>
                                <Text fontSize="md" fontWeight={'bold'} color={lib.main_color}>Wah, belum ada kontak</Text>
                                <Text fontSize="sm" fontWeight={'normal'} color={lib.muted_color}>Yuk, sinkronisasi kontakmu dulu</Text>
                            </Box>
                            </HStack>
                        }
                    </VStack>

                    <Box mt={'50px'} style={{flexDirection: 'row', alignSelf: "center"}}>
                        <Button style={styles.tsk_btn_main} fontWeight='bold' w='50%' size="lg" p={5} isLoading={isSave} onPress={addTeam}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>Tambah Tim</Text>
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
                    
                    <Box>
                        <Button size={"lg"} p={3} bgColor={lib.main_color} onPress={() => { toMShip(); }} rounded={"xl"}>Upgrade Membership</Button>
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
