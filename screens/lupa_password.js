import React, { useState } from 'react';
import { NativeBaseProvider, Center, Box, VStack, Input, Icon, Button, Text, ScrollView, Container} from 'native-base';
import styles from '../constants/index';
import cfunc from '../constants/clsfunction';

//ERR
// -1 = REQUIRED
// -2 = EMAIL INVALID

export default function LupaPass({ navigation }) {
    const lib = new cfunc();
    const [err, setErr] = useState(0);
    const [email, setEmail] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [scsReset, setScsReset] = useState(false);
    // Icon
    const mail_icon = lib.mail_icon();

    const resetPass = () => {
        setErr(0);
        setIsLoad(true);

        if(email === ""){
            setErr(-1);
            setIsLoad(false);
        }
        else{
            lib.resetPass(email).then((err) => {
                if(parseInt(err) !== 0){
                    setErr(err);
                    setIsLoad(false);
                }
                else{
                    setScsReset(true);
                    setIsLoad(false);
                }
            })
        }
    }

    const toLogin = () => {
        navigation.goBack();
    }
    
    return (
        <NativeBaseProvider>
            <ScrollView _contentContainerStyle={{ flexGrow: 1 }}>
                <Box flex={1} style={scsReset ? styles.d_none : styles.d_flex} marginTop={100}>
                    <Center>
                        <Container w="100%">
                            <VStack space={4} w="100%">
                                <Text style={styles.txt_black} fontSize={20} fontWeight={'bold'}>Reset Password</Text>
                                <Text style={styles.txt_black} fontSize={16}>Silahkan masukkan email akun anda dan kami akan mengirimkan email berisi instruksi untuk me-reset password anda.</Text>
                                <Box marginTop={30}>
                                    <Input
                                        InputLeftElement={
                                            <Icon
                                            as={mail_icon}
                                            size="6"
                                            color='#1CA3FF'
                                            marginLeft={'4'}
                                            />
                                        }
                                        bg='rgba(28, 163, 255, 0.3)'
                                        variant="unstyled"
                                        w="100%"
                                        _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                                        placeholder="Email Anda"
                                        placeholderTextColor='#1CA3FF'
                                        h={"60"}
                                        size="lg"
                                        onChangeText={(val) => setEmail(val)}>
                                    </Input>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Email wajib diisi</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Email tidak valid</Text>
                                </Box>
                                <Box marginTop={50} style={{ display:'flex', alignItems: 'center' }}>
                                    <Button
                                        size={"lg"}
                                        p={5}
                                        style={styles.tsk_btn_main}
                                        onPress={() => { resetPass(); }}
                                        rounded={"sm"}
                                        w={"50%"}
                                        isLoading={isLoad}
                                    >
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>
                                            Kirim
                                        </Text>
                                    </Button>
                                </Box>
                            </VStack>
                        </Container>
                    </Center>
                </Box>
                <Center style={!scsReset ? styles.d_none : styles.d_flex} marginTop={100}>
                    <Container w="100%">
                        <VStack space={"2"} w="100%">
                            <Text fontWeight="bold" fontSize={20} style={styles.txt_black} textAlign="left">Cek email</Text>
                            <Text fontSize={16} style={styles.txt_black}textAlign="left">Email berhasil dikirim, cek email anda dan ikuti instruksi pada email untuk me-reset password anda</Text>
                            <Box w="60%" style={{ alignSelf: "center" }} marginTop={30}>
                                <Button
                                    size="lg"
                                    p={5}
                                    style={styles.tsk_btn_main}
                                    onPress={toLogin}
                                    rounded={"sm"}
                                >
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>Login Sekarang</Text>
                                </Button>
                            </Box>
                        </VStack>
                    </Container>
                </Center>
            </ScrollView>
        </NativeBaseProvider>
    );
}