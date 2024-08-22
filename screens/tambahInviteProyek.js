import React, { useEffect, useState, useRef } from 'react';
import { NativeBaseProvider, VStack, Box, Text, Button, Input, Toast, Icon } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';

export default function TambahInviteProyekScreen({ navigation, route }){
    const id = route.params.id;
    const nama = route.params.nama;
    const [err, setErr] = useState(0);
    const lib = new CFunc();
    const lcolor = lib.list_color_hex_simple();
    const [email, setEmail] = useState();
    const [memail, setMEmail] = useState();
    const [isSave, setIsSave] = useState(false);
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();
    // Icon
    const mail_icon = lib.mail_icon();
    const invEMailPyk = () => {
        setErr(0);
        setIsSave(true);
        lib.invEmail(id, memail).then((json) => {
            if(parseInt(json.err[0]) !== 0){
                setErr(json.err[0]);
            }
            else{
                Toast.show({
                    render: () => {
                        return <Box bgColor={lib.success_color} px="2" py="1" rounded="lg" mb={5}>
                            Email berhasil di undang
                        </Box>;
                    },
                    placement: "bottom"
                });
                setMEmail("");
            }
            setIsSave(false);
        })
    }

    const getData = async() => {
        const email = await lib.getUserID();
        const notif = await lib.getCNotif(email);
        setCNotif(notif.data.length + notif.dgroup.length);
        setEmail(email);
    }

    useEffect(() => {
        getData();
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "TambahInviteProyek", "");
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
                      <Text fontWeight={'light'} fontSize={20}>{nama}</Text>
                      <Text fontWeight={'bold'} fontSize={20}>Undang melalui Email</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <VStack px={'30px'} py={'30px'}>
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
                        placeholder="Ketikkan email anda"
                        w="100%"
                        rounded={'sm'}
                        bg='rgba(28, 163, 255, 0.3)'
                        h={60}
                        size="lg"
                        fontSize={"md"}
                        _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                        variant="unstyled"
                        placeholderTextColor='#1CA3FF'
                        onChangeText={(val) => setMEmail(val)} value={memail}
                    >
                    </Input>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Email tidak valid</Text>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Email tidak terdaftar</Text>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>Email sudah diundang ke proyek</Text>
                </Box>
                <Box style={{display: 'flex', alignItems: 'center'}} mt={30}>
                    <Button w='50%' bg='rgba(28, 163, 255, 1)' size="lg" p={5} isLoading={isSave} onPress={invEMailPyk}>
                        <Text fontSize={'md'} fontWeight={'bold'} color={'#FFFFFF'}>Undang</Text>
                    </Button>
                </Box>
            </VStack>
        </NativeBaseProvider>
    );
}
