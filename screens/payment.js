import React, { useState, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, ScrollView, HStack, Switch, Divider, Icon } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function PaymentScreen({ navigation, route }) {
  const lib = new CFunc();
  const id = route.params.id;
  const [isSub, setIsSub] = useState(true);
  const [isLoad, setIsLoad] = useState(true);
  const [cnotif, setCNotif] = useState(0);
  const responseListener = useRef();

  const refresh = React.useCallback(async () => {
    setIsLoad(true);
    getData();
  }, []);

  const getData = async () => {
    const email = await lib.getUserID();
    
    setIsLoad(false);
  }
  
  const toDtlPayment = (mpay) => {
    navigation.navigate('detailPayment', {
      mship : id,
      mpay : mpay,
      isSub : isSub,
      onGoBack : () => refresh(),
    })
  }

  useEffect(() => {
    setIsLoad(true);
    getData();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "Payment", "");
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
        header={"Pembayaran"}
        bgcolor={lib.main_color}
        txtcolor={lib.white_color}
        txtnotif={cnotif}
        show_back_arrow={"Y"}
      />
      <VStack px={4} py={1} space={2}>
        <HStack mt={2} mb={2}>
          <Box w={"80%"}>
            <Text fontSize={"xl"} fontWeight={"medium"}>Berlangganan</Text>
          </Box>
          <Box w={"20%"} alignItems={"flex-end"}>
            <Switch size={"sm"} isChecked={isSub} onToggle={() => { setIsSub(!isSub) }}/>
          </Box>
        </HStack>
        <Divider></Divider>
      </VStack>
      <HStack mt={3} px={4}>
        <Box w="70%">
            <Text color={lib.muted_color} fontSize={"lg"} fontWeight={"medium"} textTransform={"uppercase"} alignItems={"center"}>Metode Pembayaran</Text>
        </Box>
      </HStack>
      <ScrollView _contentContainerStyle={{ flexGrow: 1 }} my={2} px={5}>
        {
          !isSub &&
          <VStack space={2} mt={2}>
            <Box>
              <Text fontWeight={"bold"} fontSize={"sm"}>Transfer Virtual Account</Text>
            </Box>
  
            <Pressable onPress={() => { toDtlPayment("BCA_VA") }}>
              <HStack alignItems={"center"}>
                <Box w="18%">
                  {lib.logo_bca()}
                </Box>
                <Box w="75%" pl={4}>
                  <Text fontSize={"lg"}>BCA Virtual Account</Text>
                </Box>
                <Box>
                  <Icon as={lib.right_arrow_icon()} size={7}></Icon>
                </Box>
              </HStack>
              <Divider></Divider>
            </Pressable>
  
            <Pressable onPress={() => { toDtlPayment("BRI_VA") }}>
              <HStack alignItems={"center"}>
                <Box w="18%">
                  {lib.logo_bri()}
                </Box>
                <Box w="75%" pl={4}>
                  <Text fontSize={"lg"}>BRI Virtual Account</Text>
                </Box>
                <Box>
                  <Icon as={lib.right_arrow_icon()} size={7}></Icon>
                </Box>
              </HStack>
              <Divider></Divider>
            </Pressable>
  
            <Pressable onPress={() => { toDtlPayment("BNI_VA") }}>
              <HStack alignItems={"center"}>
                <Box w="18%">
                  {lib.logo_bni()}
                </Box>
                <Box w="75%" pl={4}>
                  <Text fontSize={"lg"}>BNI Virtual Account</Text>
                </Box>
                <Box>
                  <Icon as={lib.right_arrow_icon()} size={7}></Icon>
                </Box>
              </HStack>
              <Divider></Divider>
            </Pressable>
  
            <Pressable onPress={() => { toDtlPayment("MNDR_VA") }}>
              <HStack alignItems={"center"}>
                <Box w="18%">
                  {lib.logo_mandiri()}
                </Box>
                <Box w="75%" pl={4}>
                  <Text fontSize={"lg"}>Mandiri Virtual Account</Text>
                </Box>
                <Box>
                  <Icon as={lib.right_arrow_icon()} size={7}></Icon>
                </Box>
              </HStack>
              <Divider></Divider>
            </Pressable>
  
            <Pressable onPress={() => { toDtlPayment("PRMT_VA") }}>
              <HStack alignItems={"center"}>
                <Box w="18%">
                  {lib.logo_permata()}
                </Box>
                <Box w="75%" pl={4}>
                  <Text fontSize={"lg"}>Permata Virtual Account</Text>
                </Box>
                <Box>
                  <Icon as={lib.right_arrow_icon()} size={7}></Icon>
                </Box>
              </HStack>
              <Divider></Divider>
            </Pressable>
          </VStack>
        }

        <VStack space={2} mt={2}>
          <Box>
            <Text fontWeight={"bold"} fontSize={"sm"}>Pembayaran Instant</Text>
          </Box>

          <Pressable onPress={() => { toDtlPayment("GOPAY") }}>
            <HStack alignItems={"center"}>
              <Box w="18%">
                {lib.logo_gopay()}
              </Box>
              <Box w="75%" pl={4}>
                <Text fontSize={"lg"}>Gopay</Text>
              </Box>
              <Box>
                <Icon as={lib.right_arrow_icon()} size={7}></Icon>
              </Box>
            </HStack>
            <Divider></Divider>
          </Pressable>
        </VStack>

        <VStack space={2} mt={2}>
          <Box>
            <Text fontWeight={"bold"} fontSize={"sm"}>Kartu Kredit</Text>
          </Box>

          <Pressable onPress={() => { toDtlPayment("CC") }}>
            <HStack alignItems={"center"}>
              <Box w="18%">
                {lib.credit_card_icon()}
              </Box>
              <Box w="75%" pl={4}>
                <Text fontSize={"lg"}>Kartu Kredit</Text>
              </Box>
              <Box>
                <Icon as={lib.right_arrow_icon()} size={7}></Icon>
              </Box>
            </HStack>
            <Divider></Divider>
          </Pressable>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}