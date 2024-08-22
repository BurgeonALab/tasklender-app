import React, { useState } from "react";
import { NativeBaseProvider, Image, Center, VStack, Box, Text, Button, ScrollView, Pressable as NBPressable, Container, Input, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cfunc from '../constants/clsfunction';
import styles from '../constants/index';

//ERR
// -1 = REQUIRED
// -2 = EMAIL INVALID
// -3 = PASS INVALID

export default function Login({ navigation }) {
  const lib = new cfunc();
  const [showPass, setShowPass] = useState(false);
  const [pass_icon, setPass_icon] = useState(lib.hpass_icon());
  const [err, setErr] = useState(0);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  // Icon
  const lock_icon = lib.pass_icon();
  const mail_icon = lib.mail_icon();

  const viewPass = () => {
    if (showPass) {
      setPass_icon(lib.hpass_icon())
      setShowPass(false);
    }
    else {
      setPass_icon(lib.vpass_icon())
      setShowPass(true);
    }
  }

  const toLupaPass = () => {
    navigation.navigate('lupaPass');
  }

  const toRegister = () => {
    navigation.navigate('register');
  }

  const login = () => {
    setIsLoad(true);
    setErr(0);

    if (email === "" || pass === "") {
      setErr(-1);
      setIsLoad(false);
    }
    else {
      lib.login(email, pass).then((err) => {
        if (parseInt(err) !== 0) {
          setErr(err);
          setIsLoad(false);
        }
        else {
          AsyncStorage.setItem('@techno_lender_user', email.toLowerCase());
          lib.getUserToken().then((token) => {
              if(token !== undefined && token !== null){
                lib.updUserToken(email, token).then(() => {
                  navigation.replace("root");
                })
              }
              else{
                navigation.replace("root");
              }
          })
        }
      })
    }
  }

  return (
    <NativeBaseProvider>
      <ScrollView _contentContainerStyle={{ flexGrow: 1 }}>
        <Center>
          <Container w="100%" marginTop={100}>
            <Image source={require('../assets/icon-tasklender.png')} alt='Tasklender logo' style={styles.logo_sm} />
            <Text fontSize={"32"} textAlign={"left"} color={styles.txt_black} fontWeight={"bold"}>Halo</Text>
            <Text fontSize={"32"} textAlign={"left"} color={styles.txt_black} fontWeight={"light"}>Login Sekarang</Text>
          </Container>
        </Center>
        <Center>
          <Container w="100%" marginTop={30}>
            <VStack space={"3"} w="100%">
              <Text fontSize={16}>Sudah punya akun?</Text>
              <Box>
                <Input
                  InputLeftElement={
                    <Icon
                      as={mail_icon}
                      size="6"
                      marginLeft={'4'}
                      color='#1CA3FF'
                    />
                  }
                  _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                  variant="unstyled"
                  w="100%"
                  bg='rgba(28, 163, 255, 0.3)'
                  placeholder="Email"
                  placeholderTextColor='#1CA3FF'
                  onChangeText={(val) => setEmail(val)}
                  h={"60"}
                  size="lg"
                />
                <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Email wajib diisi!</Text>
                <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Email tidak valid</Text>
              </Box>

              <Box mt={3}>
                <Input
                  InputLeftElement={
                    <Icon
                      as={lock_icon}
                      size="6"
                      color='#1CA3FF'
                      marginLeft={'4'}
                    />
                  }
                  bg='rgba(28, 163, 255, 0.3)'
                  type={showPass ? "text" : "password"}
                  variant="unstyled"
                  w="100%"
                  _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                  placeholder="Password"
                  placeholderTextColor='#1CA3FF'
                  onChangeText={(val) => setPass(val)}
                  h={"60"}
                  size="lg"
                  InputRightElement={
                    <Button
                      variant="ghost"
                      padding={'4'}
                      onPress={viewPass}
                    >
                      <Icon
                        as={pass_icon}
                        size="6"
                        color='#1CA3FF'
                      />
                    </Button>
                  }
                />
                <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Password wajib diisi</Text>
                <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>Password salah</Text>

                <NBPressable onPress={toLupaPass} alignItems="flex-end" w="45%" ml="auto" mt={3}>
                  <Text fontSize={16} fontWeight={"bold"} color={styles.txt_black}>Lupa Password?</Text>
                </NBPressable>
              </Box>

              <Center flex={1} marginTop={50}>
                <VStack space={2} w="100%">
                  <Box w="50%" style={{ alignSelf: "center" }}>
                    <Button
                      size={"lg"}
                      p={5}
                      style={styles.tsk_btn_main}
                      isLoading={isLoad}
                      onPress={() => { login(); }}
                      rounded={"sm"}
                    >
                      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>Login</Text>
                    </Button>
                  </Box>
                  <NBPressable onPress={toRegister} alignItems="center" w="100%" ml="auto" mt={3}>
                    <Text fontSize={16} color={styles.txt_black}>Belum punya akun?<Text color='#1CA3FF' fontWeight={"bold"}> Daftar Sekarang</Text></Text>
                  </NBPressable>
                </VStack>
              </Center>
            </VStack>
          </Container>
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
}