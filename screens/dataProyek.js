import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, ScrollView, HStack, Input, Modal, Icon, Center, Circle, Skeleton, Pressable as NBPressable, useDisclose, Alert, Button } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import styles from '../constants/index';
import * as Notifications from 'expo-notifications';

export default function TambahTeamScreen({ navigation, route }) {
    const id = route.params.id;
    const nmPyk = route.params.nmPyk;
    const lib = new CFunc();
    const [email, setEmail] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(7));
    const [lmmbr, setLmmbr] = useState([]);
    const [lmmmbr, setLmmmbr] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [ showModal, setShowModal ] = useState(false);
    const [idPst, setIDPst] = useState("");
    const lcolor = lib.list_color_hex_simple();
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const refresh = React.useCallback(async () => {
      setIsLoad(true);
      getData();
    }, []);

    const getData = async () => {
        const email = await lib.getUserID();
        const data = await lib.getDataPyk(id);
        const notif = await lib.getCNotif(email);
        
        setCNotif(notif.data.length + notif.dgroup.length);
        setEmail(email);
        setLmmbr(data.lmmbr);
        setLmmmbr(data.lmmbr);
        
        setIsLoad(false);
    }

    const schPst = (val) => {
        setIsSearch(true);
        setLmmbr(lmmmbr.filter(data => data[1].toLowerCase().indexOf(val.toLowerCase()) >= 0 || data[2].toLowerCase().indexOf(val.toLowerCase()) >= 0 || data[3].toLowerCase().indexOf(val.toLowerCase()) >= 0));
        setIsSearch(false);
    }

    const toAddTeam = () => {
        navigation.navigate('tambahTeamProyek', {
            id: id,
            nama: nmPyk,
            onGoBack: () => refresh(),
        });
    }

    const toAddCtc = () => {
        navigation.navigate('tambahContactProyek', {
            id: id,
            nama: nmPyk,
            onGoBack: () => refresh(),
        });
    }

    const toInvite = () => {
        navigation.navigate('tambahInviteProyek', {
            id: id,
            nama: nmPyk,
            onGoBack: () => refresh(),
        });
    }

    const delPstPyk = () => {
        lib.delPstPyk(id, idPst).then(() => {
            refresh();
        })
    }

    useEffect(() => {
        setIsLoad(true);
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "Data Proyek", "");
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
                        <Text fontWeight={'light'} fontSize={20}>{nmPyk}</Text>
                        <Text fontWeight={'bold'} fontSize={20}>Anggota Tim</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            {/* DATA PESERTA */}
            <VStack px={'30px'} py={'30px'}>
                <VStack>
                    <Text fontSize={'xl'} mb={3} style={styles.txt_black} fontWeight={"light"}>Daftar Anggota ({lib.numberFormat(lmmbr.length)} orang)</Text>
                    <Box>
                        <Box w='100%'>
                            <Input
                                InputLeftElement={
                                    isSearch ? <Spinner size={"sm"} mx={2} /> :
                                    <Icon
                                        as={lib.search_icon()}
                                        size={18}
                                        color='#1CA3FF'
                                        ml={5}
                                    />
                                }
                                bg='rgba(28, 163, 255, 0.3)'
                                _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                w="100%"
                                variant="unstyled"
                                placeholder="Cari Anggota"
                                placeholderTextColor='#1CA3FF'
                                h='60px'
                                size="lg"
                                fontSize={"md"}
                                onChangeText={(val) => { schPst(val); }}>
                            </Input>
                        </Box>
                    </Box>
                    {
                        isLoad &&
                        <ScrollView py={5}>
                            <VStack space={4}>
                                {
                                    arrLoad.map((index) => {
                                        return (
                                            <HStack key={index}>
                                                <Box w="15%">
                                                    <Skeleton size={"10"} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                </Box>
                                                <VStack justifyContent={"center"} space={1} w="85%">
                                                    <Skeleton h={4} w="100%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                    <Skeleton h={3} w="70%" rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                                </VStack>
                                                <Center>
                                                    <Skeleton h={3} rounded={"full"}></Skeleton>
                                                </Center>
                                            </HStack>
                                        )
                                    })
                                }
                            </VStack>
                        </ScrollView> ||
                        !isLoad && lmmbr.length > 0 &&
                        <ScrollView py={2}>
                            <VStack space={4}>
                                {
                                    lmmbr.map((data) => {
                                        return (
                                            <HStack space={4} key={data[1]} justifyContent={"space-between"}>
                                                <HStack space={4}>
                                                    <Circle size={"xs"} bgColor={lcolor[data[6]]}>
                                                        <Text fontSize={"md"} fontWeight={"bold"}>{data[5]}</Text>
                                                    </Circle>
                                                    <VStack justifyContent={"center"}>
                                                        <HStack space={2}>
                                                            <Box justifyContent={"center"}>
                                                                <Text fontSize={"md"} fontWeight={"medium"}>{data[4]}</Text>
                                                            </Box>
                                                            {
                                                                data[2] === "P" &&
                                                                <Box justifyContent={"center"} bgColor={lib.light_danger_color} rounded={"lg"} px={1}>
                                                                    <Text fontSize={"xs"} fontWeight={"bold"} color={lib.danger_color} textTransform={"uppercase"}>Pending</Text>
                                                                </Box>
                                                            }
                                                        </HStack>
                                                        <Text fontSize={"xs"} color={lib.muted_color}>{data[1]}</Text>
                                                    </VStack>
                                                </HStack>
                                                <Center>
                                                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setShowModal(true); setIDPst(data[1]) }}>
                                                        <Icon as={lib.close_icon()} color={lib.danger_color} size={"lg"}></Icon>
                                                    </NPressable>
                                                </Center>
                                            </HStack>
                                        )
                                    })
                                }
                            </VStack>
                        </ScrollView> ||
                        !isLoad &&
                        <HStack w="100%" rounded={'sm'}>
                            <Center w="50%">
                                {
                                    lib.no_team_image()
                                }
                            </Center>
                            <Box w="50%" justifyContent={"center"}>
                                <Text fontSize="md" fontWeight={'bold'} color={lib.main_color}>Wah, belum ada peserta</Text>
                                <Text fontSize="sm" letterSpacing={"sm"} fontWeight={'light'} color={lib.muted_color}>Yuk, tambah peserta dulu</Text>
                            </Box>
                        </HStack>
                    }
                </VStack>
            </VStack>
            {/* BUTTON TAMBAH PESERTA */}
            <VStack px={'30px'}>
                <Text mb={5} fontSize={'xl'} fontWeight={'light'}>Tambah anggota tim dari</Text>
                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Box mx={3}>
                        <NBPressable onPress={() => { toAddTeam() }} key={1}>
                            {({ isPressed }) => {
                                return (
                                    <HStack p={5} bgColor={"rgba(28, 163, 255, 0.3)"} rounded={"sm"} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }], display: 'flex', flexDirection: 'column' }}>
                                        <Center>
                                            <Icon as={lib.group_icon()} color={'#1CA3FF'} size="xl" />
                                        </Center>
                                        <Box justifyContent={"center"}>
                                            <Text mt={2} fontSize="lg" fontWeight={'bold'} color={"#1CA3FF"}>Team</Text>
                                        </Box>
                                    </HStack>
                                )
                            }}
                        </NBPressable>
                    </Box>
                    <Box mx={3}>
                        <NBPressable onPress={() => { toAddCtc() }} key={1}>
                            {({ isPressed }) => {
                                return (
                                    <HStack p={5} bgColor={"rgba(28, 163, 255, 0.3)"} rounded={"sm"} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }], display: 'flex', flexDirection: 'column' }}>
                                        <Center>
                                            <Icon as={lib.contact_icon()} color={'#1CA3FF'} size="xl" />
                                        </Center>
                                        <Box justifyContent={"center"}>
                                            <Text mt={2} fontSize="lg" fontWeight={'bold'} color={'#1CA3FF'}>Kontak</Text>
                                        </Box>
                                    </HStack>
                                )
                            }}
                        </NBPressable>
                    </Box>
                    <Box mx={3}>
                        <NBPressable onPress={() => { toInvite() }} key={1}>
                            {({ isPressed }) => {
                                return (
                                    <HStack p={5} bgColor={"rgba(28, 163, 255, 0.3)"} rounded={"sm"} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }], display: 'flex', flexDirection: 'column' }}>
                                        <Center>
                                            <Icon as={lib.add_icon()} color={'#1CA3FF'} size="xl" />
                                        </Center>
                                        <Box justifyContent={"center"}>
                                            <Text mt={2} fontSize="lg" fontWeight={'bold'} color={'#1CA3FF'}>Email</Text>
                                        </Box>
                                    </HStack>
                                )
                            }}
                        </NBPressable>
                    </Box>
                </Box>
            </VStack>
            <Box>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton />
                        <Modal.Header>Hapus Peserta</Modal.Header>
                        <Modal.Body>
                            <Alert w="100%" status={"warning"} mb={1}>
                                <HStack space={2} flexShrink={1} px={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                        Anda yakin hapus peserta ?
                                    </Text>
                                </HStack>
                            </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                                <Button onPress={() => { setShowModal(false), onClose(), delPstPyk() }}>Ya</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Box>
        </NativeBaseProvider>
    );
}
