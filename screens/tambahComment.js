import React, { useState, useEffect, useRef } from 'react';
import { Pressable, ScrollView, Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, Image, Center, VStack, Box, Text, Button, HStack, ScrollView as NScrollView, TextArea, Pressable as NBPressable, Modal, Icon } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import mime from "mime";
import { ImageGallery } from '@georstat/react-native-image-gallery';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TambahComment({ route, navigation }) {
    const lib = new CFunc();
    const ltd = route.params.ltd;
    const [email, setEmail] = useState("");
    const [err, setErr] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    const [cmd, setCmd] = useState("");
    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [vimages, setVImages] = useState([]);
    const [doc, setDoc] = useState(null);
    const [docnm, setDocnm] = useState("");
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [viewPdf, setViewPdf] = useState(false);
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();

    const pickImage = async () => {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
            setImage([...image, { uri: result.assets[0].uri, type: mime.getType(result.assets[0].uri), name: result.assets[0].uri.split("/").pop() }]);
            setVImages([...vimages, { id: result.assets[0].assetId, url: result.assets[0].uri, title: result.assets[0].uri.split("/").pop() }]);
        }
    };

    const cameraImage = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
            setImage([...image, { uri: result.assets[0].uri, type: mime.getType(result.assets[0].uri), name: result.assets[0].uri.split("/").pop() }]);
            setVImages([...vimages, { id: result.assets[0].assetId, url: result.assets[0].uri, title: result.assets[0].uri.split("/").pop() }]);
        }
    }

    function removeImg(img) {
        setImages(images.filter(item => item !== img));
        setImage(image.filter(item => item.uri !== img));
        setVImages(vimages.filter(item => item.url !== img));
    }

    const pickDoc = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });

        if (result.type !== "cancel") {
            setDoc({ uri: result.uri, type: result.mimeType, name: result.name, size: result.size });
            setDocnm(result.name);
        }
    }

    const removeDoc = () => {
        setDoc(null);
        setDocnm("");
    }

    const addCmd = () => {
        setIsLoad(true);
        setErr(0);

        if (cmd === "") {
            setErr(-1);
            setIsLoad(false);
        }
        else {
            lib.newCmd(ltd, cmd, email, image, doc).then((err) => {
                setIsLoad(false);
                if (parseInt(err) !== 0) {
                    setErr(err);
                }
                else {
                    route.params.onGoBack();
                    navigation.goBack();
                }
            })
        }
    }

    const getEmail = async () => {
        setEmail(await lib.getUserID());
    }

    const imageGalleryHeader = () => {
        return (
            <Box alignItems={"flex-end"} py={4} px={2}>
                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setIsImageViewVisible(false) }}>
                    <Icon as={lib.close_icon()} size={8} color={lib.white_color} />
                </Pressable>
            </Box>
        )
    }

    useEffect(() => {
        getEmail();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "TambahComment", "");
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
                      <Text fontWeight={'light'} fontSize={20}>Tambah Comment</Text>
                    </Box>
                }
                
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
            />
            <NScrollView>
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none} px={'30px'} py={'30px'}>
                    <Box>
                        <Text fontSize={'lg'} mb={3}>Comment <Text style={styles.text_danger}>*</Text></Text>
                        <TextArea h={48} fontSize={"md"} placeholder="" p={2} fontWeight={"medium"} borderWidth={1} borderColor={"dark.500"} rounded={'sm'} value={cmd} onChangeText={(val) => { setCmd(val) }} />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}> Comment wajib diisi</Text>
                    </Box>

                    <VStack mt={3}>
                        <HStack>
                            <Box><Text fontSize={'lg'}>Upload Picture</Text></Box>
                            <Box mx={1}><NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={pickImage}><Icon as={lib.upload_icon()} size={28} /></NPressable></Box>
                            <Box mx={1}><NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={cameraImage}><Icon as={lib.camera_icon()} size={28} /></NPressable></Box>
                        </HStack>
                        <ScrollView horizontal={true}>
                            <HStack>
                                {
                                    images.map((img, index) => {
                                        return (
                                            <VStack key={index}>
                                                <NBPressable bgColor={"white"} rounded="full" mb={-3} mr={-1} zIndex={1} variant="solid" alignSelf="flex-end" onPress={() => { removeImg(img) }}><Icon as={lib.minus_circle_icon()} size={6} color={lib.danger_color} /></NBPressable>
                                                <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setIsImageViewVisible(true), setImageIndex(index) }}><Image source={{ uri: img }} size="xl" alt="Image" /></NPressable>
                                            </VStack>
                                        )
                                    })
                                }
                            </HStack>
                        </ScrollView>
                    </VStack>

                    <VStack mt={3}>
                        <HStack>
                            <Box><Text fontSize={'lg'}>Upload Document <Text fontWeight={"bold"}>(PDF)</Text></Text></Box>
                            <Box mx={1}><NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={pickDoc}><Icon as={lib.upload_icon()} size={28} /></NPressable></Box>
                        </HStack>

                        <VStack style={doc ? styles.d_flex : styles.d_none} mt={1} w={"32"}>
                            <NBPressable bgColor={"white"} rounded="full" mt={1} mb={-3} mr={-1} zIndex={1} variant="solid" alignSelf="flex-end" onPress={removeDoc}><Icon as={lib.minus_circle_icon()} size={6} color={lib.danger_color} /></NBPressable>
                            <Center>
                                <Icon as={lib.file_icon()} size={100} color="red" />
                            </Center>
                            <Center>
                                <Text>{docnm !== undefined ? docnm.length > 19 ? docnm.substring(0, 10) + "....pdf" : docnm : ""}</Text>
                            </Center>
                        </VStack>
                    </VStack>
                    <Box mt={5} style={{display: 'flex', alignItems: 'center'}}>
                        <Button w='50%' backgroundColor={'#1CA3FF'} size="lg" p={5} isLoading={isLoad} onPress={addCmd}>
                            <Text fontSize={'md'} color={'#FFFFFF'} fontWeight={'bold'}>Comment</Text>
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
            
                <ImageGallery
                    isOpen={isImageViewVisible}
                    images={vimages}
                    initialIndex={imageIndex}
                    close={() => { setIsImageViewVisible(false); }}
                    renderHeaderComponent={imageGalleryHeader}
                />

                <Modal isOpen={viewPdf} onClose={() => { setViewPdf(false) }} size={"full"} animationPreset={"fade"}>
                    <Modal.Content maxH={"full"}>
                        <Modal.CloseButton />
                        <Modal.Body>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </NScrollView>
        </NativeBaseProvider>
    )
}