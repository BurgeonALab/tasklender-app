import React, { useEffect, useState, useRef } from 'react';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, Input, Icon } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function GantiPasswordScreen({ navigation, route }){
    const [err, setErr] = useState(0);
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const [cnotif, setCNotif] = useState(0);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [npass, setNPass] = useState("");
    const [cpass, setCPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showNPass, setShowNPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [pass_icon, setPass_icon] = useState(lib.hpass_icon());
    const [cpass_icon, setCPass_icon] = useState(lib.hpass_icon());
    const [npass_icon, setNPass_icon] = useState(lib.hpass_icon());
    const responseListener = useRef();

    const lock_icon = lib.pass_icon();

    const viewPass = (x) => {
        if (x === "PASS") {
            if (showPass) {
                setPass_icon(lib.hpass_icon());
                setShowPass(false);
            }
            else {
                setPass_icon(lib.vpass_icon());
                setShowPass(true);
            }
        }
        else if (x === "CPASS") {
            if (showCPass) {
                setCPass_icon(lib.hpass_icon());
                setShowCPass(false);
            }
            else {
                setCPass_icon(lib.vpass_icon());
                setShowCPass(true);
            }
        }
        else if (x === "NPASS") {
            if (showNPass) {
                setNPass_icon(lib.hpass_icon());
                setShowNPass(false);
            }
            else {
                setNPass_icon(lib.vpass_icon());
                setShowNPass(true);
            }
        }
    }

    const gantiPass = () => {
        setErr(0);
        setIsSave(true);

        if(pass === "" || cpass === "" || npass === ""){
            setErr(-1);
            setIsSave(false);
        }
        else if(cpass !== npass){
            setErr(-2);
            setIsSave(false);
        }
        else{
            lib.gantiPass(email, pass, cpass, npass).then((json) => {
                if(parseInt(json.err[0]) !== 0){
                    setErr(json.err[0]);
                    setIsSave(false);
                }
                else{
                    route.params.onGoBack();
                    navigation.goBack();
                }
            })
        }
    }

    const getData = async () => {
        const email = await lib.getUserID();
        setEmail(email);
    }
    
    useEffect(() => {
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "GantiPassword", "");
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
                header={
                    <Box>
                        <Text fontWeight={'light'} fontSize={20}>Ganti Password</Text>
                    </Box>
                }
                show_back_arrow={"Y"}
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
            />
            <ScrollView>
                <VStack py={'30px'} px={'30px'}>
                    <Box>
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
                            mb={3}
                            _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                            placeholder="Password Lama"
                            placeholderTextColor='#1CA3FF'
                            onChangeText={(val) => setPass(val)}
                            h={"60"}
                            size="lg"
                            InputRightElement={
                                <Button
                                variant="ghost"
                                padding={'4'}
                                onPress={() => { viewPass("PASS"); }}
                                >
                                <Icon
                                    as={pass_icon}
                                    size="6"
                                    color='#1CA3FF'
                                />
                                </Button>
                            }
                        />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Password lama wajib diisi!</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Email tidak valid</Text>
                    </Box>
                    <Box>
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
                            mb={3}
                            _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                            placeholder="Password Baru"
                            placeholderTextColor='#1CA3FF'
                            onChangeText={(val) => setNPass(val)}
                            h={"60"}
                            size="lg"
                            InputRightElement={
                                <Button
                                variant="ghost"
                                padding={'4'}
                                onPress={() => { viewPass("NPASS"); }}
                                >
                                <Icon
                                    as={npass_icon}
                                    size="6"
                                    color='#1CA3FF'
                                />
                                </Button>
                            }
                        />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Password baru wajib diisi!</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Password minimal 6 digit</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>Password baru dan konfirmasi password tidak sesuai</Text>
                    </Box>
                    <Box>
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
                            placeholder="Konfirmasi Password Baru"
                            placeholderTextColor='#1CA3FF'
                            onChangeText={(val) => setCPass(val)}
                            h={"60"}
                            size="lg"
                            InputRightElement={
                                <Button
                                variant="ghost"
                                padding={'4'}
                                onPress={() => { viewPass("CPASS"); }}
                                >
                                <Icon
                                    as={cpass_icon}
                                    size="6"
                                    color='#1CA3FF'
                                />
                                </Button>
                            }
                        />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Konfirmasi password wajib diisi!</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>Konfirmasi password tidak sesuai dengan password baru</Text>
                    </Box>
                    <Box mt={30} style={{display: 'flex', alignItems: 'center'}}>
                        <Button style={styles.tsk_btn_main} w='50%' bgColor={"primary.600"} size="lg" p={5} isLoading={isSave} onPress={gantiPass}>Ganti</Button>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
