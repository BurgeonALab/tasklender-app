import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { NativeBaseProvider, Center, VStack, Box, Text, Button, ScrollView, HStack, Circle, Icon } from 'native-base';
import styles from '../constants/index';
import cFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TeamScreen({ navigation, route }) {
  const lib = new cFunc();
  const id = route.params.id;
  const nama = route.params.nama;
  const mmbr = route.params.mmbr;
  const [email, setEmail] = useState("");
  const [lteam, setLteam] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [err, setErr] = useState(false);
  const [ cnotif, setCNotif ] = useState(0);
  const responseListener = useRef();
  const edit_icon = lib.edit_icon();

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getTeam();
  }, []);

  const getTeam = async () => {
    const email = await lib.getUserID();
    const data = await lib.getDataTeam(id);
    const notif = await lib.getCNotif(email);
    setCNotif(notif.data.length + notif.dgroup.length);
    setLteam(data.lmmbr);
    setEmail(email);
    setIsLoad(false);
  }

  const toEditTeam = (id, nama) => {
    navigation.navigate('ralatTeam', {
      id: id,
      nama: nama,
      onGoBack: () => refresh(),
    });
  }

  const nav_goBack = () => {
    route.params.onGoBack();
    navigation.goBack();
  }

  useEffect(() => {
    setIsLoad(true);
    getTeam();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "DataTeam", "");
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
            <Text fontWeight={'normal'} fontSize={20}>Detail</Text>
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
      } _contentContainerStyle={{ flexGrow: 1 }}>
        <VStack style={err !== -1 ? styles.d_flex : styles.d_none} px={'30px'} py={'30px'}>
          <Box w="100%" style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
            <Box w="80%">
              <Text fontSize={20} color={styles.txt_black} fontWeight={"normal"}>{nama}</Text>
              <Text fontSize={20} color={styles.txt_black} fontWeight={"bold"}>
                Peserta:
                <Text fontSize={20} color={styles.txt_black} fontWeight={"normal"}> {mmbr} member</Text>
              </Text>
            </Box>
            <Box w="20%" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button
                backgroundColor={'transparent'}
                borderWidth={2}
                borderColor={'#1CA3FF'}
                w="50px"
                h="50px"
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, alignSelf: 'flex-end'})}
                onPress={() => { toEditTeam(id, nama); }}
              >
              <Icon
                as={edit_icon}
                size="8"
                color='#1CA3FF'
              />
              </Button>
            </Box>
          </Box>
          <VStack>
            <VStack>
              {
                lteam.map((data, index) => {
                  return (
                    <VStack key={index}>
                      <HStack>
                        <Circle size={"xs"} bgColor={data[2]}>
                          <Text fontSize={"md"} fontWeight={"bold"}>{data[4]}</Text>
                        </Circle>
                        <VStack justifyContent={"center"}>
                          <Text fontSize={"md"} fontWeight={"medium"}>{data[1]}</Text>
                          <Text fontSize={"xs"} color={lib.muted_color}>{data[5]}</Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  )
                })
              }
            </VStack>
          </VStack>
        </VStack>
        <VStack style={err === -1 ? styles.d_flex : styles.d_none}>
          <Center>
            {
              lib.error_400()
            }
          </Center>

          <Box>
            <Button size={"lg"} bgColor={lib.main_color} onPress={() => { nav_goBack(); }} rounded={"xl"}>Kembali</Button>
          </Box>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}
