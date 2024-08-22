import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Image, Center, VStack, Box, Text, Button, ScrollView, Pressable as NBPressable, Select, Container, Input, Icon, CheckIcon, InputGroup, InputLeftAddon } from 'native-base';
import cfunc from '../constants/clsfunction';
import styles from '../constants/index';
import CountryFlag from "react-native-country-flag";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

//ERR
// -1 = REQUIRED
// -2 = REGISTERED EMAIL
// -3 = MINIMAL PASS
// -4 = PASS != CPASS
// -5 = EMAIL INVALID
// -6 = NGR NOT FOUND => ERR SERVER

export default function Register({ navigation }) {
    const lib = new cfunc();
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [pass_icon, setPass_icon] = useState(lib.hpass_icon());
    const [cpass_icon, setCPass_icon] = useState(lib.hpass_icon());
    const [err, setErr] = useState(0);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [cpass, setCPass] = useState("");
    const [ngr, setNgr] = useState("");
    const [hp, setHP] = useState("");
    const [nama, setNama] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [scsRegis, setScsRegis] = useState(false);
    const [lngr, setLngr] = useState([]);
    // Icon
    const account_icon = lib.account_icon();
	const mail_icon = lib.mail_icon();
	const lock_icon = lib.pass_icon();
	const down_icon = lib.down_icon();

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
    }

	const [registerShow, setRegisterShow] = useState(true);
	const CELL_COUNT = 6;
	const [value, setValue] = useState('');
	const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

    const regis = () => {
        setIsLoad(true);
        setErr(0);

        if(email === "" || pass === "" || cpass === "" || ngr === "" || hp === "" || nama === ""){
            setErr(-1);
            setIsLoad(false);
        }
        else if(pass.length < 6){
            setErr(-3);
            setIsLoad(false);
        }
        else if(pass !== cpass){
            setErr(-4);
            setIsLoad(false);
        }
        else{
            lib.register(email, pass, cpass, ngr, hp, nama).then((err) => {
                if(parseInt(err) !== 0){
                    setErr(err);
                    setIsLoad(false);
					// Temporary
					setRegisterShow(!registerShow);
                }
                else{
                    setScsRegis(true);
                    setIsLoad(false);
                }
            })
        }
    }

	const regisToLogin = () => {
		navigation.replace("root");
	}

	const verifToLogin = () => {
		navigation.replace("root");
	}

    const toLogin = () => {
        navigation.goBack();
    }

    const getNgr = async () => {
        const data = await lib.getAllNgr();
        setLngr(data);
    }

    useEffect(() => {
        getNgr();
    }, []);

    return (
        <NativeBaseProvider>
            <ScrollView _contentContainerStyle={{ flexGrow: 1 }}>
                <Box flex={1} style={scsRegis ? styles.d_none : styles.d_flex} marginTop={100}>
                    <Center>
						{registerShow ? (
                        <Container w="100%">
                            <Image source={require('../assets/icon-tasklender.png')} alt='Tasklender logo' style={styles.logo_sm} />
                            <Text fontSize={"32"} textAlign={"left"} color={styles.txt_black} fontWeight={"bold"}>Daftar</Text>
                            <Text fontSize={"32"} textAlign={"left"} color={styles.txt_black} fontWeight={"light"}>Akun Baru</Text>
                        </Container>
						) :
						<Container w="100%">
                            <Text fontSize={"20"} textAlign={"left"} color={styles.txt_black} fontWeight={"bold"} marginBottom="20px">Masukkan Kode OTP</Text>
                            <Text fontSize={"16"} textAlign={"left"} color={styles.txt_black}>Kami telah mengirimkan kode OTP di email anda <Text fontWeight={'bold'}>{email}</Text>, agar pendaftaran akun dapat diselesaikan. Isikan kode OTP di kolom bawah ini.</Text>
                        </Container>
						}
                    </Center>
                    <Center py={4}>
                        <Container w="100%" marginTop={30}>
						{registerShow ? (
                            <VStack space={"4"} w="100%">
                                {/* Nama Lengkap */}
                                <Box>
                                    <Input
                                        InputLeftElement={
                                            <Icon
                                                as={account_icon}
                                                size="6"
                                                color='#1CA3FF'
                                                marginLeft={'4'}
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
										size={'lg'}
                                    />
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama wajib diisi</Text>
                                </Box>
                                {/* Email */}
                                <Box>
                                    <Input
										InputLeftElement={
											<Icon
												as={mail_icon}
												size="6"
												color='#1CA3FF'
												marginLeft={'4'}
											/>
										}
										variant="unstyled"
										w="100%"
										_focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
										bg='rgba(28, 163, 255, 0.3)'
										placeholder="Email"
										placeholderTextColor='#1CA3FF'
										onChangeText={(val) => setEmail(val)}
										h={"60"}
										size={'lg'}
									/>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Email wajib diisi</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -2 ? styles.d_flex : styles.d_none}>Email sudah terdaftar</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -5 ? styles.d_flex : styles.d_none}>Email tidak valid</Text>
                                </Box>
                                {/* Password */}
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
									type={showPass ? "text" : "password"} variant="unstyled"
									w="100%"
									placeholder="Password"
									_focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
									bg='rgba(28, 163, 255, 0.3)'
									placeholderTextColor={'#1CA3FF'}
									onChangeText={(val) => setPass(val)}
									h={"60"}
									size={'lg'}
									InputRightElement={
										<Button
											variant="ghost"
											padding={4}
											onPress={() => { viewPass("PASS"); }}>
											<Icon
												as={pass_icon}
												size="6"
												color={'#1CA3FF'}
											/>
										</Button>
									}
									/>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Password wajib diisi</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -3 ? styles.d_flex : styles.d_none}>Password minimal 6 huruf</Text>
                                </Box>
                                {/* Konfirmasi Password */}
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
										type={showCPass ? "text" : "password"} variant="unstyled"
										w="100%"
										placeholder="Konfirmasi Password"
										_focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
										bg='rgba(28, 163, 255, 0.3)'
										placeholderTextColor={'#1CA3FF'}
										onChangeText={(val) => setCPass(val)}
										h={"60"}
										size={'lg'}
										InputRightElement={
											<Button
												variant="ghost"
												padding={4}
												onPress={() => { viewPass("PASS"); }}>
												<Icon
													as={cpass_icon}
													size="6"
													color={'#1CA3FF'}
												/>
											</Button>
										}>
									</Input>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Konfirmasi Password wajib diisi</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -4 ? styles.d_flex : styles.d_none}>Password tidak cocok</Text>
                                </Box>
                                {/* Negara */}
                                <Box>
                                    <Select
										InputLeftElement={
											<CountryFlag
												isoCode={ngr[0] == null ? '' : ngr[3].toLowerCase()}
												size={18}
												style={{marginLeft: 16}}
											/>
										}
										selectedValue={ngr[0]}
										minWidth="200"
										borderWidth={0}
										bg='rgba(28, 163, 255, 0.3)'
										placeholderTextColor={ngr[0] == null ? '#1CA3FF' : '#000000'}
										onValueChange={(val) => setNgr(val)}
										fontSize={"md"}
										h={"60"}
										placeholder={ngr[0] == null ? 'Pilih Negara' : ngr[1]}
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
												})
											}
                                    </Select>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Negara wajib diisi</Text>
                                </Box>
                                {/* No HP */}
                                <Box>
									<InputGroup w={{base: '100%'}}>
										<InputLeftAddon
											bg='rgba(28, 163, 255, 1)'
											style={{borderWidth: 0}}
											w='20%'
											children={ngr[0] == null ? '...' : '+'+ngr[2]}
										/>
										<Input
											variant="unstyled"
											w='80%'
											bg='rgba(28, 163, 255, 0.3)'
											_focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
											placeholder="Nomor Telepon"
											placeholderTextColor='#1CA3FF'
											onChangeText={(val) => setHP(val)}
											h={"60"}
											fontSize={"md"}
										/>
									</InputGroup>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>No HP wajib diisi</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -7 ? styles.d_flex : styles.d_none}>No HP tidak valid</Text>
                                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -8 ? styles.d_flex : styles.d_none}>No HP sudah terdaftar</Text>
                                </Box>
                                <Center marginTop={50}>
                                    <VStack space={3} w="100%">
                                        <Box
											w={"50%"}
											style={{ alignSelf: "center" }}
										>
												<Button
													size={"lg"}
													p={5}
													style={styles.tsk_btn_main}
													isLoading={isLoad}
													onPress={() => {regis();}}
													rounded={"sm"}
												>
													<Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>
														Register
													</Text>
												</Button>
										</Box>

                                        <NBPressable onPress={toLogin} alignItems="center" w="100%" ml="auto" mt={3}>
                                            <Text fontSize={16} color={styles.txt_black} >Sudah punya akun? <Text fontWeight={"bold"} color='#1CA3FF'>Login Sekarang</Text></Text>
                                        </NBPressable>
                                    </VStack>
                                </Center>
                            </VStack>
							) :
							// OTP
							<VStack space={"4"} w="100%">
								<Box>
									<CodeField
										ref={ref}
										{...props}
										value={value}
										onChangeText={setValue}
										cellCount={CELL_COUNT}
										rootStyle={styles.codeFieldRoot}
										keyboardType="number-pad"
										textContentType="oneTimeCode"
										renderCell={({index, symbol, isFocused}) => (
											<Text
												key={index}
												style={[styles.cell, isFocused && styles.focusCell]}
												onLayout={getCellOnLayoutHandler(index)}>
												{symbol || (isFocused ? <Cursor /> : null)}
											</Text>
										)}
									/>
									<Center marginTop={50}>
										<VStack space={3} w="100%">
											<Box
												style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
											>
												<Button
													size={"lg"}
													p={5}
													marginRight={2}
													style={styles.tsk_btn_green}
													isLoading={isLoad}
													onPress={() => {regisToLogin();}} rounded={"sm"}
												>
													<Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>
														Verifikasi
													</Text>
												</Button>

												<Button
													size={"lg"}
													p={5}
													marginLeft={2}
													style={styles.tsk_btn_main}
													isLoading={isLoad}
													onPress={() => {regisToLogin();}} rounded={"sm"}
												>
													<Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>
														Langsung Masuk
													</Text>
												</Button>
											</Box>

											<NBPressable onPress={() => {setRegisterShow(!registerShow);}} alignItems="center" w="100%" ml="auto" mt={3}>
												<Text fontSize={16} color={styles.txt_black}>Salah email? <Text fontWeight={"bold"} color='#1CA3FF'>Segara ubah</Text></Text>
											</NBPressable>
										</VStack>
                                	</Center>
								</Box>
							</VStack>
							}
                        </Container>
                    </Center>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
}