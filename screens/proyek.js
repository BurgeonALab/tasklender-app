import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl } from 'react-native';
import {
  NativeBaseProvider,
  Center,
  VStack,
  Box,
  Text,
  Button,
  ScrollView,
  HStack,
  Pressable as NBPressable,
  Actionsheet, useDisclose,
  Modal,
  Alert,
  Icon,
  Skeleton,
  Progress,
  Input,
  FlatList,
} from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function ProyekScreen({ navigation, route }) {
  const lib = new cFunc();
  const [ remail, setRemail ] = useState("");
  const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
  const [email, setEmail] = useState("");
  const [lpyk, setLpyk] = useState([]);
  const [lmpyk, setLMpyk] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [showModal, setShowModal] = useState(false);
  const [idPyk, setIdPyk] = useState("");
  const [nmPyk, setNmPyk] = useState("");
  const [bgPyk, setBgPyk] = useState("");
  const [txtPyk, setTxtPyk] = useState("");
  const [cnotif, setCNotif] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const responseListener = useRef();
  // Icon
  const add_icon = lib.add_icon();
  const filter_icon = lib.filter_icon();
  const edit_icon = lib.edit_icon();
  const group_icon = lib.group_icon();
  const trash_icon = lib.trash_icon();

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getPyk();
    getEmail();
  }, []);

  const toAddPyk = () => {
    navigation.navigate('tambahProyek', {
      onGoBack: () => refresh(),
    });
  }

  const contactList = [
    {
      id: "00001",
      name: "A"
    },
    {
      id: "00002",
      name: "B"
    },
    {
      id: "00003",
      name: "C"
    },
    {
      id: "00004",
      name: "D"
    },
    {
      id: "00005",
      name: "E"
    },
    {
      id: "00006",
      name: "F"
    }
  ]

  const toEditPyk = () => {
    navigation.navigate('ralatProyek', {
      id: idPyk,
      nama: nmPyk,
      bgcolor: bgPyk,
      txtcolor: txtPyk,
      onGoBack: () => refresh(),
    });
  }

  const toDataPyk = (nama) => {
    navigation.navigate('dataProyek', {
      id: idPyk,
      nmPyk: nama,
      onGoBack: () => refresh(),
    });
  }

  const delPyk = () => {
    lib.delPyk(idPyk).then(() => {
      refresh();
    })
  }

  const toKrj = (id, nama, remail) => {
    navigation.navigate('pekerjaan', {
      pyk: id,
      nama: nama,
      remail: remail,
      //onGoBack: () => refresh(),
    })
  };

  const proyek_template = (nama, bgcolor, txtcolor, id, created) => {
    return (
      <Box paddingLeft={'30px'} paddingRight={'30px'} marginTop={'20px'}>
        <NBPressable onPress={() => { toKrj(id, nama, remail) }} key={id}>
          {({ isPressed }) => {
            return (
              <HStack w="100%" mx="auto" bgColor={'rgba(28, 163, 255, 0.3)'} rounded={"sm"} p={30} style={{transform : [{ scale : isPressed ? 0.96 : 1 }]}}>
                <Box justifyContent={"center"}>
                  <Box style={{position: 'absolute', width: 45, height: 70, zIndex: 9999}} bgColor={bgcolor} top={0} right={0} marginTop={'-50px'} shadow={3}></Box>
                  <Text fontSize="18px" fontWeight={'bold'} color={txtcolor}>{nama}</Text>
                  <Text fontSize="16px" fontWeight={'regular'} color={txtcolor}>
                    Pekerjaan Selesai:
                    <Text fontSize="14px" fontWeight={'bold'} color={txtcolor}> {0}/{0}</Text>
                  </Text>
                  <Progress value={45} mt={'20px'} bg="rgba(28, 163, 255, 0.3)" _filledTrack={{bg: "rgba(28, 163, 255, 1)"}} />
                  <Box mt={'20px'} style={{display: 'flex', flexDirection: 'row'}}>
                    <Box w="50%">
                      <FlatList
                        horizontal
                        data={contactList.slice(0,3)}
                        renderItem={({
                            item
                          }) => <Box key={item.id} style={styles.bg_white} rounded={'full'} h={'30px'} w={'30px'} borderWidth={'2px'} borderColor={'#1CA3FF'}></Box>
                        } keyExtractor={item => item.id}
                      />
                    </Box>
                    <Box w='50%' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Button
                        height={'40px'}
                        width={'40px'}
                        style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#009252', marginRight: 8}}
                        onPress={() => {toDataPyk(nama);}}
                      >
                        <Icon
                          as={group_icon}
                          size="6"
                          color='#009252'
                        />
                      </Button>
                      <Button
                        height={'40px'}
                        width={'40px'}
                        style={{backgroundColor: 'transparent', borderWidth: 2, borderColor: '#1CA3FF', marginRight: 8}}
                        onPress={() => {toEditPyk();}}
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
                        onPress={() => {setShowModal(true)}}
                      >
                        <Icon
                          as={trash_icon}
                          size="6"
                          color='#EF0057'
                        />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </HStack>
            )
          }}
        </NBPressable>
      </Box>
    )
  }

  const getPyk = async () => {
    const email = await lib.getUserID();
    const data = await lib.getAllPyk(email);
    const notif = await lib.getCNotif(email);
    setCNotif(notif.data.length + notif.dgroup.length);
    setLpyk(data);
    setLMpyk(data);
    setEmail(email);
    setIsLoad(false);
  }

  const getEmail = async () => {
    const email = await lib.getUserID();
    const data = await lib.getDataUser(email);
    // console.log(data);
    setRemail(data.data[0]);
  }

  const schPyk = (val) => {
    setIsSearch(true);
    setLpyk(lmpyk.filter(data => data[1].toLowerCase().indexOf(val.toLowerCase()) >= 0));
    setIsSearch(false);
  }

  useEffect(() => {
    setIsLoad(true);
    getPyk();
    getEmail();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Proyek", "");
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
            <Text fontWeight={'light'} fontSize={20}>Proyek</Text>
            <Text fontWeight={'bold'} fontSize={20}>Daftar Proyek</Text>
          </Box>
        }
        bgcolor={styles.bg_transparent}
        txtcolor={styles.txt_black}
        show_back_arrow={"N"}
      />
      <VStack style={{display:'flex', flexDirection: 'row'}} paddingLeft={'20px'} paddingRight={'20px'} py={5}>
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
            placeholder="Cari Proyek"
            fontSize={"md"}
            onChangeText={(val) => { schPyk(val); }}>
          </Input>
        </Box>
        <Box w={'20%'} style={{display: 'flex', alignItems: 'flex-end'}}>
          <Button
            style={{width: 50, height: 50}}
            rounded={'sm'}
            bg='rgba(28, 163, 255, 0.3)'
            onPress={() => { toAddPyk() }}
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

      {/* JUDUL PROYEK */}
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      } _contentContainerStyle={{ flexGrow: 1 }}>
        {/* DATA PROYEK */}
        <VStack pb={5} minH={"3xs"}>
          <VStack style={isLoad ? styles.d_none : styles.d_flex} space={4}>
            {
              lpyk.length == 0 ?
                (
                  <HStack w="90%" mx="auto" borderRadius={10} pl={2}>
                    <Center w="50%">
                      {
                        lib.no_project_image()
                      }
                    </Center>
                    <Box w="50%" justifyContent={"center"}>
                      <Text fontSize="lg" letterSpacing={"lg"} fontWeight={500} color={lib.main_color}>Wah, belum ada proyek</Text>
                      <Text fontSize="sm" letterSpacing={"sm"} fontWeight={500} color={lib.muted_color}>Yuk, mulai kelola proyekmu dengan cara simpel</Text>
                    </Box>
                  </HStack>
                )
                :
                lpyk.map((data) => {
                  return proyek_template(data[1], data[2], data[3], data[0], data[5]);
                })
            }
          </VStack>
          <VStack style={!isLoad ? styles.d_none : styles.d_flex}>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="100%" mx="auto" key={key} py={'20px'} px={'30px'}>
                    <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} lines={2} w={"100%"} />
                  </VStack>
                )
              })
            }
          </VStack>
          <Box>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <Actionsheet.Item key="R" startIcon={<Icon as={lib.edit_icon()} color={"black"} size="md" />} onPress={() => { toEditPyk(); onClose(); }} >Ralat</Actionsheet.Item>
                <Actionsheet.Item key="S" startIcon={<Icon as={lib.group_icon()} color={"black"} size="md" />} onPress={() => { toDataPyk(); onClose(); }}>Undang Peserta</Actionsheet.Item>
                <Actionsheet.Item key="D" startIcon={<Icon as={lib.delete_icon()} color={"black"} size="md" />} onPress={() => { setShowModal(true) }} >Hapus</Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Hapus Proyek</Modal.Header>
                <Modal.Body>
                  <Alert w="100%" status={"warning"} mb={1}>
                    <HStack space={2} flexShrink={1} px={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="md" color="coolGray.800">
                        Anda yakin hapus Proyek ?
                      </Text>
                    </HStack>
                  </Alert>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                    <Button onPress={() => { setShowModal(false), onClose(), delPyk() }}>Ya</Button>
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
