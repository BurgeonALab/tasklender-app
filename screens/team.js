import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { NativeBaseProvider, Center, VStack, Box, Text, Button, ScrollView, HStack, Pressable as NBPressable, useDisclose, Modal, Alert, Icon, Skeleton, Toast, Spinner, Input } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TeamScreen({ navigation, route }) {
  const lib = new cFunc();
  const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
  const [email, setEmail] = useState("");
  const [lteam, setLteam] = useState([]);
  const [lmteam, setLMteam] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [showModal, setShowModal] = useState(false);
  const [idTeam, setIdTeam] = useState("");
  const [cnotif, setCNotif] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const responseListener = useRef();
  // Icon
  const add_icon = lib.add_icon();
  const trash_icon = lib.trash_icon();
  const edit_icon = lib.edit_icon();

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getTeam();
  }, []);

  const toAddTeam = () => {
    navigation.navigate('tambahTeam', {
      onGoBack: () => refresh(),
    });
  }

  const toEditTeam = (id, nama) => {
    navigation.navigate('ralatTeam', {
      id: id,
      nama: nama,
      onGoBack: () => refresh(),
    });
  }

  const delTeam = () => {
    lib.delTeam(idTeam).then(() => {
      refresh();
    })
  }

  useEffect(() => {
      setIsLoad(true);
      getTeam();

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        lib.navigate(response, "Team", "");
      });

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current);
      };
  }, [])

  const team_template = (nama, id, mmbr) => {
    return (
      <NBPressable onPress={() => { toDataTeam(id, nama, mmbr) }} key={id} px={'30px'}>
        {({ isPressed }) => {
          return (
            <HStack w="100%" mx="auto" bgColor={'rgba(28, 163, 255, 0.3)'} rounded={'sm'} p={'30px'} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }], display: 'flex', justifyContent: 'space-between' }}>
              <Box justifyContent={"center"}>
                <Text fontSize="lg" fontWeight={'bold'} color={styles.txt_black}>{nama}</Text>
                <Text fontSize="sm" color={styles.txt_black}>Jumlah Member:
                  <Text fontWeight={'bold'}> {mmbr} member</Text>
                </Text>
              </Box>
              <Box>
                <Button borderWidth={2} borderColor={'#1CA3FF'} mb={1} bg={'transparent'} w="40px" h="40px" onPress={() => { toEditTeam(id, nama); }}>
                  <Icon
                    as={edit_icon}
                    size="6"
                    color='#1CA3FF'
                  />
                </Button>
                <Button borderWidth={2} borderColor={'#EF0057'} mt={2} bg={'transparent'} w="40px" h="40px" onPress={() => { setShowModal(true); }}>
                  <Icon
                    as={trash_icon}
                    size="6"
                    color='#EF0057'
                  />
                </Button>
              </Box>
            </HStack>
          )
        }}
      </NBPressable>
    )
  }

  const toDataTeam = (id, nama, mmbr) => {
    navigation.navigate('dataTeam', {
      id: id,
      nama: nama,
      mmbr: mmbr,
      //onGoBack: () => refresh(),
    });
  }

  const getTeam = async () => {
    const email = await lib.getUserID();
    const data = await lib.getAllTeam(email);
    const notif = await lib.getCNotif(email);
    setCNotif(notif.data.length + notif.dgroup.length);
    setLteam(data);
    setLMteam(data);
    setEmail(email);
    setIsLoad(false);
  }

  const schTeam = (val) => {
    setIsSearch(true);
    setLteam(lmteam.filter(data => data[1].toLowerCase().indexOf(val.toLowerCase()) >= 0));
    setIsSearch(false);
  }

  return (
    <NativeBaseProvider>
      <Header
        navigation={navigation}
        route={route}
        show_text={"Y"}
        header={
          <Box>
            <Text fontWeight={'light'} fontSize={20}>Tim</Text>
          </Box>
        }
        bgcolor={styles.bg_transparent}
        txtcolor={styles.txt_black}
        show_back_arrow={"N"}
      />
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      } _contentContainerStyle={{ flexGrow: 1 }} pt={2}>
        <VStack style={{display:'flex', flexDirection: 'row'}} paddingLeft={'20px'} paddingRight={'20px'} py={5}>
          <HStack>
          </HStack>
          <Box w={'80%'}>
            <Input
              InputLeftElement={isSearch ? <Spinner size={"sm"} mx={2} /> : <Icon as={lib.search_icon()}
              size={18}
              color='#1CA3FF'
              ml={5} />}
              w="100%"
              placeholder="Cari Team"
              fontSize={"md"}
              _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
              variant="unstyled"
              bg='rgba(28, 163, 255, 0.3)'
              placeholderTextColor='#1CA3FF'
              h={50}
              rounded={'sm'}
              onChangeText={(val) => { schTeam(val); }}></Input>
          </Box>
          <Box w={'20%'} style={{display: 'flex', alignItems: 'flex-end'}}>
            <Button
              style={{width: 50, height: 50}}
              rounded={'sm'}
              bg='rgba(28, 163, 255, 0.3)'
              onPress={() => { toAddTeam() }}
            >
              <Icon
                as={add_icon}
                size="6"
                color='#1CA3FF'
              />
            </Button>
          </Box>
        </VStack>
        <VStack pb={5} minH={"3xs"}>
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
                  return team_template(data[1], data[0], data[2]);
                })
            }
          </VStack>
          <VStack style={!isLoad ? styles.d_none : styles.d_flex} space={4}>
            {
              arrLoad.map((key) => {
                return <Skeleton w="90%" mx="auto" borderRadius={10} h={"16"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} key={key} />
              })
            }
          </VStack>
          <Box>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Hapus Team</Modal.Header>
                <Modal.Body>
                  <Alert w="100%" status={"warning"} mb={1}>
                    <HStack space={2} flexShrink={1} px={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="md" color="coolGray.800">
                        Anda yakin hapus Team ?
                      </Text>
                    </HStack>
                  </Alert>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>Batal</Button>
                    <Button onPress={() => { setShowModal(false), onClose(), delTeam() }}>Ya</Button>
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
