import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, Center, VStack, Box, Text, Button, ScrollView, HStack, Input, useDisclose, Modal, Alert, Icon, Skeleton, Toast, Spinner, Actionsheet } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TambahTeamProyekScreen({ navigation, route }) {
    const lib = new cFunc();
    const id = route.params.id;
    const nama = route.params.nama;
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
    const [email, setEmail] = useState("");
    const [lteam, setLteam] = useState([]);
    const [lmteam, setLmteam] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [showModal, setShowModal] = useState(false);
    const [idTeam, setIdTeam] = useState("");
    const [nmTeam, setNmTeam] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = React.useCallback(async () => {
        setIsLoad(true);
        getTeam();
    }, []);

    const invTeamPyk = () => {
        setIsSave(true);
        lib.invTeam(id, idTeam).then((json) => {
            Toast.show({
                render: () => {
                    return <Box bgColor={lib.success_color} px="2" py="1" rounded="lg" mb={5}>
                        Team berhasil di undang
                    </Box>;
                },
                placement: "bottom"
            })

            setIsSave(false);
        })
    }

    const team_template = (nama, id, mmbr) => {
        return (
            <Box key={id} bg='rgba(28, 163, 255, 0.3)' p={7} rounded='sm'>
                <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onLongPress={() => { onOpen(); setIdTeam(id); setNmTeam(nama); }}>
                    <HStack w="100%" mx="auto">
                        <Box w="70%" alignItems={'flex-start'} justifyContent={"center"}>
                            <Text fontSize="lg" fontWeight={'bold'} color={'#000000'}>{nama}</Text>
                            <Text fontSize="md" fontWeight={'light'} color={'#000000'}>{mmbr} Anggota</Text>
                        </Box>
                        <Button w="30%" bg='#1CA3FF' rounded='sm' onPress={() => { setShowModal(true); setIdTeam(id); }}>
                            {
                                idTeam === id && isSave &&
                                <Spinner size={"lg"} /> ||
                                <Text color='#FFFFFF' fontWeight={'bold'}>Undang</Text>
                            }
                        </Button>
                    </HStack>
                </NPressable>
            </Box>
        )
    }

    const toDataTeam = () => {
        navigation.navigate('dataTeam', {
            id: idTeam,
            nama: nmTeam,
            onGoBack: () => refresh(),
        });
    }

    const getTeam = async () => {
        const email = await lib.getUserID();
        const data = await lib.getAllTeam(email);
        const notif = await lib.getCNotif(email);

        setCNotif(notif.data.length + notif.dgroup.length);
        setLteam(data);
        setLmteam(data);
        setEmail(email);
        setIsLoad(false);
    }

    const schTeam = (val) => {
        setIsSearch(true);
        setLteam(lmteam.filter(data => data[1].toLowerCase().indexOf(val.toLowerCase()) >= 0));
        setIsSearch(false);
    }

    useEffect(() => {
        setIsLoad(true);
        getTeam();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "TambahTeamProyek", "");
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
                show_icon={"N"}
                show_text={"Y"}
                header={
                    <Box>
                      <Text fontWeight={'light'} fontSize={20}>{nama}</Text>
                      <Text fontWeight={'bold'} fontSize={20}>Undang Tim</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            } _contentContainerStyle={{ flexGrow: 1 }}>
                <VStack px={'30px'} py={'20px'}>
                <Box>
                    <Input
                        InputLeftElement=
                        {
                            isSearch ? <Spinner size={"sm"} /> :
                            <Icon
                                as={lib.search_icon()}
                                size={'6'}
                                color='#1CA3FF'
                                marginLeft={'4'}
                            />
                        }
                        w="100%"
                        placeholder="Cari Team"
                        h={"60"}
                        size="lg"
                        bg='rgba(28, 163, 255, 0.3)'
                        fontSize={"md"}
                        placeholderTextColor='#1CA3FF'
                        variant="unstyled"
                        _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                        onChangeText={(val) => { schTeam(val); }}>
                    </Input>
                </Box>
                </VStack>
                <VStack px={'30px'}>
                    <VStack style={isLoad ? styles.d_none : styles.d_flex} space={4}>
                        {
                            lteam.length == 0 ?
                                (
                                    <HStack w="90%" mx="auto" borderRadius={10} pl={2}>
                                        <Center w="50%">
                                            {
                                                lib.no_team_image()
                                            }
                                        </Center>
                                        <Box w="50%" justifyContent={"center"}>
                                            <Text fontSize="lg" letterSpacing={"lg"} fontWeight={500} color={lib.main_color}>Wah, belum ada team</Text>
                                            <Text fontSize="sm" letterSpacing={"sm"} fontWeight={500} color={lib.muted_color}>Yuk, mulai kelola team mu untuk proyek mu</Text>
                                        </Box>
                                    </HStack>
                                )
                                :
                                lteam.map((data) => {
                                    return team_template(data[1], data[0], data[2])
                                })
                        }
                    </VStack>
                    <VStack style={!isLoad ? styles.d_none : styles.d_flex} space={4}>
                        {
                            arrLoad.map((key) => {
                                return <Skeleton w="100%" mx="auto" rounded={'sm'} h={"16"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} key={key} />
                            })
                        }
                    </VStack>
                    <Box>
                        <Actionsheet isOpen={isOpen} onClose={onClose}>
                            <Actionsheet.Content>
                                <Actionsheet.Item key="R" startIcon={<Icon as={lib.hpass_icon()} color={"black"} size="md" />} onPress={() => { toDataTeam(); onClose(); }} >Lihat Data Team</Actionsheet.Item>
                            </Actionsheet.Content>
                        </Actionsheet>

                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                            <Modal.Content maxWidth="350">
                                <Modal.CloseButton />
                                <Modal.Header>Undang Team</Modal.Header>
                                <Modal.Body>
                                    <Alert w="100%" status={"warning"} mb={1}>
                                        <HStack space={2} flexShrink={1} px={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                Anda yakin undang Team?
                                            </Text>
                                        </HStack>
                                    </Alert>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                                        <Button onPress={() => { setShowModal(false), onClose(), invTeamPyk() }}>Ya</Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
