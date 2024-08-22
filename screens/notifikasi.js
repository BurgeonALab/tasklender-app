import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, Pressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Badge, ScrollView, HStack, useDisclose, Icon, Skeleton } from 'native-base';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import styles from '../constants/index';

export default function Notifikasi({ navigation, route }) {
    const lib = new cFunc();
    const [email, setEmail] = useState("");
    const [lntf, setLntf] = useState([]);
    const [linv, setLinv] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(7));
    const { isOpen, onOpen, onClose } = useDisclose();
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState("N");
    const [cnotif, setCNotif] = useState(0);
    const responseListener = useRef();

    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = React.useCallback(async () => {
        setIsLoad(true);
        getNtf();
    }, []);


    const getNtf = async () => {
        const email = await lib.getUserID();
        const data = await lib.getAllNotif(email);
        setEmail(email);
        
        setLntf(data.data);
        setLinv(data.dgroup);
        setCNotif(data.udata.length);
        setIsLoad(false);

        setTimeout(() => {
            updRNtf(data.data);
        }, 2000);
    }

    const updRNtf = async (data) => {
        lib.updReadNotif(data);
    }

    const toLTD = (id, pyk) =>{
      navigation.navigate('listToDo', {
        krj : id,
        pyk : pyk,
        onGoBack : () => refresh(),
      })
    };

    const toCmd = (id, tgjwb, created, stat, nama) => {
        navigation.navigate('comment', {
            ltd: id,
            tgjwb: tgjwb,
            created: created,
            stat: stat,
            namaLTD: nama,
            onGoBack: () => refresh(),
        });
    };

    const verifInv = async (id, stat) => {
        lib.verifInvPyk(id, email, stat).then((json) =>{
            setIsLoad(true);
            getNtf();
        })
    }

    useEffect(() => {
        setIsLoad(true);
        getNtf();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "Notifikasi", "");
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
                      <Text fontWeight={'light'} fontSize={20}>Notifikasi</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <HStack py={'30px'} px={'30px'}>
                <Box w="50%">
                    <Pressable onPress={() => { setShow("N"); }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
                        <Text fontWeight={show === "N" ? "bold" : "light"} fontSize={20}>
                            Notifikasi
                            {
                                cnotif > 0 ? <Badge rounded={"full"} colorScheme="danger" variant={"solid"}>{lib.numberFormat(cnotif)}</Badge> : null
                            }
                        </Text>
                    </Pressable>
                </Box>
                <Box w="50%">
                    <Pressable onPress={() => { setShow("G"); }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
                        <Text textAlign='right' fontWeight={show === "G" ? "bold" : "light"} fontSize={20}>
                            Undangan
                            {
                                linv.length > 0 ?
                                <Badge rounded={"full"} colorScheme="danger" variant={"solid"}>{lib.numberFormat(linv.length)}</Badge> : null
                            }
                        </Text>
                    </Pressable>
                </Box>
            </HStack>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            } _contentContainerStyle={{ flexGrow: 1 }}>
                {
                    !isLoad && show === "N" &&
                    <VStack space={4}>
                        {
                            lntf.map((data, index) => {
                                if(data[5] !== ""){
                                    return (
                                        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { toCmd(data[5], data[10], data[11], data[12], data[9]) }}>
                                            <VStack w="100%" mx="auto" key={index} p={4} space={1} borderBottomWidth={1} borderColor={lib.muted_color} bgColor={data[6] === "N" ? lib.light_success_color : ""}>
                                                <Box>
                                                    <Text color={lib.muted_color} fontSize={"xs"}>Comment</Text>
                                                </Box>
                                                <Box>
                                                    <Text color={lib.muted_color} fontSize={"md"} fontWeight={"medium"}>{data[2]}</Text>
                                                </Box>
                                                <Box>
                                                    <Text color={lib.muted_color} fontSize={"sm"}>{data[8]}</Text>
                                                </Box>
                                            </VStack>
                                        </Pressable>
                                    )
                                }
                                else if(data[4] !== ""){
                                    return (
                                        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { toLTD(data[4], data[3]) }}>
                                            <VStack w="100%" mx="auto" key={index} p={4} space={1} borderBottomWidth={1} borderColor={lib.muted_color} bgColor={data[6] === "N" ? lib.light_success_color : ""}>
                                                <Box>
                                                    <Text color={lib.muted_color} fontSize={"xs"}>Deadline</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize={"md"} fontWeight={"medium"}>{data[2]}</Text>
                                                </Box>
                                                <Box>
                                                    <Text color={lib.muted_color} fontSize={"sm"}>{data[8]}</Text>
                                                </Box>
                                            </VStack>
                                        </Pressable>
                                    )
                                }
                                else if(data[3] !== ""){
                                    return (
                                        <VStack px={'30px'} bgColor={data[6] === "N" ? lib.light_success_color : ""}>
                                            <Box shadow={3}>
                                                <Box>
                                                    <Text color={styles.txt_black} fontWeight={'bold'} fontSize={"sm"}>Undangan Proyek</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize={"md"} fontWeight={"normal"}>{data[2]}</Text>
                                                </Box>
                                                <Box>
                                                    <Text color={styles.txt_black} fontWeight={'bold'} fontSize={"sm"} mt={3}>{data[8]}</Text>
                                                </Box>
                                            </Box>
                                        </VStack>
                                    )
                                }
                            })
                        }
                    </VStack> || 
                    !isLoad && show === "G" &&
                    <VStack mx={5}>
                        {
                            linv.map((data, index) => {
                                return (
                                    <HStack key={index} p={4}>
                                        <VStack>
                                            <Box>
                                                <Text fontSize={"lg"} fontWeight={"light"}>Undangan Proyek</Text>
                                                <Text fontSize={"lg"} fontWeight={"bold"}>{data[1]}</Text>
                                            </Box>
                                            <Box mt={3}>
                                                <Text>
                                                    <Text fontSize={"xs"}>Diundang oleh </Text>
                                                    <Text fontSize={"xs"} fontWeight={"bold"}>{data[6]}</Text>
                                                </Text>
                                                <Text fontSize={"xs"}>Diundang oleh {data[5]}</Text>
                                            </Box>
                                        </VStack>
                                        <HStack w={"30%"} alignItems={"center"} justifyContent={"flex-end"} space={3}>
                                            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { verifInv(data[0], 'V') }}>
                                                <Icon as={lib.check_circle_icon()} size={28} color={lib.success_color}></Icon>
                                            </Pressable>
                                            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { verifInv(data[0], 'N') }}>
                                                <Icon as={lib.close_icon()} size={33} color={lib.danger_color}></Icon>
                                            </Pressable>
                                        </HStack>
                                    </HStack>
                                )
                            })
                        }
                    </VStack> ||
                    isLoad && show === "N" && 
                    <VStack space={4}>
                        {
                            arrLoad.map((key) => {
                                return (
                                    <VStack w="100%" key={key} p={5} space={2}>
                                        <Skeleton h={2} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} w={"30%"}></Skeleton>
                                        <Skeleton h={3} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} w={"50%"}></Skeleton>
                                        <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} lines={2} w={"90%"} space={1} />
                                    </VStack>
                                )
                            })
                        }
                    </VStack> ||
                    isLoad && show === "G" && 
                    <VStack space={4}>
                        {
                            arrLoad.map((key) => {
                                return (
                                    <HStack w="100%" key={key} p={5}>
                                        <VStack w={"100%"} py={2} px={4} space={2}>
                                            <Skeleton h={2} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} w={"50%"}></Skeleton>
                                            <Skeleton h={3} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} w={"100%"}></Skeleton>
                                            <Skeleton h={3} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} w={"100%"}></Skeleton>
                                        </VStack>
                                        <HStack w={"30%"} alignItems={"center"} justifyContent={"center"} space={2}>
                                            <Skeleton size={8} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                            <Skeleton size={8} rounded={"full"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
                                        </HStack>
                                    </HStack>
                                )
                            })
                        }
                    </VStack>
                }
            </ScrollView>
        </NativeBaseProvider>
    );
}
