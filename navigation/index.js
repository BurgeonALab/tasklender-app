import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from "expo-linking";

import SplashScreen from '../screens/splash';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import LupaPassScreen from '../screens/lupa_password';
import ProyekScreen from '../screens/proyek';
import TambahProyekScreen from '../screens/tambahProyek';
import RalatProyekScreen from '../screens/ralatProyek';
import DataProyekScreen from '../screens/dataProyek';
import TambahTeamProyekScreen from '../screens/tambahTeamProyek';
import TambahContactProyekScreen from '../screens/tambahContactProyek';
import TambahInviteProyekScreen from '../screens/tambahInviteProyek';
import TeamScreen from '../screens/team';
import TambahTeamScreen from '../screens/tambahTeam';
import RalatTeamScreen from '../screens/ralatTeam';
import DataTeamScreen from '../screens/dataTeam';
import PekerjaanScreen from '../screens/pekerjaan';
import TambahPekerjaanScreen from '../screens/tambahPekerjaan';
import RalatPekerjaanScreen from '../screens/ralatPekerjaan';
import ListToDoScreen from '../screens/listToDo';
import TambahListToDoScreen from '../screens/tambahListToDo';
import RalatListToDoScreen from '../screens/ralatListToDo';
import CommentScreen from '../screens/comment';
import TambahCommentScreen from '../screens/tambahComment';
import RalatCommentScreen from '../screens/ralatComment';
import NotifikasiScreen from '../screens/notifikasi';
import RalatAkunScreen from '../screens/ralatAkun';
import GantiPasswordScreen from '../screens/gantiPassword';
import MembershipScreen from '../screens/membership';
import PaymentScreen from '../screens/payment';
import DetailPaymentScreen from '../screens/detailPayment';
import TransaksiScreen from '../screens/transaksi';
import DetailTransaksiScreen from '../screens/detailTransaksi';
import RootScreen from './bottomtab';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const prefix = Linking.createURL("/");

export default function Navigation() {
  const Stack = createNativeStackNavigator();
  const linking = {
    prefixes : [prefix],
    config : {
      screens: {
        splash : "splash",
        login : "login",
        register : "register",
        lupaPass : "lupaPass",
        root : "root",
        ralatAkun : "ralatAkun",
        gantiPass : "gantiPass",
        proyek : "proyek",
        tambahProyek : "tambahProyek",
        ralatProyek : "ralatProyek",
        dataProyek : "dataProyek",
        tambahTeamProyek : "tambahTeamProyek",
        tambahContactProyek : "tambahContactProyek",
        tambahInviteProyek : "tambahInviteProyek",
        team : "team",
        tambahTeam : "tambahTeam",
        ralatTeam : "ralatTeam",
        dataTeam : "dataTeam",
        pekerjaan : "pekerjaan",
        tambahPekerjaan : "tambahPekerjaan",
        ralatPekerjaan : "ralatPekerjaan",
        listToDo : "listToDo",
        tambahListToDo : "tambahListToDo",
        ralatListToDo : "ralatListToDo",
        comment : "comment",
        tambahComment : "tambahComment",
        ralatComment : "ralatComment",
        notifikasi : "notifikasi",
        membership : "membership",
        payment : "payment",
        detailPayment : "detailPayment/:mship/:mpay/:isSub",
        daftarTransaksi : "daftarTransaksi",
        detailTransaksi : "detailTransaksi/:id",
      }
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token !== undefined && token !== null)
        AsyncStorage.setItem('@techno_lender_user_token', token);
    });
  }, [])

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="lupaPass" component={LupaPassScreen} options={{ headerShown: false }} />
        <Stack.Screen name="root" component={RootScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatAkun" component={RalatAkunScreen} options={{ headerShown: false }} />
        <Stack.Screen name="gantiPass" component={GantiPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="proyek" component={ProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahProyek" component={TambahProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatProyek" component={RalatProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="dataProyek" component={DataProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahTeamProyek" component={TambahTeamProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahContactProyek" component={TambahContactProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahInviteProyek" component={TambahInviteProyekScreen} options={{ headerShown: false }} />
        <Stack.Screen name="team" component={TeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahTeam" component={TambahTeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatTeam" component={RalatTeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="dataTeam" component={DataTeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="pekerjaan" component={PekerjaanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahPekerjaan" component={TambahPekerjaanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatPekerjaan" component={RalatPekerjaanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="listToDo" component={ListToDoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahListToDo" component={TambahListToDoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatListToDo" component={RalatListToDoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="comment" component={CommentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tambahComment" component={TambahCommentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ralatComment" component={RalatCommentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="notifikasi" component={NotifikasiScreen} options={{ headerShown: false }} />
        <Stack.Screen name="membership" component={MembershipScreen} options={{ headerShown: false }} />
        <Stack.Screen name="payment" component={PaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="detailPayment" component={DetailPaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="daftarTransaksi" component={TransaksiScreen} options={{ headerShown: false }} />
        <Stack.Screen name="detailTransaksi" component={DetailTransaksiScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}