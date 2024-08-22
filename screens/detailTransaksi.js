import React, { useState, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, ScrollView, HStack, Skeleton, Divider, Icon } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function DetailTransaksiScreen({ navigation, route }) {
  const lib = new CFunc();
  const id = route.params.id;
  const [isLoad, setIsLoad] = useState(true);
  const [cnotif, setCNotif] = useState(0);
  const [dTran, setDTran] = useState([]);
  const responseListener = useRef();
  const [vexp, setVExp] = useState("");
  var interval;

  const getData = async () => {
    const data = await lib.getDataPayment(id);

    setDTran(data.data);

    interval = setInterval(() => {
      var now = new Date().getTime(), exp = new Date(data.data[7]).getTime();

      var distance = exp - now;

      if(distance > 0){
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setVExp(
          <HStack space={1}>
            <Box>
              <Text fontSize={"xs"} fontWeight={"bold"} color={lib.main_color}>{hours.toString().padStart(2, "0")}</Text>
            </Box>
            <Box><Text fontSize={"xs"} fontWeight={"bold"} color={lib.main_color}>:</Text></Box>
            <Box>
              <Text fontSize={"xs"} fontWeight={"bold"} color={lib.main_color}>{minutes.toString().padStart(2, "0")}</Text>
            </Box>
            <Box><Text fontSize={"xs"} fontWeight={"bold"} color={lib.main_color}>:</Text></Box>
            <Box>
              <Text fontSize={"xs"} fontWeight={"bold"} color={lib.main_color}>{seconds.toString().padStart(2, "0")}</Text>
            </Box>
          </HStack>
        );
      }
    }, 1000);
    
    setIsLoad(false);
  }

  useEffect(() => {
    setIsLoad(true);
    getData();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "DetailTransaksi", "");
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(interval);
    };
  }, [])

  return (
    <NativeBaseProvider>
      <Header
        navigation={navigation}
        route={route}
        show_icon={"N"}
        show_text={"Y"}
        header={"Detail Transaksi"}
        bgcolor={lib.main_color}
        txtcolor={lib.white_color}
        txtnotif={cnotif}
        show_back_arrow={"Y"}
      />
      {
        isLoad &&
        <VStack space={2}>
          <VStack px={4} py={3} space={3}>
            <Skeleton h={4} w={"40%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
          </VStack>

          <Divider h={2} bgColor={lib.white_color}></Divider>

          <VStack px={4} py={3} space={3}>
            <Skeleton h={4} w={"40%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
          </VStack>

          <Divider h={2} bgColor={lib.white_color}></Divider>

          <VStack px={4} py={3} space={3}>
            <Skeleton h={4} w={"40%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
            <Divider></Divider>
            <HStack>
              <Box w={"50%"}>
                <Skeleton h={3} w={"90%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Skeleton h={3} w={"50%"} rounded={"lg"} startColor={lib.muted_color} endColor={lib.muted_color_skeleton}></Skeleton>
              </Box>
            </HStack>
          </VStack>
        </VStack> || 
        !isLoad &&
        <VStack space={2}>
          <VStack px={4} py={3} space={3}>
            <HStack alignItems={"center"}>
              <Box w={dTran[5] === "pending" ? "50%" : "100%"}>
                <Text fontSize={"lg"} fontWeight={"bold"}>Transaksi <Text color={dTran[5] === "pending" ? lib.warning_color : dTran[5] === "expired" || dTran[5] === "batal" ? lib.danger_color : lib.success_color}>{dTran[5]}</Text></Text>
              </Box>
              {
                dTran[5] === "pending" &&
                <VStack alignItems={"flex-end"} w={"50%"}>
                  <Text fontSize={"xs"} color={lib.main_color}>selesaikan dalam</Text>
                  {vexp}
                </VStack>
              }
            </HStack>
            {
              dTran[5] === "pending" && dTran[11] !== "" &&
              <HStack alignItems={"center"}>
                <Box w={"40%"}>
                  <Text fontSize={"md"} fontWeight={"medium"}>Virtual Account</Text>
                </Box>
                <Box w={"60%"} alignItems={"flex-end"}>
                  <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })} onPress={() => { lib.copy_clipboard() }}>
                    <HStack alignItems={"center"} space={1}>
                      <Text fontSize={"md"} fontWeight={"medium"}>{dTran[11]}</Text>
                      <Icon as={lib.copy_icon()}></Icon>
                    </HStack>
                  </Pressable>
                </Box>
              </HStack>
            }
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Nomor Invoice</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"}>{dTran[0]}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Tanggal Transaksi</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"}>{dTran[8]}</Text>
              </Box>
            </HStack>
          </VStack>

          <Divider h={2} bgColor={lib.white_color}></Divider>

          <VStack px={4} py={3} space={3}>
            <Box>
              <Text fontSize={"lg"} fontWeight={"bold"}>Detail Produk</Text>
            </Box>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Jenis Membership</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"} fontWeight={"medium"}>{dTran[9]}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Total Tagihan</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"} fontWeight={"medium"}>Rp. {lib.numberFormat(dTran[4])}</Text>
              </Box>
            </HStack>
          </VStack>

          <Divider h={2} bgColor={lib.white_color}></Divider>

          <VStack px={4} py={3} space={3}>
            <Box>
              <Text fontSize={"lg"} fontWeight={"bold"}>Rincian Pembayaran</Text>
            </Box>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Metode Pembayaran</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"} fontWeight={"medium"}>{lib.getPayNm(dTran[6])}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Expired</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"} fontWeight={"medium"}>{dTran[10]}</Text>
              </Box>
            </HStack>
            <Divider></Divider>
            <HStack>
              <Box w={"50%"}>
                <Text fontSize={"sm"} color={lib.muted_color}>Total Pembayaran</Text>
              </Box>
              <Box w={"50%"} alignItems={"flex-end"}>
                <Text fontSize={"sm"} fontWeight={"medium"}>Rp. {lib.numberFormat(dTran[4])}</Text>
              </Box>
            </HStack>
          </VStack>
        </VStack>
      }
    </NativeBaseProvider>
  );
}