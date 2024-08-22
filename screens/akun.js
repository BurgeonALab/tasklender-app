import React, { useState, useEffect, useRef } from 'react';
import { Pressable, RefreshControl } from 'react-native';
import { NativeBaseProvider, Skeleton, VStack, Box, Text, ScrollView, HStack, Icon } from 'native-base';
import { Linking } from 'react-native'
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import styles from '../constants/index';

export default function AkunScreen({ navigation, route }) {
  const lib = new CFunc();
  const [ nama, setNama ] = useState("");
  const [ member, setMember ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ phone, setPhone ] = useState("");
  const [ kodeNgr, setKodeNgr ] = useState("");
  const [ namaNgr, setNamaNgr ] = useState("");
  const [ kodetel, setKodeTel ] = useState("");
  const [ ngr, setNgr ] = useState("");
  const [ cnotif, setCNotif ] = useState(0);
  const [ isLoad, setIsLoad ] = useState(true);
  const responseListener = useRef();

  const ppLink = () => {
    const url = 'https://www.winsoncoldstorage.com/privacy-policy/'
    Linking.openURL(url);
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getData();
  }, []);

  const getData = async () => {
    const email = await lib.getUserID();
    const data = await lib.getDataUser(email);
    
    setNama(data.data[2]);
    setEmail(data.data[0]);
    setPhone(data.data[4]);
    setNgr(data.data[11]);
    setMember(data.data[15]);
    setKodeNgr(data.data[13]);
    setNamaNgr(data.data[12]);
    setKodeTel(data.data[19]);
    setIsLoad(false);
  }

  const toEditUser = () => {
    navigation.navigate('ralatAkun', {
      email : email,
      nama : nama,
      phone : phone,
      ngr : ngr,
      kodengr : kodeNgr,
      namangr : namaNgr,
      kodetel : kodetel,
      onGoBack : () => refresh(),
    })
  }

  const toGantiPass = () => {
    navigation.navigate('gantiPass', {
      onGoBack : () => refresh(),
    })
  }

  const toMShip = () => {
    navigation.navigate('membership');
  }

  const toLTran = () => {
    navigation.navigate('daftarTransaksi');
  }

  useEffect(() => {
    setIsLoad(true);
    getData();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Akun", "");
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
            <Text fontWeight={'light'} fontSize={20}>Akun</Text>
          </Box>
        }
        bgcolor={styles.bg_transparent}
        txtcolor={styles.txt_black}
        show_back_arrow={"N"}
        txtnotif={cnotif}
      />
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      } _contentContainerStyle={{ flexGrow: 1 }}>
        <VStack paddingX={'30px'} paddingY={'30px'}>
          <HStack>
            <Box w={"90%"}>
              {
                isLoad && 
                <Skeleton.Text h={20} rounded={"lg"} lines={3} w={"90%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton.Text> ||
                !isLoad && 
                <VStack>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>{nama}</Text>
                  <Text fontSize={"md"} fontWeight={"bold"}>{member}</Text>
                  <Text fontSize={"sm"}>{email}</Text>
                  <Text fontSize={"sm"}>{phone}</Text>
                </VStack>
              }
            </Box>
            <Box w={"10%"}>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { toEditUser(); }}><Icon as={lib.edit_icon()} size={7} color={lib.muted_color}></Icon></Pressable>
            </Box>
          </HStack>
          <Text fontSize={"md"} my={3} fontWeight={"bold"}>Info Lainnya</Text>
          <Box>
            <Pressable onPress={toMShip} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <HStack py={3}>
                <Box w={"8%"} justifyContent={"center"}>
                  <Icon as={lib.crown_icon()} size={7} color={'#1CA3FF'}></Icon>
                </Box>
                <Box w={"92%"} pl={4} justifyContent={"center"}><Text fontSize={"md"}>Membership</Text></Box>
              </HStack>
            </Pressable>
            <Pressable onPress={toLTran} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <HStack py={3}>
                <Box w={"8%"} justifyContent={"center"}>
                  <Icon pl={1} as={lib.file_text_icon()} size={7} color={'#1CA3FF'}></Icon>
                </Box>
                <Box w={"92%"} pl={4} justifyContent={"center"}><Text fontSize={"md"}>Daftar Transaksi</Text></Box>
              </HStack>
            </Pressable>
            <Pressable onPress={() => { toGantiPass(); }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <HStack py={3}>
                <Box w={"8%"} justifyContent={"center"}>
                  <Icon as={lib.pass_icon()} size={7} color={'#1CA3FF'}></Icon>
                </Box>
                <Box w={"92%"} pl={4} justifyContent={"center"}><Text fontSize={"md"}>Ganti Password</Text></Box>
              </HStack>
            </Pressable>
            <Pressable onPress={ppLink} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <HStack py={3}>
                <Box w={"8%"} justifyContent={"center"}>
                  <Icon pl={1} as={lib.privacy_icon()} size={7} color={'#1CA3FF'}></Icon>
                </Box>
                <Box w={"92%"} pl={4} justifyContent={"center"}><Text fontSize={"md"}>Kebijakan Privasi</Text></Box>
              </HStack>
            </Pressable>
            <Pressable onPress={() => { lib.logout(); navigation.replace("login") }} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
              <HStack py={3}>
                <Box w={"8%"} justifyContent={"center"}>
                  <Icon pl={1} as={lib.logout_icon()} size={7} color={'#1CA3FF'}></Icon>
                </Box>
                <Box w={"92%"} pl={4} justifyContent={"center"}><Text fontSize={"md"}>Logout</Text></Box>
              </HStack>
            </Pressable>
          </Box>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}