import React, { useState, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, ScrollView, HStack, Button, Select, Toast, Input } from 'native-base';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function DetailPaymentScreen({ navigation, route }) {
  const lib = new CFunc();
  const mship = route.params.mship;
  const mpay = route.params.mpay;
  const isSub = route.params.isSub;
  const curYear = new Date().getFullYear();
  const nmPay = lib.getPayNm(route.params.mpay);
  const [email, setEmail] = useState("");
  const [cnotif, setCNotif] = useState(0);
  const [isLoad, setIsLoad] = useState("");
  const [nmMShip, setNmMShip] = useState("");
  const [hMShip, setHMShip] = useState(0);
  const [duser, setDUser] = useState([]);
  const responseListener = useRef();
  const [err, setErr] = useState(0);
  const [hp, setHp] = useState("");
  const [startYear, setStartYear] = useState(curYear - 3);
  const [endYear, setEndYear] = useState(curYear + 10);
  const [ccYear, setCCYear] = useState("YY");
  const [ccMonth, setCCMonth] = useState("MM");
  const lyear = lib.getListYear(startYear, endYear);
  const lmonth = lib.getListMonth();
  const [cvv, setCVV] = useState("");
  const [ccNum, setCCNum] = useState("");
  const [statGopay, setStatGopay] = useState(false);
  const [isSave, setIsSave] = useState(false);

  const getData = async () => {
    const email = await lib.getUserID();
    const data = await lib.getMShipID(mship);
    const dtuser = await lib.getDataUser(email);

    setEmail(email);
    setNmMShip(data.data[1]);
    setHMShip(data.data[2]);
    setDUser(dtuser.data);
    setHp(dtuser.data[20])

    if(mpay === "GOPAY"){
      const dgopay = await lib.getMTGopayStat(email);
      
      setStatGopay(dgopay.stat[0]);
    }
    
    setIsLoad(false);
  }

  const conPay = async () => {
    setErr(0);
    setIsSave(true);

    if((mpay === "GOPAY" && isSub && hp === "") || (mpay === "CC" && (ccMonth === "" || ccYear === "" || cvv === "" || ccNum === ""))){
      setErr(-1);
      setIsSave(false);
    }
    else{
      lib.sendPayment(email, mship, mpay, ccNum, ccYear, ccMonth, cvv, hp, isSub).then((json) => {
        console.log(json);
        if(parseInt(json.err[0]) !== 0){
          setErr(json.err[0]);
        }
        else if(parseInt(json.err2[0]) === -1){
          setStatGopay(false);
        }
        else if(parseInt(json.err2[0]) === -2){
          Toast.show({
            render: () => {
              return  <Box bgColor={lib.danger_color} px="2" py="1" rounded="lg" mb={5}>
                        <Text>Transaksi timed out, silahkan coba beberapa saat lagi</Text>
                      </Box>;
            },
            placement: "bottom"
          });
        }
        else if(parseInt(json.err2[0]) === -3){
          Toast.show({
            render: () => {
              return  <Box bgColor={lib.danger_color} px="2" py="1" rounded="lg" mb={5}>
                        <Text>{json.msg}</Text>
                      </Box>;
            },
            placement: "bottom"
          });
        }
        else{
          if(mpay === "GOPAY" && json.link[0] !== ""){
            Linking.openURL(json.link[0]);
          }

          navigation.reset({
            index : 2,
            routes : [
              { name : 'root' },
              { name : 'daftarTransaksi' },
              { name : 'detailTransaksi', params : { id : json.id[0] } },
            ]
          })
        }
        
        setIsSave(false);
      })
    }
  }

  useEffect(() => {
    setIsLoad(true);
    getData();
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      lib.navigate(response, "DetailPayment", "");
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
        header={"Konfirmasi Pembayaran"}
        bgcolor={lib.main_color}
        txtcolor={lib.white_color}
        txtnotif={cnotif}
        show_back_arrow={"Y"}
      />
      <ScrollView _contentContainerStyle={{ flexGrow: 1 }} my={2} px={5}>
        <VStack space={4}>
          <VStack>
            <Box>
              <Text fontSize={"sm"}>Membership</Text>
            </Box>
            <HStack px={2} alignItems={"center"}>
              <Box w={"60%"}>
                <Text fontSize={"md"} fontWeight={"medium"}>{nmMShip}</Text>
              </Box>
              <Box w={"40%"}>
                <Text fontSize={"md"} fontWeight={"medium"} textAlign={"right"}>Rp. {lib.numberFormat(hMShip)}</Text>
              </Box>
            </HStack>
          </VStack>
          <VStack>
            <Box>
              <Text fontSize={"sm"}>Metode Pembayaran</Text>
            </Box>
            <Box px={2}>
              <Text fontSize={"md"} fontWeight={"medium"}>{nmPay}</Text>
            </Box>
          </VStack>
          {
            //GOPAY
            mpay === "GOPAY" && isSub &&
            <VStack>
              <HStack>
                <Text fontSize={"sm"}>Nomor Telepon</Text>
                {
                  duser[18] !== "" && statGopay && 
                  <Text fontSize={"sm"} fontWeight={"medium"} color={lib.success_color}>(Terhubung)</Text> ||
                  duser[18] !== "" && !statGopay && 
                  <Text fontSize={"sm"} fontWeight={"medium"} color={lib.danger_color}>(Expired)</Text>
                }
              </HStack>
              <Box px={2}>
                <HStack alignItems={"center"} borderBottomWidth={1} px={1} borderColor={parseInt(err) === -1 ? lib.danger_color : lib.main_color}>
                  <Box w={8}>
                    <Text fontSize={"sm"}>+ {duser[19]}</Text>
                  </Box>
                  <Box w={"90%"}>
                    <Input variant={"unstyled"} w="100%" placeholder="" placeholderTextColor={lib.main_color} onChangeText={(val) => setHp(val)} height={"8"} fontSize={"sm"} isReadOnly={duser[18] !== "" && statGopay ? true : false} value={hp}></Input>
                  </Box>
                </HStack>
                {
                  err === -1 &&
                  <Text fontSize={"xs"} color={lib.danger_color}> Nomor Telepon wajib diisi</Text> ||
                  err === -2 &&
                  <Text fontSize={"xs"} color={lib.danger_color}> Nomor Telepon tidak terdaftar</Text>
                }
              </Box>
            </VStack>

          }
          {
            //CC
            mpay === "CC" &&
            <VStack space={3}>
              <VStack>
                <Box>
                  <Text fontSize={"sm"}>Nomor Kartu</Text>
                </Box>
                <Box px={2}>
                  <Input variant={"underlined"} w="100%" placeholder="" placeholderTextColor={lib.main_color} onChangeText={(val) => setCCNum(val)} height={"8"} fontSize={"sm"}></Input>
                  {
                    err === -1 &&
                    <Text fontSize={"xs"} color={lib.danger_color}> Nomor Kartu wajib diisi</Text>
                  }
                </Box>
              </VStack>
              <HStack>
                <VStack w={"70%"}>
                  <Box>
                    <Text fontSize={"sm"}>Tgl Expired</Text>
                  </Box>
                  <Box px={2}>
                    <HStack alignItems={"center"}>
                      <Box w="40%">
                        <Select onValueChange={(val) => {setCCMonth(val)}} dropdownIcon={() => {}}>
                          {
                            lmonth.map((data) => {
                              return <Select.Item label={data[1]} value={data[0]} key={data[0]} />
                            })
                          }
                        </Select>
                      </Box>
                      <Box w={"4"}>
                          <Text textAlign={"center"}>/</Text>
                      </Box>
                      <Box w="30%">
                        <Select onValueChange={(val) => {setCCYear(val)}} dropdownIcon={() => {}}>
                          {
                            lyear.map((data) => {
                              return <Select.Item label={data} value={data} key={data} />
                            })
                          }
                        </Select>
                      </Box>
                    </HStack>
                    {
                      err === -1 &&
                      <Text fontSize={"xs"} color={lib.danger_color}> Tgl Expired wajib diisi</Text>
                    }
                  </Box>
                </VStack>
                <VStack w={"30%"} pl={2}>
                  <Box>
                    <Text fontSize={"sm"}>CVV</Text>
                  </Box>
                  <Box>
                    <Input maxLength={3} onChangeText={(val) => {setCVV(val)}}></Input>
                    {
                      err === -1 &&
                      <Text fontSize={"xs"} color={lib.danger_color}> CVV wajib diisi</Text>
                    }
                  </Box>
                </VStack>
              </HStack>
            </VStack>
          }
        </VStack>
      </ScrollView>
      <Box pt={1} pb={3} px={4}>
        <Button onPress={() => {conPay()}} isLoading={isSave}>Konfirmasi Pembayaran</Button>
      </Box>
    </NativeBaseProvider>
  );
}