import React, { useEffect, useState, useRef } from 'react';
import { Pressable as NPressable } from 'react-native';
import { NativeBaseProvider, VStack, Box, Text, Button, ScrollView, HStack, Input, Menu, Icon, Center, Select } from 'native-base';
import styles from '../constants/index';
import CFunc from '../constants/clsfunction';
import Header from '../navigation/header-inner';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function RalatListToDoScreen({ navigation, route }){
    const id = route.params.id;
    const krj = route.params.krj;
    const pyk = route.params.pyk;
    const [bgColor, setBgColor] = useState(route.params.bgcolor);
    const [txtColor, setTxtColor] = useState(route.params.txtcolor);
    const [err, setErr] = useState(0);
    const [nama, setNama] = useState(route.params.nama);
    const [tgjwb, setTgjwb] = useState(route.params.tgjwb);
    const [notif, setNotif] = useState(route.params.notif);
    const [lusr, setLUsr] = useState([]);
    const [lntf, setLNotif] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const lib = new CFunc();
    const arr = lib.list_color();
    const [email, setEmail] = useState();
    const [date, setDate] = useState(new Date(route.params.deadline));
    const [date2, setDate2] = useState(lib.getDateDateTime(date, "/"));
    const [showPickDate, setShowPickDate] = useState(false);
    const [mode, setMode] = useState('date');
    const [ cnotif, setCNotif ] = useState(0);
    const responseListener = useRef();
    // Icon
    const job_icon = lib.job_icon();
    const down_icon = lib.down_icon();

    const toDate = (event, ndate) => {
        if(ndate !== undefined)
        {
            const curdate = ndate || date;
            setShowPickDate(false);
            setDate(curdate);
            setDate2(lib.getDateDateTime(curdate,'/'));
        }
    }

    const editLTD = () => {
        var ndate = date;
        if(date2 === "Pilih Tanggal")
            ndate = "";

        setErr(0);
        setIsSave(true);

        if(nama === "" || bgColor === "" || txtColor === "" || ndate === "" || tgjwb === "" || notif === ""){
            setErr(-1);
            setIsSave(false);
        }
        else{
            lib.updLTD(id, krj, nama, ndate, tgjwb, email, bgColor, txtColor, notif).then((json) => {
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

    const getEmail = async() => {
        const data = await lib.getUserID();
        setEmail(data);
    }

    const getUser = async(id) => {
        const data = await lib.getAllUserPyk(id);
        setLUsr(data);
    }

    useEffect(() => {
        getEmail();
        getUser(pyk);
        setLNotif(lib.getListNotif());

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          lib.navigate(response, "RalatListToDo", "");
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
                show_text={"Y"}
                header={
                <Box>
                    <Text fontWeight={'light'} fontSize={20}>{nama}</Text>
                    <Text fontWeight={'bold'} fontSize={20}>Edit Kegiatan</Text>
                </Box>
                }
                bgcolor={styles.bg_transparent}
                txtcolor={styles.txt_black}
                txtnotif={cnotif}
            />
            <ScrollView>
                <VStack style={err !== -2 && err !== -3 ? styles.d_flex : styles.d_none} px='30px' py='30px'>
                    <Box mb={3}>
                        <Input
                            InputLeftElement={
                                <Icon
                                    as={job_icon}
                                    size={18}
                                    color='#1CA3FF'
                                    marginLeft={5}
                                />
                            }
                            _focus={{backgroundColor: 'rgba(28, 163, 255, 0.3)'}}
                            variant="unstyled"
                            bg='rgba(28, 163, 255, 0.3)'
                            placeholderTextColor='#1CA3FF'
                            h={50}
                            rounded={'sm'}
                            placeholder="Nama Kegiatan"
                            fontSize={"md"}
                            value={nama}
                            onChangeText={(val) => setNama(val)}>
                        </Input>
                        <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Nama Pekerjaan wajib diisi</Text>
                    </Box>
                    <Box bg='rgba(28, 163, 255, 0.3)' mb={3} rounded={'sm'}>
                        <HStack>
                            <Center h={'50px'} w={'50px'} roundedTopLeft={'sm'} roundedBottomLeft={'sm'} bg={bgColor}></Center>
                            <Center marginLeft="15px" w="70%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize={'14px'} color={'#1CA3FF'}>Warna Background</Text>
                                <Menu w="100%" h={80} trigger={(props) => {
                                    return (<NPressable {...props} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.pallete_icon()} color={'#1CA3FF'} size="md"/></NPressable>)
                                }}>
                                {
                                    arr.map((data) => (
                                        <Menu.Item bgColor={data[0]} key={data[0]} onPress={() => { setBgColor(data[0]) }}><Text color={data[1]}>{data[0]}</Text></Menu.Item>
                                    ))
                                }
                                </Menu>
                            </Center>
                        </HStack>
                    </Box>
                    <Box bg='rgba(28, 163, 255, 0.3)' mb={3} rounded={'sm'}>
                        <HStack>
                            <Center h={'50px'} w={'50px'} roundedTopLeft={'sm'} roundedBottomLeft={'sm'} bg={txtColor}></Center>
                            <Center marginLeft="15px" w="70%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize={'14px'} color={'#1CA3FF'}>Warna Tulisan</Text>
                                <Menu w="100%" h={80} trigger={(props) => {
                                    return (<NPressable {...props} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}><Icon as={lib.pallete_icon()} color={'#1CA3FF'} size="md"/></NPressable>)
                                }}>
                                {
                                    arr.map((data) => (
                                        <Menu.Item bgColor={data[0]} key={data[0]} onPress={() => { setTxtColor(data[0]) }}><Text color={data[1]}>{data[0]}</Text></Menu.Item>
                                    ))
                                }
                                </Menu>
                            </Center>
                        </HStack>
                    </Box>
                    <Box bg='rgba(28, 163, 255, 0.3)' mb={3} rounded={'sm'} h={'50px'} style={{display: 'flex', justifyContent: 'center'}}>
                        <HStack>
                            <NPressable w={"100%"} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, display: 'flex', flexDirection: 'row' })} onPress={() => { setShowPickDate(true) }}>
                                <Box w="90%" border={1} p={1} style={styles.main_color_border}>
                                    <Text ml='20px' fontSize="md" color={date2 === 'Deadline' ? '#1CA3FF' : '#000000'} fontWeight={"normal"}>{date2}</Text>
                                    {showPickDate && (<DateTimePicker value={date} mode={mode} is24Hour={true} display="default" onChange={toDate}/>)}
                                </Box>
                                <Box mr={-30} w="10%" style={{display: 'flex', justifyContent: 'center'}}>
                                    <NPressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })} onPress={() => { setDate2("Deadline") }}>
                                        <Icon
                                            as={lib.close_icon()}
                                            size={5}
                                            color='#1CA3FF'
                                        />
                                    </NPressable>
                                </Box>
                            </NPressable>
                        </HStack>
                    </Box>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Deadline wajib diisi</Text>
                    <Box bg='rgba(28, 163, 255, 0.3)' rounded='sm' h='50px' mb={3} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} pl={3} pr={35}>
                        <Select dropdownIcon={
                        <Icon
                            as={down_icon}
                            size={8}
                            color='#1CA3FF'
                        />
                        } defaultValue={tgjwb} placeholder='Penanggung Jawab' placeholderTextColor={'#1CA3FF'} borderWidth={0} minWidth="100%" onValueChange={(val) => setTgjwb(val)} fontSize={"md"} fontWeight={"normal"}>
                            {
                                lusr.map((data) => {
                                    return <Select.Item label={data[4]} value={data[1]} key={data[1]} />
                                })
                            }
                        </Select>
                    </Box>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Penanggung Jawab wajib diisi</Text>
                    <Box bg='rgba(28, 163, 255, 0.3)' rounded='sm' h='50px' mb={3} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} pl={3} pr={35}>
                        <Select dropdownIcon={
                        <Icon
                            as={down_icon}
                            size={8}
                            color='#1CA3FF'
                        />
                        } defaultValue={0} placeholder='Munculkan Notifikasi' placeholderTextColor={'#1CA3FF'} borderWidth={0} minWidth="100%" onValueChange={(val) => setNotif(val)} fontSize={"md"} fontWeight={"normal"}>
                            {
                                lntf.map((data) => {
                                    return <Select.Item label={data[0]} value={data[1]} key={data[1]} />
                                })
                            }
                        </Select>
                    </Box>
                    <Text fontSize={"sm"} color={lib.danger_color} style={parseInt(err) === -1 ? styles.d_flex : styles.d_none}>Notifikasi Wajib Diisi</Text>
                    <Box w='100%' mt={30} style={{display: 'flex', alignItems: 'center'}}>
                        <Button w='50%' style={styles.tsk_btn_main} size="lg" p={5} isLoading={isSave} onPress={editLTD}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'}}>Simpan</Text>
                        </Button>
                    </Box>
                </VStack>
                <VStack style={err === -2 || err === -3 ? styles.d_flex : styles.d_none} space={8} py={4} px={4}>
                    <Center>
                        {
                            lib.error_400()
                        }
                    </Center>
                    
                    <Box>
                        <Button size={"lg"} p={3} bgColor={lib.main_color} onPress={() => { nav_goBack(); }} rounded={"xl"}>Kembali</Button>
                    </Box>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}
