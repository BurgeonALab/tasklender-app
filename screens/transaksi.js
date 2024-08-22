import React, { useState, useEffect, useRef } from 'react';
import { Pressable as NPressable, RefreshControl } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, ScrollView, HStack, Divider, Pressable as NBPressable, Skeleton } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import styles from '../constants/index';
import * as Notifications from 'expo-notifications';

export default function TransaksiScreen({ navigation, route }) {
  const lib = new CFunc();
  const [arrLoad, setArrLoad] = useState(lib.getArrLoad(6));
  const [email, setEmail] = useState("");
  const [isLoad, setIsLoad] = useState(true);
  const [cnotif, setCNotif] = useState(0);
  const [ltran, setLtran] = useState([]);
  const [filter, setFilter] = useState("");
  const responseListener = useRef();

  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getData();
  }, []);

  const filterLTD = async (tfilter) => {
    setIsLoad(true);

    const data = await lib.getAllPayment(email, tfilter);
    setFilter(tfilter);

    setLtran(data.data);

    setIsLoad(false);
  }

  const getData = async () => {
    const email = await lib.getUserID();
    const data = await lib.getAllPayment(email, filter);
    
    setLtran(data.data);
    setEmail(email);
    
    setIsLoad(false);
  }

  const toDtlTran = (id) => {
    navigation.navigate('detailTransaksi', {
      id : id,
    })
  }

  const tran_template = (id, total, stat, created) => {
    return (
      <NBPressable onPress={() => { toDtlTran(id) }} key={id}>
        {({ isPressed }) => {
          return (
            <VStack w="90%" mx="auto" borderRadius={10} p={3} space={2} borderWidth={1} borderColor={lib.muted_color} style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}>
              <HStack  alignItems={"center"}>
                  <VStack w="60%">
                      <Box>
                          <Text fontSize={"md"} fontWeight={"bold"}>{id}</Text>
                      </Box>
                      <Box>
                          <Text fontSize={"xs"}>{created}</Text>
                      </Box>
                  </VStack>
                  <VStack alignItems={"flex-end"} w="40%" space={1}>
                      <Box bgColor={stat === "pending" ? lib.light_warning_color : stat === "expired" || stat === "batal" ? lib.light_danger_color : lib.light_success_color} p={1} rounded={"lg"}>
                          <Text fontSize={"sm"} color={stat === "pending" ? lib.warning_color : stat === "expired" || stat === "batal" ? lib.danger_color : lib.success_color} textTransform={"uppercase"} fontWeight={"bold"}>{stat}</Text>
                      </Box>
                  </VStack>
              </HStack>
              <Divider></Divider>
              <VStack>
                <Box>
                  <Text fontSize={"xs"} fontWeight={"bold"}>Total Tagihan</Text>
                </Box>
                <Box>
                  <Text fontSize={"sm"} fontWeight={"medium"}>Rp. {lib.numberFormat(total)}</Text>
                </Box>
              </VStack>
            </VStack>
          )
        }}
      </NBPressable>
    )
  }

  useEffect(() => {
    setIsLoad(true);
    getData();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Transaksi", "");
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
        bgcolor={styles.bg_transparent}
        txtcolor={styles.txt_black}
        txtnotif={cnotif}
        header={
          <Box>
            <Text fontWeight={'light'} fontSize={20}>Daftar Transaksi</Text>
          </Box>
        }
        show_back_arrow={"Y"}
      />
      {/* BUTTON FILTER */}
      <HStack px={'30px'} py={'10px'}>
        <ScrollView horizontal={true}>
          <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD(""); }}>
              <Box rounded='sm' borderWidth={1} borderColor={lib.new_color_purple} bgColor={filter === "" ? lib.new_color_purple : lib.transparent_color} py={1} px={3} mx={1}>
                  <Text color={filter === "" ? lib.white_color : lib.new_color_purple}>All</Text>
              </Box>
          </NPressable>
          <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("berhasil"); }}>
              <Box rounded='sm' borderWidth={1} borderColor={lib.new_color_green} py={1} px={3} mx={1} bgColor={filter === "berhasil" ? lib.new_color_green : lib.transparent_color}>
                  <Text color={filter === "berhasil" ? lib.white_color : lib.success_text}>Berhasil</Text>
              </Box>
          </NPressable> 
          <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("pending"); }}>
              <Box rounded='sm' borderWidth={1} borderColor={lib.new_color_yellow} py={1} px={3} mx={1} bgColor={filter === "pending" ? lib.new_color_yellow : lib.transparent_color}>
                  <Text color={filter === "pending" ? lib.white_color : lib.new_color_yellow}>Pending</Text>
              </Box>
          </NPressable>
          <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("batal"); }}>
              <Box rounded='sm' borderWidth={1} borderColor={lib.new_color_red} py={1} px={3} mx={1} bgColor={filter === "batal" ? lib.new_color_red : lib.transparent_color}>
                  <Text color={filter === "batal" ? lib.white_color : lib.new_color_red}>Batal</Text>
              </Box>
          </NPressable>
          <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { filterLTD("expired"); }}>
              <Box rounded='sm' borderWidth={1} borderColor={lib.new_color_pink} py={1} px={3} mx={1} bgColor={filter === "expired" ? lib.new_color_pink : lib.transparent_color}>
                  <Text color={filter === "expired" ? lib.white_color : lib.new_color_pink}>Expired</Text>
              </Box>
          </NPressable>
        </ScrollView>
      </HStack>

      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      } _contentContainerStyle={{ flexGrow: 1 }} my={2}>
        {
          isLoad &&
          <VStack space={4}>
            {
              arrLoad.map((key) => {
                return (
                  <VStack w="90%" mx="auto" key={key} py={4} space={4}>
                    <HStack  alignItems={"center"}>
                        <VStack w="60%" space={1}>
                            <Skeleton h={4} mx={4} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} w={"80%"}/>
                            <Skeleton h={3} mx={4} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} w={"80%"}/>
                        </VStack>
                        <VStack alignItems={"flex-end"} w="40%" space={1}>
                            <Skeleton h={4} mx={4} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} w={"50%"}/>
                        </VStack>
                    </HStack>
                    <Box>
                      <Skeleton h={4} mx={4} w={"30%"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton} rounded={"lg"} />
                    </Box>
                  </VStack>
                )
              })
            }
          </VStack> ||
          !isLoad &&
          <VStack space={4}>
            {
                ltran.map((data) => {
                    return tran_template(data[0], data[1], data[3], data[5])
                })
            }
          </VStack>
        }
      </ScrollView>
    </NativeBaseProvider>
  );
}