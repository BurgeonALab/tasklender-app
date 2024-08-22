import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, Center, VStack, Box, Text, Button, ScrollView, HStack, Pressable as NBPressable, Actionsheet, useDisclose, Modal, Alert, Icon, Skeleton, Input } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function PekerjaanScreen({ navigation, route }) {
  const lib = new cFunc();
  const pyk = route.params.pyk;
  const namaPrj = route.params.nama;
  const remail = route.params.remail;
  const [ arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
  const [ email, setEmail ] = useState("");
  const [ lkrj, setLkrj ] = useState([]);
  const [ lmkrj, setLMkrj ] = useState([]);
  const [ isLoad, setIsLoad ] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [ showModal, setShowModal ] = useState(false);
  const [ idKrj, setIdKrj ] = useState("");
  const [ nmKrj, setNmKrj ] = useState("");
  const [ bgKrj, setBgKrj ] = useState("");
  const [ txtKrj, setTxtKrj ] = useState("");
  const [ cnotif, setCNotif ] = useState(0);
  const [ isSearch, setIsSearch ] = useState(false);
  const responseListener = useRef();
  // Icon
  const add_icon = lib.add_icon();
  const filter_icon = lib.filter_icon();
  const edit_icon = lib.edit_icon();
  const trash_icon = lib.trash_icon();
  
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getKrj();
  }, []);

  const toAddKrj = () => {
    navigation.navigate('tambahPekerjaan', {
      pyk : pyk,
      onGoBack : () => refresh(),
    });
  }

  const toEditKrj = (nama) => {
    navigation.navigate('ralatPekerjaan', {
      id : idKrj,
      nama : nmKrj,
      nmPkj : nama,
      bgcolor : bgKrj,
      txtcolor : txtKrj,
      onGoBack : () => refresh(),
    });
  }

  const delKrj = () => {
    lib.delKrj(idKrj).then(() => {
      refresh();
    })
  }

  const toLTD = (id, namaPrj, nama) =>{
    navigation.navigate('listToDo', {
      krj : id,
      pyk : pyk,
      nmPrj : namaPrj,
      nmKrj : nama,
      remail : remail,
      //onGoBack : () => refresh(),
    })
  };

  const pekerjaan_template = (nama, bgcolor, txtcolor, id, created ) => {
    return (
      <NBPressable onPress={() => { toLTD(id, namaPrj, nama, remail) }} key={id} paddingX={'30px'} mt='20px'>
        {({ isPressed }) => {
          return (
            <HStack bgColor={'rgba(28, 163, 255, 0.3)'} w="100%" mx="auto" rounded={'sm'} p={30} style={{transform : [{ scale : isPressed ? 0.96 : 1 }]}}>
              <Box style={{position: 'absolute', width: 45, height: 70, zIndex: 9999}} bgColor={bgcolor} top={0} right={30} marginTop={'-20px'} shadow={3}></Box>
              <Box w="100%" justifyContent={"center"}>
                <Text fontSize="lg" fontWeight={'bold'} color={txtcolor}>{nama}</Text>
                <Text>Kegiatan Selesai: <Text fontWeight={'bold'}>{}0/{0}</Text></Text>
                <Box style={{display: 'flex', flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end'}}>
                  <Button
                    w={'40px'}
                    h={'40px'}
                    marginLeft={2}
                    style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#1CA3FF'}}
                    onPress={() => { toEditKrj(nama) }}
                  >
                    <Icon
                      as={edit_icon}
                      size="6"
                      color='#1CA3FF'
                    />
                  </Button>
                  <Button
                    w={'40px'}
                    h={'40px'}
                    marginLeft={2}
                    style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#EF0057'}}
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
            </HStack>
          )
        }}
      </NBPressable>
    )
  }

  const getKrj = async () => {
    const email = await lib.getUserID();
    const data = await lib.getAllKrj(pyk, email);
    const notif = await lib.getCNotif(email);

    setCNotif(notif.data.length + notif.dgroup.length);
    setLkrj(data);
    setLMkrj(data);
    setIsLoad(false);
    setEmail(email);
  }

  const schKrj = (val) => {
    setIsSearch(true);
    setLkrj(lmkrj.filter(data => data[2].toLowerCase().indexOf(val.toLowerCase()) >= 0));
    setIsSearch(false);
  }

  useEffect(() => {
    setIsLoad(true);
    getKrj();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Pekerjaan", pyk);
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
            <Text fontWeight={'light'} fontSize={20}>Pekerjaan</Text>
            <Text fontWeight={'bold'} fontSize={20}>{namaPrj}</Text>
          </Box>
        }
        bgcolor={styles.bg_transparent}
        txtcolor={styles.text_light}
        txtnotif={cnotif}
        show_back_arrow={"Y"}
      />
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
      />
      } _contentContainerStyle={{flexGrow: 1}}>
      <VStack paddingLeft={'30px'} paddingRight={'30px'} marginTop={'20px'}>
        <Text color={styles.txt_black} fontSize={"20px"} fontWeight={"bold"}>Daftar Pekerjaan</Text>
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
            placeholder="Cari Pekerjaan"
            fontSize={"md"}
            onChangeText={(val) => { schKrj(val); }}>
          </Input>
        </Box>
        <Box w={'20%'} style={{display: 'flex', alignItems: 'flex-end'}}>
          <Button
            style={{width: 50, height: 50}}
            rounded={'sm'}
            bg='rgba(28, 163, 255, 0.3)'
            onPress={() => { toAddKrj() }}
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
        {/* DATA PEKERJAAN */}
        <VStack>
          <VStack style={ isLoad ? styles.d_none : styles.d_flex }>
            {
              lkrj.length == 0 ?
                (
                  <HStack w="90%" mx="auto">
                    <Center w="50%">
                      {
                        lib.no_pekerjaan_image()
                      }
                    </Center>
                    <Box w="50%" justifyContent={"center"}>
                      <Text fontSize="lg" letterSpacing={"lg"} fontWeight={500} color={lib.main_color}>Wah, belum ada pekerjaan</Text>
                      <Text fontSize="sm" letterSpacing={"sm"} fontWeight={500} color={lib.muted_color}>Yuk, mulai kelola pekerjaanmu dengan cara simpel</Text>
                    </Box>
                  </HStack>
                )
                : 
                lkrj.map((data) => {
                  return pekerjaan_template(data[2], data[3], data[4], data[0], data[6]);
                })
            }
          </VStack>
          <VStack style={ !isLoad ? styles.d_none : styles.d_flex } space={4}>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="100%" mx="auto" key={key} py={2}>
                      <Skeleton.Text px="30px" startColor={lib.muted_color} endColor={lib.muted_color_skeleton} lines={2} w={"100%"}/>
                  </VStack>
                )
              })
            }
          </VStack>
          <Box>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <Actionsheet.Item key="R" startIcon={ <Icon as={lib.edit_icon()} color={"black"} size="md"/> } onPress={() => { toEditKrj(); onClose();  }} >Ralat</Actionsheet.Item>
                <Actionsheet.Item key="D" startIcon={ <Icon as={lib.delete_icon()} color={"black"} size="md"/> } onPress={() => { setShowModal(true) }} >Hapus</Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Hapus Pekerjaan</Modal.Header>
                <Modal.Body>
                  <Alert w="100%" status={"warning"} mb={1}>
                    <HStack space={2} flexShrink={1} px={1}>
                        <Alert.Icon mt="1" />
                        <Text fontSize="md" color="coolGray.800">
                            Anda yakin hapus Pekerjaan ?
                        </Text>
                    </HStack>
                </Alert>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                    <Button onPress={() => { setShowModal(false), onClose(), delKrj() }}>Ya</Button>
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
