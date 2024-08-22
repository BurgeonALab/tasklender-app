import React, { useEffect, useState, useRef } from 'react';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, Input, CheckIcon, Select, Icon, InputGroup, InputLeftAddon } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import * as Notifications from 'expo-notifications';
import CountryFlag from "react-native-country-flag";

export default function RalatAkunScreen({ navigation, route }){
    const [err, setErr] = useState(0);
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const [email, setEmail] = useState(route.params.email);
    const [nama, setNama] = useState(route.params.nama);
    const [phone, setPhone] = useState(route.params.phone);
    const [ngr, setNgr] = useState(route.params.ngr);
    const kodengr = route.params.kodengr;
    const namangr = route.params.namangr;
    const kodetel = route.params.kodetel;
    const [cnotif, setCNotif] = useState(0);
    const [lngr, setLngr] = useState([]);
    const responseListener = useRef();
    // Icon
    const account_icon = lib.account_icon();
    const mail_icon = lib.mail_icon();
    const down_icon = lib.down_icon();

    const editUser = () => {
        setErr(0);
        setIsSave(true);

        if(nama === "" || email === "" || phone === ""){
            setErr(-1);
            setIsSave(false);
        }
        else{
            lib.editUser(email, nama, phone, ngr, route.params.email).then((json) => {
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
        const data = await lib.getAllNgr();
        setLngr(data);
    }

    useEffect(() => {
        getData();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "RalatAkun", "");
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
                        <Text fontWeight={'light'} fontSize={20}>Ubah Data</Text>
                    </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
                show_back_arrow={"Y"}
            />
            <ScrollView>
                <VStack px='30px' py='30px'>
                    <Box mb={3}>
                        <Input
                            InputLeftElement={
                                <Icon
                                as={account_icon}
                                size="6"
                                marginLeft={'4'}
                                color='#1CA3FF'
                                />
                            }
                            _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                            variant="unstyled"
                            w="100%"
                            bg='rgba(28, 163, 255, 0.3)'
                            placeholder="Nama Lengkap"
                            placeholderTextColor='#1CA3FF'
                            onChangeText={(val) => setNama(val)}
                            h={"60"}
                            size="lg"
                            value={nama}
                        />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama akun wajib diisi</Text>
                    </Box>
                    <Box mb={3}>
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
                            value={email}
                        />
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Email wajib diisi</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Nama Email telah terdaftar</Text>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -5 ? styles.d_flex : styles.d_none}>Nama Email tidak valid</Text>
                    </Box>
                    {/* Negara */}
                    <Box mb={3}>
                        <Select
						    InputLeftElement={
							    <CountryFlag
								    isoCode={kodengr == null ? '' : kodengr.toLowerCase()}
									size={18}
									style={{marginLeft: 16}}
								/>
							}
							selectedValue={ngr}
							minWidth="200"
							borderWidth={0}
							bg='rgba(28, 163, 255, 0.3)'
							placeholderTextColor={ngr == null ? '#1CA3FF' : '#000000'}
							onValueChange={(val) => setNgr(val)}
							fontSize={"md"}
							h={"60"}
							placeholder={ngr == null ? 'Pilih Negara' : namangr}
							InputRightElement={
                                <Icon
                                    as={down_icon}
                                    size="6"
                                    color='#1CA3FF'
                                    marginRight={'4'}
                                />
							}
							_selectedItem={{ endIcon: <CheckIcon size="5" color={lib.success_color} />}}
							color={'#000000'}>
							{
							    lngr.map((data) => {
								    return <Select.Item
									    label={
										    <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
											<CountryFlag
											    isoCode={data[3].toLowerCase()}
												size={28}
											/>
											<Text fontSize={'md'} marginLeft={5}>{data[1]}</Text>
											</Box>
										}
										value={data}
										key={data[0]}
										rounded="xl"
									/>;
								    })}
                                    </Select>
                                <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Negara wajib diisi</Text>
                        </Box>
                        {/* No HP */}
                        <Box mb={3}>
					        <InputGroup w={{base: '100%'}}>
							    <InputLeftAddon
								    bg='rgba(28, 163, 255, 1)'
									style={{borderWidth: 0}}
									w='20%'
									children={ngr == null ? '...' : '+'+kodetel}
								/>
								<Input
								    variant="unstyled"
									w='80%'
									bg='rgba(28, 163, 255, 0.3)'
									_focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
									placeholder="Nomor Telepon"
									placeholderTextColor='#1CA3FF'
									onChangeText={(val) => setPhone(val)}
									h={"60"}
                                    value={phone}
									fontSize={"md"}
								/>
							</InputGroup>
                            <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>No HP wajib diisi</Text>
                            <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>No HP telah terdaftar</Text>
                            <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -4 ? styles.d_flex : styles.d_none}>No HP tidak valid</Text>
                        </Box>
                    <Box mt='30px' w="50%" style={{ alignSelf: "center" }}>
                        <Button bgColor={"#1CA3FF"} size="lg" p={5} isLoading={isSave} onPress={editUser}>
                            <Text fontSize={'md'} color={'#FFFFFF'} fontWeight={'bold'}>Simpan</Text>
                        </Button>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
