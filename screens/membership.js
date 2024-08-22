import React, { useState, useEffect, useRef } from 'react';
import { Pressable, RefreshControl } from 'react-native';
import { NativeBaseProvider, Skeleton, VStack, Box, Text, ScrollView, HStack, Button } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import styles from '../constants/index';

export default function MembershipScreen({ navigation, route }) {
  const lib = new CFunc();
  const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
  const [member, setMember] = useState("");
  const [email, setEmail] = useState("");
  const [exp, setExp] = useState("");
  const [nama, setNama] = useState("");
  const [isLoad, setIsLoad] = useState(true);
  const [lmship, setLmship] = useState([]);
  const [mid, setMid] = useState("");
  const responseListener = useRef();

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getData();
  }, []);

  const getData = async () => {
    const email = await lib.getUserID();
    const data = await lib.getDataUser(email);
    const mship = await lib.getMShipUpg(email);
    var arr = [];

    setNama(data.data[2]);
    setEmail(data.data[0]);
    setMember(data.data[15]);

    if (data.data[16] === 0) {
      setExp("-");
    }
    else {
      setExp(data.data[17]);
    }

    for(var i = 0; i < mship.data.length; i++){
      var tarr = mship.data[i];
      tarr.push(false);

      arr.push(tarr);
    }

    setLmship(arr);

    setIsLoad(false);
  }

  const setMShip = (id) => {
    var arr = lmship;

    setMid(id);
    for(var i = 0; i < arr.length; i++){
      arr[i][7] = false;
      if(arr[i][0] === id){
        arr[i][7] = true;
      }
    }

    setLmship(arr);
  }

  const membership_template = (nama, hrga, mteam, mpyk, mkrj, mltd, id, cek) => {
    return (
      <Pressable onPress={() => { setMShip(id)}} key={id}>
        <VStack
          bg={
            nama === 'BASIC' ? 'rgba(28, 163, 255, 0.3)' :
            nama === 'ADVANCED' ? 'rgba(255, 202, 0, 0.3)' :
            'rgba(239, 0, 87, 0.3)'
          }
          w="100%"
          mx="auto"
          borderRadius={10}
          p={4}
          borderWidth={cek ? 3 : 1}
          mb={3}
          borderColor={cek ? 'rgba(28, 163, 255, 1)' : 'transparent'}
        >
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>{nama}</Text>
          </Box>
          <VStack>
            <Text>Max Team: <Text fontWeight={"medium"}>{parseInt(mteam) === -1 ? "Unlimited" : lib.numberFormat(mteam)}</Text></Text>
            <Text>Max Proyek: <Text fontWeight={"medium"}>{parseInt(mpyk) === -1 ? "Unlimited" : lib.numberFormat(mpyk)}</Text></Text>
            <Text>Max Pekerjaan: <Text fontWeight={"medium"}>{parseInt(mkrj) === -1 ? "Unlimited" : lib.numberFormat(mkrj)}</Text></Text>
            <Text>Max List To Do: <Text fontWeight={"medium"}>{parseInt(mltd) === -1 ? "Unlimited" : lib.numberFormat(mltd)}</Text></Text>
          </VStack>

          <Box alignItems={"flex-end"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>Rp { lib.numberFormat(parseFloat(hrga))}</Text>
          </Box>
        </VStack>
      </Pressable>
    )
  }

  const toPayment = () => {
    var tid = mid;
    setMid("");
    navigation.navigate('payment', {
      email : email,
      id : tid,
      onGoBack : () => refresh(),
    })
  }

  useEffect(() => {
    setIsLoad(true);
    setMid("");
    getData();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Membership", "");
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
            <Text fontWeight={'light'} fontSize={20}>Membership</Text>
          </Box>
        }
        bgcolor={styles.bg_transparent}
        txtcolor={styles.txt_black}
        show_back_arrow={"Y"}
      />
      <VStack py={'30px'} px={'30px'}>
        <HStack>
          <Box w={"100%"}>
            {
              isLoad &&
              <Skeleton.Text h={16} rounded={"lg"} lines={4} w={"90%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton.Text> ||
              !isLoad &&
              <VStack space={1}>
                <Text fontSize={"2xl"} fontWeight={"bold"}>{nama}</Text>
                <Text fontSize={"md"}>Membership: <Text fontSize={"md"} fontWeight={"bold"}>{member}</Text></Text>
                <Text fontSize={"md"}>Expired: <Text fontSize={"md"} fontWeight={"bold"}>{exp === "00-00-0000" ? "" : "("+exp+")"}</Text></Text>
              </VStack>
            }
          </Box>
        </HStack>
        <Box>
          <Text mt={7} color={'#000000'} fontSize={"xl"} fontWeight={"semibold"} alignItems={"center"}>Upgrade Membership</Text>
        </Box>
      </VStack>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      } _contentContainerStyle={{ flexGrow: 1 }}>
        {
          isLoad &&
          <VStack space={4}>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="90%" mx="auto" key={key} py={4} space={4}>
                    <Skeleton.Text px="4" startColor={lib.muted_color} endColor={lib.muted_color_skeleton} />

                    <Box alignItems={"flex-end"}>
                      <Skeleton h={4} mx={4} w={"30%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} />
                    </Box>
                  </VStack>
                )
              })
            }
          </VStack> ||
          !isLoad &&
          <VStack space={4} px='30px'>
            {
              lmship.map((data) => {
                return membership_template(data[1], data[2], data[3], data[4], data[5], data[6], data[0], data[7])
              })
            }
          </VStack>
        }
      </ScrollView>
      {
        mid !== "" &&
        <Box>
          <Button onPress={toPayment}>Upgrade Membership</Button>
        </Box>
      }
    </NativeBaseProvider>
  );
}