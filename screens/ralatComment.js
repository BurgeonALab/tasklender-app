import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { NativeBaseProvider, Image, Center, VStack, Box, Text, Button, HStack, Pressable as NBPressable, Modal, ScrollView as NScrollView, Icon, TextArea } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import mime from "mime";
import { ImageGallery } from '@georstat/react-native-image-gallery';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function RalatComment({ route, navigation }) {
    const lib = new CFunc();
    const id = route.params.id;
    const ltd = route.params.ltd;
    const [cmd, setCmd] = useState(route.params.cmd);
    const [email, setEmail] = useState("");
    const [err, setErr] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    const [image, setImage] = useState(route.params.image);
    const [images, setImages] = useState(route.params.images);
    const [vimages, setVImages] = useState(route.params.vimages);
    const [doc, setDoc] = useState(route.params.doc);
    const [docnm, setDocnm] = useState(route.params.docnm);
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
        let result = await ImagePicker.launchImageLibraryAsync({
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

    const editCmd = () => {
        setIsLoad(true);
        setErr(0);

        if (cmd === "") {
            setErr(-1);
            setIsLoad(false);
        }
        else {
            lib.editCmd(id, ltd, cmd, email, image, doc, route.params.doc).then((err) => {
                if (parseInt(err) !== 0) {
                    setErr(err);
                    setIsLoad(false);
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
          lib.navigate(response, "RalatComment", "");
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
                header={"Ralat Comment"}
                bgcolor={lib.main_color}
                txtcolor={lib.white_color}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <NScrollView>
                <VStack style={err !== -2 ? styles.d_flex : styles.d_none} space={8} py={4} px={4}>
                    <Box>
                        <Text>Comment <Text style={styles.text_danger}>*</Text></Text>
                        <TextArea h={48} fontSize={"md"} placeholder="" p={2} fontWeight={"bold"} borderWidth={1} borderColor={"dark.500"} borderRadius={6} value={cmd} onChangeText={(val) => { setCmd(val) }} />
                        <Text fontSize={"xs"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}> Comment wajib diisi</Text>
                    </Box>

                    <VStack space={2}>
                        <HStack space={1}>
                            <Box><Text>Upload Picture</Text></Box>
                            <Box mx={1}><Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={pickImage}><Icon as={lib.upload_icon()} size={23} /></Pressable></Box>
                            <Box mx={1}><Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={cameraImage}><Icon as={lib.camera_icon()} size={23} /></Pressable></Box>
                        </HStack>
                        
                        <ScrollView horizontal={true}>
                            <HStack space={2} px={2}>
                                {
                                    images.map((img, index) => {
                                        return (
                                            <VStack key={index}>
                                                <NBPressable bgColor={"white"} rounded="full" mb={-3} mr={-1} zIndex={1} variant="solid" alignSelf="flex-end" onPress={() => { removeImg(img) }}><Icon as={lib.minus_circle_icon()} size={6} color={lib.danger_color} /></NBPressable>
                                                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { setIsImageViewVisible(true), setImageIndex(index) }}><Image source={{ uri: img }} size="xl" alt="Image" /></Pressable>
                                            </VStack>
                                        )
                                    })
                                }
                            </HStack>
                        </ScrollView>
                    </VStack>

                    <VStack space={2}>
                        <HStack space={1}>
                            <Box><Text>Upload Document <Text fontWeight={"bold"}>(PDF)</Text></Text></Box>
                            <Box mx={1}><Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={pickDoc}><Icon as={lib.upload_icon()} size={23} /></Pressable></Box>
                        </HStack>
                        
                        <VStack style={doc ? styles.d_flex : styles.d_none} mt={1} w={"32"}>
                            <NBPressable bgColor={"white"} rounded="full" mt={1} mb={-3} mr={-1} zIndex={1} variant="solid" alignSelf="flex-end" onPress={removeDoc}><Icon as={lib.minus_circle_icon()} size={6} color={lib.danger_color} /></NBPressable>
                            <Center>
                                <Icon as={lib.file_icon()} size={100} color={lib.danger_color} />
                            </Center>
                            <Center>
                                <Text>{docnm !== undefined ? docnm.length > 19 ? docnm.substring(0, 10) + "....pdf" : docnm : ""}</Text>
                            </Center>
                        </VStack>
                    </VStack>
                    <Box>
                        <Button bgColor={"primary.600"} size="lg" p={3} isLoading={isLoad} onPress={editCmd}>Simpan</Button>
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
                        <Modal.Body px={1}>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </NScrollView>
        </NativeBaseProvider>
    )
}