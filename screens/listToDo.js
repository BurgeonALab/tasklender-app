import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, Center, VStack, Box, Text, Button, ScrollView, HStack, Pressable as NBPressable, Actionsheet, useDisclose, Modal, Alert, Icon, Skeleton, Spinner, Input } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function ListToDoScreen({ navigation, route }) {
    const lib = new cFunc();
    const pyk = route.params.pyk;
    const krj = route.params.krj;
    const nmPrj = route.params.nmPrj;
    const nmKrj = route.params.nmKrj;
    const remail = route.params.remail;
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
    const [email, setEmail] = useState("");
    const [lltd, setLTD] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [showModal, setShowModal] = useState(false);
    const [idLTD, setIdLTD] = useState("");
    const [nmLTD, setNmLTD] = useState("");
    const [bgLTD, setBgLTD] = useState("");
    const [txtLTD, setTxtLTD] = useState("");
    const [tgJwbLTD, setTgJwb] = useState("");
    const [deadlineLTD, setDeadline] = useState("");
    const [notifLTD, setNotif] = useState("");
    const [flmt, setFlmt] = useState(0);
    const [tlmt, setTlmt] = useState(15);
    const [filter, setFilter] = useState("A");
    const [cltd, setCLtd] = useState(15);
    const [isAppend, setIsAppend] = useState(false);
    const [cnotif, setCNotif] = useState(0);
    const [vsearch, setVSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const responseListener = useRef();
    const add_icon = lib.add_icon();
    const filter_icon = lib.filter_icon();
    const edit_icon = lib.edit_icon();
    const trash_icon = lib.trash_icon();
    const down_icon = lib.down_icon();

    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = React.useCallback(async () => {
        setIsLoad(true);
        setFlmt(0);
        setTlmt(15);
        setCLtd(15);
        getLTD();
    }, []);

    const toAddLTD = () => {
        navigation.navigate('tambahListToDo', {
            krj: krj,
            pyk: pyk,
            nmKrj: nmKrj,
            onGoBack: () => refresh(),
        });
    }

    const toEditLTD = (nama, bgcolor, txtcolor, deadline, tgjwb, notif) => {
        navigation.navigate('ralatListToDo', {
            id: idLTD,
            krj: krj,
            pyk: pyk,
            nama: nama,
            bgcolor: bgcolor,
            txtcolor: txtcolor,
            tgjwb: tgjwb,
            deadline: deadline,
            notif: notif,
            onGoBack: () => refresh(),
        });
    }

    const delLTD = () => {
        lib.delLTD(idLTD).then(() => {
            refresh();
        })
    }

    const toCmd = (id, tgjwb, created, stat, nama) => {
        navigation.navigate('comment', {
            ltd: id,
            tgjwb: tgjwb,
            created: created,
            stat: stat,
            namaLTD: nama,
            nmPrj: nmPrj,
            remail: remail,
            //onGoBack: () => refresh(),
        });
    };

    const listToDo_template = (nama, bgcolor, txtcolor, id, created, tgjwb, deadline, ntgjwb, ndeadline, notif, stat) => {
        return (
            <NBPressable mb={5} onPress={() => { toCmd(id, tgjwb, created, stat, nama, remail) }} key={id}>
                {({ isPressed }) => {
                    return (
                        <VStack w="100%" mx="auto" bgColor={'rgba(28, 163, 255, 0.3)'} rounded={'sm'} mb={'20px'} p={30} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}>
                            <HStack>
                                <Box style={{position: 'absolute', width: 45, height: 70, zIndex: 9999}} bgColor={bgcolor} top={0} right={0} marginTop={'-50px'} shadow={3}></Box>
                                <Box w="100%" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Box justifyContent={"center"}>
                                        <Text fontSize="16px" color={txtcolor} fontWeight={'bold'}>{nama}</Text>
                                        <Text fontSize="14px" color={txtcolor} fontWeight={'normal'}>{ntgjwb}</Text>
                                    </Box>
                                    <NBPressable
                                        mt='40px'
                                        w="100"
                                        bg={
                                            stat === "PENDING" ? 'rgba(254, 0, 81, 0.3)' :
                                            stat === "PROCESS" ? 'rgba(255, 202, 0, 0.3)' :
                                            'rgba(0, 159, 79, 0.3)'
                                        }
                                        rounded={"sm"}
                                        style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                    >
                                        <Text
                                            fontSize="11px"
                                            fontWeight={'bold'}
                                            color=
                                            {
                                                stat === "PENDING" ? lib.new_color_red :
                                                stat === "PROCESS" ? lib.new_color_yellow :
                                                lib.new_color_green
                                            }
                                        >
                                            {stat}
                                        </Text>
                                        <Icon
                                            as={down_icon}
                                            size="6"
                                            color=
                                            {
                                                stat === "PENDING" ? lib.new_color_red :
                                                stat === "PROCESS" ? lib.new_color_yellow :
                                                lib.new_color_green
                                            }
                                            ml={0.5}
                                            
                                        />
                                    </NBPressable>
                                </Box>
                            </HStack>
                            <Box bg={'rgba(255, 153, 0, 0.3)'} style={{width: 100}} rounded='sm'>
                                <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'rgba(255, 153, 0, 1)', fontSize: 11}}>
                                    {
                                        notif = 0 ? <Text>Selalu</Text> :
                                        notif = 1 ? <Text>Setiap 3 hari</Text> :
                                        notif = 2 ? <Text>Setiap 7 hari</Text> :
                                        notif = 3 ? <Text>Setiap 14 hari</Text> :
                                        <Text>Setiap 30 hari</Text> 
                                    }
                                </Text>
                            </Box>
                            <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <Box bg={'rgba(254, 0, 81, 0.3)'} style={{width: 140}} rounded='sm'>
                                <Text
                                    color='rgba(254, 0, 81, 1)'
                                    style={{fontSize: 11}}
                                    fontWeight={'normal'}
                                    textAlign={'center'}
                                >
                                    Due Date:
                                    <Text fontWeight={'bold'}> {ndeadline}</Text>
                                </Text>
                            </Box>
                                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <Button
                                        height={'40px'}
                                        width={'40px'}
                                        style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#1CA3FF', marginRight: 8}}
                                        onPress={() => { toEditLTD(nama, bgcolor, txtcolor, deadline, tgjwb, notif) }}
                                    >
                                        <Icon
                                            as={edit_icon}
                                            size="6"
                                            color='#1CA3FF'
                                        />
                                    </Button>
                                    <Button
                                        height={'40px'}
                                        width={'40px'}
                                        style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#EF0057', marginRight: 8}}
                                        onPress={() => { setShowModal(true) }}
                                    >
                                        <Icon
                                            as={trash_icon}
                                            size="6"
                                            color='#EF0057'
                                        />
                                    </Button>
                                </Box>
                            </Box>
                        </VStack>
                    )
                }}
            </NBPressable>
        )
    }

    const getLTD = async () => {
        const email = await lib.getUserID();
        const data = await lib.getAllLTD(krj, email, flmt, tlmt, filter, "");
        const notif = await lib.getCNotif(email);

        setCNotif(notif.data.length + notif.dgroup.length);
        setCLtd(data.count[0]);
        setLTD(data.data);
        setEmail(email);
        setVSearch("");
        setIsLoad(false);
    }

    const filterLTD = async (stat) => {
        setIsLoad(true);
        setFilter(stat);
        setFlmt(0);
        setTlmt(15);

        const data = await lib.getAllLTD(krj, email, flmt, tlmt, stat, "");
        setCLtd(data.count[0]);
        setLTD(data.data);
        setVSearch("");
        setIsLoad(false);
    }

    const appendLTD = async () => {
        setIsAppend(true);
        if (tlmt < cltd) {
            const data = await lib.getAllLTD(krj, email, flmt + 15, tlmt + 15, filter, vsearch);
            setFlmt(flmt + 15);
            setTlmt(tlmt + 15);
            setLTD([...lltd, ...data.data]);
            setIsAppend(false);
        }
        else {
            setIsAppend(false);
        }
    }

    const schLTD = async (val) => {
        setIsSearch(true);
        setIsLoad(true);
        setFlmt(0);
        setTlmt(15);

        const data = await lib.getAllLTD(krj, email, flmt, tlmt, filter, val);
        setCLtd(data.count[0]);
        setLTD(data.data);
        setVSearch(val);
        setIsLoad(false);
        setIsSearch(false);
    }

    useEffect(() => {
        setIsLoad(true);
        getLTD();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "ListToDo", krj);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <NativeBaseProvider>
            <Header
                navigation={navigation}
                route={route}
                show_text={"Y"}
                header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>{nmKrj}</Text>
                        <Text fontWeight={'bold'} fontSize={20}>{nmPrj}</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
            />
            <VStack paddingLeft={'30px'} paddingRight={'30px'} marginTop={'20px'}>
                <Text color={styles.txt_black} fontSize={"20px"} fontWeight={"bold"}>Daftar Kegiatan</Text>
            </VStack>
            <VStack style={{display:'flex', flexDirection: 'row'}} paddingLeft={'30px'} paddingRight={'30px'} py={5}>
            <Box w={'60%'}>
                <Input
                    InputLeftElement={ isSearch ? <Spinner size={"sm"} /> : <Icon as={lib.search_icon()}
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
                    placeholder="Cari Kegiatan"
                    fontSize={"md"}
                    onChangeText={(val) => { schLTD(val); }}>
                </Input>
            </Box>
            <Box w={'20%'} style={{display: 'flex', alignItems: 'flex-end'}}>
                <Button
                    style={{width: 50, height: 50}}
                    rounded={'sm'}
                    bg='rgba(28, 163, 255, 0.3)'
                    onPress={() => { toAddLTD(nmKrj) }}
                >
                    <Icon
                    as={add_icon}
                    size="6"
                    color='#1CA3FF'
                    />
                </Button>
            </Box>
            <Box w={'20%'} style={{display: 'flex', alignItems: 'flex-end'}}>
            <Button style={{width: 50, height: 50}} rounded={'sm'} bg='rgba(28, 163, 255, 0.3)'>
                <Icon
                as={filter_icon}
                size="6"
                color='#1CA3FF'
                />
            </Button>
            </Box>
            </VStack>
            {/* BUTTON FILTER */}
            <HStack px='30px' mb='20px'>
                <ScrollView horizontal={true}>
                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("A"); }}>
                        <Box rounded={'sm'} borderWidth={1} borderColor={lib.new_color_purple} bgColor={filter === "A" ? lib.new_color_purple : lib.transparent_color} px={5} h={8} display={'flex'} justifyContent={'center'} mr='10px'>
                            <Text color={filter === "A" ? lib.white_color : lib.new_color_purple}>All</Text>
                        </Box>
                    </NPressable>
                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("SELESAI"); }}>
                        <Box rounded={'sm'} borderWidth={1} borderColor={lib.new_color_green} bgColor={filter === "SELESAI" ? lib.new_color_green : lib.transparent_color} px={5} h={8} display={'flex'} justifyContent={'center'} mr='10px'>
                            <Text color={filter === "SELESAI" ? lib.white_color : lib.new_color_green}>Selesai</Text>
                        </Box>
                    </NPressable>
                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("PROCESS"); }}>
                        <Box rounded={'sm'} borderWidth={1} borderColor={lib.new_color_orange} px={5} h={8} display={'flex'} justifyContent={'center'} bgColor={filter === "PROCESS" ? lib.new_color_orange : lib.transparent_color} mr='10px'>
                            <Text color={filter === "PROCESS" ? lib.white_color : lib.new_color_orange}>Process</Text>
                        </Box>
                    </NPressable>
                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("PENDING"); }}>
                        <Box rounded={'sm'} borderWidth={1} borderColor={lib.new_color_red} px={5} h={8} display={'flex'} bgColor={filter === "PENDING" ? lib.new_color_red : lib.transparent_color}  justifyContent={'center'} >
                            <Text color={filter === "PENDING" ? lib.white_color : lib.new_color_red}>Pending</Text>
                        </Box>
                    </NPressable>
                </ScrollView>
            </HStack>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            } _contentContainerStyle={{ flexGrow: 1 }} onScroll={({ nativeEvent }) => { if (lib.isCloseToBottom(nativeEvent)) { appendLTD() } }}>
                <VStack px={'30px'} mt={5}>
                    <VStack style={isLoad ? styles.d_none : styles.d_flex}>
                        {
                            lltd.length == 0 ?
                                (
                                    <HStack w="100%" px={'30px'}>
                                        <Center w="30%">
                                            {
                                                lib.no_listToDo_image()
                                            }
                                        </Center>
                                        <Box w="70%" paddingLeft={'15px'} justifyContent={"center"}>
                                            <Text fontSize="sm" fontWeight={'bold'} color={lib.main_color}>Wah, belum ada list to do</Text>
                                            <Text fontSize="sm" fontWeight={'normal'} color={lib.muted_color}>Yuk, mulai kelola daftar kerjaan dengan cara simpel</Text>
                                        </Box>
                                    </HStack>
                                )
                                :
                                lltd.map((data) => {
                                    return listToDo_template(data[2], data[3], data[4], data[0], data[8], data[5], data[6], data[9], data[10], data[11], data[12]);
                                })
                        }
                    </VStack>
                    <VStack style={!isLoad ? styles.d_none : styles.d_flex} space={4} px='30px'>
                        {
                            arrLoad.map((key) => {
                                return (
                                    <VStack w="100%" mx="auto" key={key} space={4}>
                                        <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} />

                                        <Box alignItems={"flex-end"}>
                                            <Skeleton h={4} mx={4} w={"30%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} mb='20px' rounded={"lg"} />
                                        </Box>
                                    </VStack>
                                )
                            })
                        }
                    </VStack>
                    <Box>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                            <Modal.Content maxWidth="350">
                                <Modal.CloseButton />
                                <Modal.Header>Hapus List To Do</Modal.Header>
                                <Modal.Body>
                                    <Alert w="100%" status={"warning"} mb={1}>
                                        <HStack space={2} flexShrink={1} px={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                Anda yakin hapus List To Do ?
                                            </Text>
                                        </HStack>
                                    </Alert>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                                        <Button onPress={() => { setShowModal(false), onClose(), delLTD() }}>Ya</Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                    </Box>
                </VStack>
            </ScrollView>
            {
                isAppend &&
                <Center py={2}>
                    <Spinner size="sm" />
                </Center>
            }
        </NativeBaseProvider>
    );
}
