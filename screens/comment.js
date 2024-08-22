import React, { useState, useEffect, useRef } from 'react';
import { RefreshControl, Pressable, Linking } from 'react-native';
import { NativeBaseProvider, Image, Center, Spinner, VStack, Box, Text, Button, HStack, Actionsheet, useDisclose, Modal, Alert, ScrollView, Icon, Skeleton } from 'native-base';
import styles from '../constants/index';
import cfunc from '../constants/clsfunction';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function Comment({ route, navigation }) {
    var mindex = 0;
    const lib = new cfunc();
    const ltd = route.params.ltd;
    const nama = route.params.namaLTD;
    const tgjwb = route.params.tgjwb;
    const nmPrj = route.params.nmPrj;
    const remail = route.params.remail;
    const created = route.params.created;
    const [cstat, setCStat] = useState(route.params.stat);
    const [email, setEmail] = useState("");
    const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
    const [isLoad, setIsLoad] = useState(true);
    const [isLoad2, setIsLoad2] = useState(false);
    const [isLoad3, setIsLoad3] = useState(false);
    const [idCmd, setIdCmd] = useState("");
    const [txtCmd, setTxtCmd] = useState("");
    const [emailCmd, setEmailCmd] = useState("");
    const [lcmd, setLcmd] = useState([]);
    const [limg, setLimg] = useState([]);
    const [ldoc, setLdoc] = useState([]);
    const [type, setType] = useState("");
    const { isOpen, onOpen, onClose } = useDisclose();
    const [showModal, setShowModal] = useState(false);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [viewImage, setViewImage] = useState(false);
    const [imgCmd, setImgCmd] = useState([]);
    const [imgsCmd, setImgsCmd] = useState([]);
    const [vimgsCmd, setVImgsCmd] = useState([]);
    const [docCmd, setDocCmd] = useState(null);
    const [nDocCmd, setNDocCmd] = useState("");
    const [flmt, setFlmt] = useState(0);
    const [tlmt, setTlmt] = useState(15);
    const [ccmd, setCCmd] = useState(15);
    const [isAppend, setIsAppend] = useState(false);
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = React.useCallback(() => {
        setIsLoad(true);
        getCmd();
    }, []);

    const delCmd = () => {
        lib.delCmd(idCmd).then(() => {
            refresh();
        });
    }

    const updStat = () => {
        setIsLoad2(true);
        lib.updCardUser(id).then((val) => {
            setCStat(val);
            setIsLoad2(false);
        });
    }

    const updStat2 = (stat) => {
        setIsLoad3(true);
        lib.updCardUser(id, stat).then((val) => {
            setCStat(val);
            setIsLoad3(false);
        });
    }

    const getCmd = async () => {
        const data = await lib.getAllCmd(ltd);
        const email = await lib.getUserID();
        setImages(data.lvimg);
        setLimg(data.limg);
        setLdoc(data.ldoc);
        setLcmd(data.data);
        setCCmd(data.count[0]);
        setEmail(email);
        setFlmt(0);
        setTlmt(15);
        setIsLoad(false);
    }

    const toReplyComment = () => {
        navigation.navigate("replyComment", {
            id: idCmd,
            ltd: ltd,
            onGoBack: () => refresh(),
        })
    }

    const toAddComment = () => {
        navigation.navigate("tambahComment", {
            ltd: ltd,
            onGoBack: () => refresh(),
        })
    }

    const toEditComment = () => {
        navigation.navigate("ralatComment", {
            id: idCmd,
            ltd: ltd,
            cmd: txtCmd,
            image: imgCmd,
            images: imgsCmd,
            vimages: vimgsCmd,
            doc: docCmd,
            docnm: nDocCmd,
            onGoBack: () => refresh(),
        })
    }
    
    const appendCmd = async () => {
        setIsAppend(true);
        if(tlmt < ccmd){
            const data = await lib.getAllCmd(krj, email, flmt+15, tlmt+15, filter);
            setFlmt(flmt+15);
            setTlmt(tlmt+15);
            setImages([...images, ...data.lvimg]);
            setLimg([...limg, ...data.limg]);
            setLdoc([...ldoc, ...data.ldoc]);
            setLcmd([...lcmd, ...data.data]);
            setIsAppend(false);
        }
        else{
            setIsAppend(false);
        }
    }

    const imageGalleryHeader = () => {
        return (
            <Box alignItems={"flex-end"} py={4} px={2}>
                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setViewImage(false) }}>
                    <Icon as={lib.close_icon()} size={8} color={lib.white_color} />
                </Pressable>
            </Box>
        )
    }

    useEffect(() => {
        setIsLoad(true);
        getCmd();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "Comment", ltd);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    function comment(nemail, date, dif, cmd, id, lrply, email, time, n) {
        var tmimg = [], tmvimg = [], timg = [], tdoc = null, tnmdoc = "";
        if (limg[n] !== undefined) {
            for (var i = 0; i < limg[n].length; i++) {
                tmimg.push(limg[n][i][2]);
                timg.push({ uri: limg[n][i][2], type: "image", name: limg[n][i][3] });
                tmvimg.push({ source: { uri: limg[n][i][2] }, title: limg[n][i][3] });
            }
        }

        if (ldoc[n] !== undefined) {
            if (ldoc[n].length > 0) {
                tdoc = {
                    uri: ldoc[n][0][2],
                    type: "application/pdf",
                    name: ldoc[n][0][3],
                    size: ldoc[n][0][6],
                }
                tnmdoc = ldoc[n][0][3];
            }
        }

        return (
            <VStack key={id} mx="30px">
                <Box key={id} mt="30px">
                    {
                        email === remail ?
                        <HStack background={'#rgba(182, 0, 223, 0.3)'} style={{display: 'flex', flexDirection: 'column', borderWidth: 2, borderColor: '#B600DF'}} rounded="sm" pb="30px" pt="30px" px="30px">
                        <Box w="100%" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text fontSize="lg" fontWeight={'bold'}>{nemail}</Text>
                            <Text fontSize="md" fontWeight={'bold'} color='#B600DF'>{dif}</Text>
                            {/* <Text fontSize="md" fontWeight={'bold'}>{date}</Text> */}
                        </Box>
                        <Box>
                            <Text fontSize={'lg'} color={"black"}>{cmd}</Text>
                        </Box>
                        <Box style={email === remail && time / 86400 <= 1 ? styles.d_flex : styles.d_none}>
                            <Box style={{display: 'flex', alignItems: 'flex-end'}}>
                                <Box marginTop={'30px'} rounded="sm" style={{display: 'flex', alignItems: 'center', width: 50, height: 50, justifyContent: 'center', backgroundColor: '#B600DF'}}>
                                    <Pressable onPress={() => { setType("M"), setIdCmd(id), setEmailCmd(email), setTxtCmd(cmd), setImgCmd(timg), setImgsCmd(tmimg), setVImgsCmd(tmvimg), setDocCmd(tdoc), setNDocCmd(tnmdoc), onOpen() }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.dots_icon()} size={30} color="#FFFFFF"/></Pressable>
                                </Box>
                            </Box>
                        </Box>
                        </HStack>
                        :
                        <HStack background={'#rgba(28, 163, 255, 0.3)'} style={{display: 'flex', flexDirection: 'column', borderWidth: 2, borderColor: '#1CA3FF'}} rounded="sm" pb="30px" pt="30px" px="30px">
                        <Box w="100%" style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
                            <Text fontSize="lg" fontWeight={'bold'}>{nemail}</Text>
                            <Text fontSize="md" fontWeight={'bold'} color='#1CA3FF'>{dif}</Text>
                            {/* <Text fontSize="md" fontWeight={'bold'}>{date}</Text> */}
                        </Box>
                        <Box>
                            <Text textAlign={'right'} fontSize={'lg'} color={"black"}>{cmd}</Text>
                        </Box>
                        <Box style={email === remail && time / 86400 <= 1 ? styles.d_flex : styles.d_none}>
                            <Box style={{display: 'flex', alignItems: 'flex-end'}}>
                                <Box marginTop={'30px'} rounded="sm" style={{display: 'flex', alignItems: 'center', backgroundColor: 'transparent', width: 50, height: 50, justifyContent: 'center', borderWidth: 2, borderColor: '#1CA3FF'}}>
                                    <Pressable onPress={() => { setType("M"), setIdCmd(id), setEmailCmd(email), setTxtCmd(cmd), setImgCmd(timg), setImgsCmd(tmimg), setVImgsCmd(tmvimg), setDocCmd(tdoc), setNDocCmd(tnmdoc), onOpen() }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.dots_icon()} size={30} color="#1CA3FF"/></Pressable>
                                </Box>
                            </Box>
                        </Box>
                        </HStack>
                    }
                    <ScrollView mt={3} horizontal={true} style={limg[n] !== undefined ? limg[n].length === 0 ? styles.d_none : styles.d_flex : styles.d_flex}>
                        <HStack space={2} px={2}>
                            {
                                limg[n] !== undefined && limg[n].map((data) => {
                                    mindex += 1;
                                    var index = mindex;
                                    return (
                                        <Box key={data[2]}>
                                            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setImageIndex(index), setViewImage(true) }}><Image source={{ uri: data[2] }} size="lg" alt="Image" /></Pressable>
                                        </Box>
                                    )
                                })
                            }
                        </HStack>
                    </ScrollView>

                    <Box mt={3} w={"32"} style={ldoc[n] !== undefined ? ldoc[n].length === 0 ? styles.d_none : styles.d_flex : styles.d_flex}>
                        {
                            ldoc[n] !== undefined && ldoc[n].map((data) => {
                                return (
                                    <VStack key={data[2]}>
                                        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { Linking.openURL(data[2]) }}>
                                            <Center>
                                                <Icon as={lib.file_icon()} size={100} color="red" />
                                            </Center>
                                            <Center>
                                                <Text>{data[3].length > 19 ? data[3].substring(0, 10) + "....pdf" : data[3]}</Text>
                                            </Center>
                                        </Pressable>
                                    </VStack>
                                )
                            })
                        }
                    </Box>
                </Box>

                <VStack space={3}>
                    {
                        lrply.map((data) => {
                            return replyComment(data[7], data[4], data[8], data[6], data[0], data[2])
                        })
                    }
                </VStack>
            </VStack>
        )
    }

    function replyComment(nemail, date, dif, cmd, id, email) {
        return (
            <Box h={"auto"} key={id} borderLeftWidth={1} borderLeftColor={"black"} pl={4} mt={2}>
                <HStack>
                    <Box w="90%">
                        <Text fontSize="md" letterSpacing={"lg"} textTransform={"uppercase"} fontWeight={500} pb={0}>{nemail}</Text>
                        <Text fontSize="xs" letterSpacing={"lg"} fontWeight={500} color={"gray.500"}>{date + " (" + dif + ")"}</Text>
                    </Box>
                    <Box w="10%" style={styles.d_none}>
                        <Box p={1} style={email !== email ? styles.d_none : styles.d_flex}>
                            <Pressable onPress={() => { setType("R"), setIdCmd(id), setEmailCmd(email), setTxtCmd(cmd); onOpen(); }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.dots_icon()} size={30} color="black" /></Pressable>
                        </Box>
                    </Box>
                </HStack>
                <Text pt={2} color={"black"}>{cmd}</Text>
            </Box>
        )
    }

    return (
        <NativeBaseProvider>
            <Header
                navigation={navigation}
                route={route}
                show_text={"Y"}
                header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>{nama}</Text>
                        <Text fontWeight={'bold'} fontSize={20}>{nmPrj}</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
            />
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            } _contentContainerStyle={{ flexGrow: 1 }} onScroll={({nativeEvent}) => { if(lib.isCloseToBottom(nativeEvent)) { appendCmd() } }}>
                <VStack style={isLoad ? styles.d_none : styles.d_flex}>
                    {
                        lcmd.map((data, index) => {
                            return comment(data[6], data[3], data[7], data[5], data[0], data[8], data[2], data[9], index)
                        })
                    }

                    <Box>
                        <Actionsheet isOpen={isOpen} onClose={onClose}>
                            <Actionsheet.Content>
                                <Actionsheet.Item style={styles.d_none} key="C" startIcon={<Icon as={lib.reply_icon()} color={"black"} size="md"/>} onPress={() => { onClose(); toReplyComment() }} >Reply</Actionsheet.Item>
                                <Actionsheet.Item style={email.toUpperCase() !== emailCmd.toUpperCase() ? styles.d_none : styles.d_flex} key="R" startIcon={<Icon as={lib.edit_icon()} color={"black"} size="md"/>} onPress={() => { onClose(); toEditComment() }} >Ralat</Actionsheet.Item>
                                <Actionsheet.Item style={email.toUpperCase() !== emailCmd.toUpperCase() ? styles.d_none : styles.d_flex} key="D" startIcon={<Icon as={lib.delete_icon()} color={"black"} size="md"/>} onPress={() => { setShowModal(true) }}>Hapus</Actionsheet.Item>
                            </Actionsheet.Content>
                        </Actionsheet>

                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                            <Modal.Content maxWidth="350">
                                <Modal.CloseButton />
                                <Modal.Header>Hapus Comment</Modal.Header>
                                <Modal.Body>
                                    <Alert w="100%" status={"warning"} mb={1}>
                                        <HStack space={2} flexShrink={1} px={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                Anda yakin hapus comment ?
                                            </Text>
                                        </HStack>
                                    </Alert>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                                        <Button onPress={() => { setShowModal(false), onClose(); delCmd(); }}>Ya</Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                    </Box>
                </VStack>
                <VStack style={!isLoad ? styles.d_none : styles.d_flex}>
                    {
                        arrLoad.map((key) => {
                            return (
                                <VStack w="100%" mx="auto" borderRadius={10} key={key} px="30px" py="30px" space={3}>
                                    <Skeleton h={6} w={"50%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} />
                                    <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} />
                                </VStack>
                            )
                        })
                    }
                </VStack>
            </ScrollView>
            {
                isAppend &&
                <Center py={2}>
                    <Spinner size="sm" />
                </Center>
            }
            <Box style={(email.toUpperCase() === tgjwb.toUpperCase() || email.toUpperCase() === created.toUpperCase()) ? styles.d_flex : styles.d_none} p={3}>
                <HStack>
                    <Button mx={1} w={"48%"} style={cstat !== "PENDING" ? styles.d_flex : styles.d_none} isLoading={isLoad3} py={3} background={lib.new_color_orange} onPress={() => { updStat2("PENDING") }}><Text fontWeight={'bold'} fontSize={"md"} color={"white"}>Pending</Text></Button>
                    
                    <Button mx={1} w={cstat != "PENDING" ? "48%" : "100%"} isLoading={isLoad2} py={3} background={cstat === "PROCESS" ? lib.new_color_green : lib.new_color_orange} onPress={updStat}><Text fontWeight={'bold'} fontSize={"md"} color={"white"}>{cstat === "PROCESS" ? "Selesai" : "Process"}</Text></Button>
                </HStack>
            </Box>
            
            <ImageGallery
                isOpen={viewImage}
                images={images}
                initialIndex={imageIndex}
                close={() => { setViewImage(false); }}
                renderHeaderComponent={imageGalleryHeader}
            />

            <Pressable onPress={() => { toAddComment() }}>
                <Center position={"absolute"} rounded={"full"} style={styles.tsk_btn_main} p={4} bottom={"20"} right={5}>
                    <Icon as={lib.add_icon_plus()} style={styles.tsk_btn_main} size={30} color='#FFFFFF'></Icon>
                </Center>
            </Pressable>
        </NativeBaseProvider>
    )
}