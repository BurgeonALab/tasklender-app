import React, {
  useEffect,
  useState,
  useRef } from 'react';
import {
  RefreshControl,
  Pressable as NPressable } from 'react-native';
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
  useDisclose,
  Modal,
  Alert,
  Icon,
  Progress,
  Image,
  Skeleton,
  FlatList } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function Home({ navigation, route }) {
  const lib = new cFunc();
  const [ remail, setRemail ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ lpyk, setLpyk ] = useState([]);
  const [ ldl, setLdl ] = useState([]);
  const [ isLoad, setIsLoad ] = useState(false);
  const [ arrLoad, setArrLoad] = useState(lib.getArrLoad(3));
  const { isOpen, onOpen, onClose } = useDisclose();
  const [ showModal, setShowModal ] = useState(false);
  const [ idPyk, setIdPyk ] = useState("");
  const [ cnotif, setCNotif ] = useState(0);
  const [ welcomeName, setWelcomeName ] = useState("");
  const responseListener = useRef();
  const edit_icon = lib.edit_icon();
  const group_icon = lib.group_icon();
  const trash_icon = lib.trash_icon();
  
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getPyk();
    getName();
  }, []);

  const toEditPyk = (id, nama, bgcolor, txtcolor) => {
    navigation.navigate('ralatProyek', {
      idPyk : id,
      nmPyk : nama,
      bgPyk : bgcolor,
      txtPyk : txtcolor,
      onGoBack : () => refresh(),
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

  const toDataPyk = (nama) => {
    navigation.navigate('dataProyek', {
      id : idPyk,
      nmPyk : nama,
      remail : email,
      onGoBack : () => refresh(),
    });
  }

  const delPyk = () => {
    lib.delPyk(idPyk).then(() => {
      refresh();
    })
  }

  const toProyek = () => {
    navigation.navigate('proyek', {
      remail : email,
      onGoBack : () => refresh(),
    })
  }

  const toTeam = () => {
    navigation.navigate('team', {
      onGoBack : () => refresh(),
    })
  }

  const toKrj = (id, nama, email) =>{
    navigation.navigate('pekerjaan', {
      pyk : id,
      nama : nama,
      remail : email,
      onGoBack : () => refresh(),
    })
  };

  const toLTD = (krj, pyk) =>{
    navigation.navigate('listToDo', {
      krj : krj,
      pyk : pyk,
      onGoBack : () => refresh(),
    })
  };

  const proyek_template = (nama, bgcolor, txtcolor, id) => {
    return (
      <Box paddingLeft={'30px'} paddingRight={'30px'} marginTop={'20px'} marginBottom={'20px'}>
        <NBPressable onPress={() => { toKrj(id, nama, email) }} key={id}>
          {({ isPressed }) => {
            return (
              <Box bgColor={'white'} rounded={"sm"} style={{transform : [{ scale : isPressed ? 0.96 : 1 }]}}>
                <HStack bgColor={'rgba(28, 163, 255, 0.3)'} rounded={"sm"} p={30}>
                  <Box w="100%" justifyContent={"center"}>
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
                      <Box w="50%" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                          onPress={() => {toEditPyk(id, nama, bgcolor, txtcolor);}}
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
              </Box>
            )
          }}
        </NBPressable>
      </Box>
    )
  }
  const deadline_template = (nama, tgl, bgcolor, txtcolor, id, idKrj, idPyk) => {
    return (
      <NBPressable onPress={() => { toLTD(idKrj, idPyk) }} key={id}>
        {({ isPressed }) => {
          return (
            <HStack w="90%" mx="auto" bgColor={bgcolor} borderRadius={10} shadow={3} style={{transform : [{ scale : isPressed ? 0.96 : 1 }]}}>
              <Box w="100%" justifyContent={"center"}>
                <Text fontSize="lg" letterSpacing={"xl"} textTransform={"uppercase"} fontWeight={500} color={txtcolor}>{nama}</Text>
                <Text fontSize="sm" color={txtcolor}>{tgl}</Text>
              </Box>
            </HStack>
          )
        }}
      </NBPressable>
    )
  }

  const TasklenderBackground = () => {
    return (
      <Image
        source={require('../assets/icon-tasklender.png')}
        size="100%"
        position={'absolute'}
        resizeMode="cover"
        marginTop={40}
        alt="Tasklender logo"
        opacity={10}
      />
    )
  }

  const getPyk = async () => {
    const email = await lib.getUserID();
    const data = await lib.getLastPyk(email);
    const notif = await lib.getCNotif(email);
    const dline = await lib.getLastDeadLTD(email);
    setCNotif(notif.data.length + notif.dgroup.length);
    setLpyk(data);
    setEmail(email);
    setLdl(dline.data);
    setIsLoad(false);
  }

  const getName = async () => {
    const email = await lib.getUserID();
    const data = await lib.getDataUser(email);
    // console.log(data);
    setRemail(data.data[0]);
    setWelcomeName(data.data[2]);
  }

  useEffect(() => {
    setIsLoad(true);
    getPyk();
    getName();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Home", "");
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
        show_icon={"Y"}
        show_text={"Y"}
        header={
          <Box>
            <Text fontWeight={'light'} fontSize={20}>Selamat datang, </Text>
            <Text fontWeight={'bold'} fontSize={20}>
              {welcomeName}
              <Text fontWeight={'normal'}>!</Text>
            </Text>
          </Box>
        }
        bgcolor={lib.header_color}
        txtcolor={lib.white_text}
        style={{marginTop: 30}}
        txtnotif={cnotif}
        show_back_arrow={"N"}
      />
      <TasklenderBackground />
      <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        } _contentContainerStyle={{flexGrow: 1}}>
        {/* PROYEK TERBARU */}
        <HStack>
          <Center w='100%' h='60px' paddingLeft='30px' paddingRight='30px'>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Box w='50%'>
                <Text style={styles.txt_black} fontSize={20} fontWeight={"semibold"} textAlign={'left'}>Proyek</Text>
              </Box>
              <Box w='50%'>
                <NPressable onPress={() => { toProyek(email) }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
                  <Text style={styles.txt_black} fontSize={16} fontWeight={"light"} textAlign={'right'}>Lihat Semua</Text>
                </NPressable>
              </Box>
            </Box>
          </Center>
          <Center style={lpyk.length > 0 ? styles.d_flex : styles.d_none}>
            <NPressable onPress={() => { toProyek(email) }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <Text color={lib.main_color} fontSize={"xs"} fontWeight={"bold"} textTransform={"uppercase"}>Lihat Semua</Text>
            </NPressable>
          </Center>
        </HStack>
        <VStack>
          <VStack style={ isLoad ? styles.d_none : styles.d_flex}>
            {
              lpyk.length == 0 ?
                (
                  <HStack w="100%" rounded={'sm'} px={'30px'}>
                    <Center w="50%">
                      {
                        lib.no_project_image()
                      }
                    </Center>
                    <Box w="50%">
                      <Text fontSize="md" fontWeight={'bold'} color={'#1CA3FF'}>Wah, belum ada proyek</Text>
                      <Text fontSize="sm" fontWeight={'light'} color={'#000000'}>Yuk, mulai kelola proyekmu dengan cara simpel</Text>
                    </Box>
                  </HStack>
                )
                : 
                lpyk.map((data) => {
                  return proyek_template(data[1], data[2], data[3], data[0], data[5]);
                })
            }
          </VStack>
          <VStack style={ !isLoad ? styles.d_none : styles.d_flex } my='30px' mx='30px'>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="100%" mx="auto" borderRadius={10} key={key} mb='20px'>
                      <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} lines={2} w={"100%"}/>
                  </VStack>
                )
              })
            }
          </VStack>
          <Box>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Hapus Proyek</Modal.Header>
                <Modal.Body>
                  <Alert w="100%" status={"warning"}>
                    <HStack flexShrink={1}>
                        <Alert.Icon mt="1" />
                        <Text fontSize="md" color="coolGray.800">
                            Anda yakin hapus Proyek ?
                        </Text>
                    </HStack>
                </Alert>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                    <Button onPress={() => { setShowModal(false), onClose(), delPyk() }}>Ya</Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Box>
        </VStack>
        {/* TIM */}
        <HStack>
          <Center w='100%' h='60px' paddingLeft='30px' paddingRight='30px'>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Box w='50%'>
              <Text style={styles.txt_black} fontSize={20} fontWeight={"semibold"} textAlign={'left'}>Tim</Text>
            </Box>
              <Box w='50%'>
                <NPressable onPress={() => { toTeam() }}>
                  <Text style={styles.txt_black} fontSize={16} fontWeight={"light"} textAlign={'right'}>Lihat Semua</Text>
                </NPressable>
              </Box>
            </Box>
          </Center>
        </HStack>
        {/* DEADLINE TERDEKAT */}
        <HStack>
          <Center w='100%' h='60px' paddingLeft='30px' paddingRight='30px'>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Box w='100%'>
                <Text style={styles.txt_black} fontSize={20} fontWeight={"semibold"} textAlign={'left'}>Deadline Terdekat</Text>
              </Box>
            </Box>
          </Center>
          <Center style={lib.length > 0 ? styles.d_flex : styles.d_none}>
            <NPressable onPress={() => { toProyek(email) }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <Text color={lib.main_color} fontSize={"xs"} fontWeight={"bold"} textTransform={"uppercase"}>Lihat Semua</Text>
            </NPressable>
          </Center>
        </HStack>
        <VStack>
          <VStack style={ isLoad ? styles.d_none : styles.d_flex } px='30px'>
            {
              ldl.length == 0 ?
                (
                  <HStack w="100%" rounded={'sm'}>
                    <Center w="50%">
                      {
                        lib.no_deadline_image()
                      }
                    </Center>
                    <Box w="50%">
                      <Text fontSize="md" fontWeight={'bold'} color={'#1CA3FF'}>Hidup bebas tanpa deadline</Text>
                      <Text fontSize="sm" fontWeight={'light'} color={'#000000'}>Kerja bagus, semua deadline sudah diselesaikan</Text>
                    </Box>
                  </HStack>
                )
                : 
                ldl.map((data) => {
                  return deadline_template(data[1], data[4], data[5], data[6], data[7], data[0], data[8]);
                })
            }
          </VStack>
          <VStack style={ !isLoad ? styles.d_none : styles.d_flex } space={4} px='30px'>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="100%" mx="auto" borderRadius={10} key={key}>
                      <Skeleton.Text startColor={lib.muted_color} endColor={lib.muted_color_skeleton} lines={2} w={"100%"}/>
                  </VStack>
                )
              })
            }
          </VStack>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}
