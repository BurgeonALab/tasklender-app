import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Toast, Box, Text } from 'native-base';
import { Entypo, MaterialIcons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome, FontAwesome5, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

export default class CFunc{
    constructor(){
        this.ldvs = [];
        this.lbrd = [];
        this.lcrd = [];
        this.lcmd = [];
        this.limg = [];
        this.ldoc = [];
        this.lusr = [];
        this.lvimg = [];
        this.lwusr = [];
        this.lbusr = [];
        this.lcusr = [];
        this.notif = [];
        this.main_color = "darkBlue.800";
        this.main_color_hex = "#002851";
        this.sub_color = "darkBlue.50";
        this.success_color = "green.600";
        this.danger_color = "danger.600";
        this.warning_color = "yellow.700";
        this.muted_color = "muted.500";
        this.muted_color_skeleton = "muted.400";
        this.light_muted_color = "muted.300";
        this.white_color = "white";
        this.black_color = "black";
        this.icon_color = "white";
        this.border_color_dark = "coolGray.500";
        this.border_color_light = "coolGray.200";
        this.light_danger_color = "danger.100";
        this.light_warning_color = "yellow.100";
        this.light_success_color = "green.100";
        this.transparent_color = "transparent";
        this.success_text = "green.700";
        this.warning_text = "yellow.700";
        this.danger_text = "danger.700";
        // New
        this.new_color_purple = "#7800FF";
        this.new_color_green = "#009F4F";
        this.new_color_yellow = "#FFCA00";
        this.new_color_red = "#FE0051";
        this.new_color_pink = "#CD00E3";
        this.new_color_orange = "#FF9900";

        this.header_color = "#005D9C";
        this.white_text = "#FFFFFF";
    }

    server(){
        return "http://192.168.1.17/tasklender-backend/api";
        return "https://www.technopedie.com/techno_lender/bin/api";
    }

    server_link(){
        return "http://192.168.1.17";
        return "https://www.technopedie.com";
    }

    numberFormat(x){
        var hsl, y;
        
        //x = Math.round(x);
        x = x.toString().split(",");
        y = x[0].toString().split(".");
        
        var length = x[0].length, str = x[0];
        
        if(y.length > 1)
        {
            length = y[0].length;
            str = y[0];
        }
        
        hsl = "";
        for(var i = 0; i < length; i++)
        {
            if(i == str.length - 1 && str.substr(str.length-1-i,1) == "-")
                hsl = str.substr(str.length-1-i,1)+hsl;
            else
            {
                if(i % 3 == 0 && i != 0)
                    hsl = ","+hsl;
    
                hsl = str.substr(str.length-1-i,1)+hsl;
            }
        }
    
        if(y.length > 1)
            hsl += "."+y[1];
        
        return hsl;
    }

    getArrLoad(n){
        var arr = [];

        for(var i = 0; i < n; i++){
            arr.push(i);
        }

        return arr;
    }

    hpass_icon(){
        return <Entypo name="eye"/>;
    }

    vpass_icon(){
        return <Entypo name="eye-with-line"/>;
    }

    err_icon(){
        return <MaterialIcons name="error-outline"/>;
    }

    mail_icon(){
        return <Feather name="mail"/>;
    }

    left_arr_icon(){
        return <AntDesign name="arrowleft"/>;
    }

    notif_icon(){
        return <MaterialIcons name="notifications"/>;
    }

    search_icon(){
        return <FontAwesome name="search"/>;
    }

    add_icon(){
        return <AntDesign name="pluscircle"/>;
    }

    add_icon_plus(){
        return <AntDesign name="plus"/>;
    }

    group_icon(){
        return <MaterialCommunityIcons name="account-group"/>;
    }

    contact_icon(){
        return <MaterialCommunityIcons name="contacts"/>;
    }

    sleep_icon(){
        return <MaterialCommunityIcons name="sleep"/>;
    }

    empty_icon(){
        return <Entypo name="progress-empty"/>;
    }

    smile_icon(){
        return <FontAwesome5 name="smile-beam"/>
    }

    pallete_icon(){
        return <MaterialCommunityIcons name="palette" />
    }

    dots_icon(){
        return <MaterialCommunityIcons name="dots-vertical"/>
    }

    file_icon(){
        return <MaterialCommunityIcons name="file" />
    }

    file_text_icon(){
        return <FontAwesome5 name="file-alt" />
    }

    edit_icon(){
        return <MaterialCommunityIcons name="pencil"/>
    }

    delete_icon(){
        return <MaterialCommunityIcons name="delete"/>
    }

    close_icon(){
        return <MaterialCommunityIcons name='close-circle'/>
    }

    reply_icon(){
        return <MaterialCommunityIcons name="message-reply" />
    }

    minus_circle_icon(){
        return <MaterialCommunityIcons name="minus-circle-outline" />;
    }

    check_circle_icon(){
        return <AntDesign name="checkcircle" />;
    }

    upload_icon(){
        return <MaterialCommunityIcons name="upload" />;
    }

    camera_icon(){
        return <MaterialCommunityIcons name="camera" />;
    }

    sync_icon(){
        return <AntDesign name="sync" />;
    }

    privacy_icon(){
        return <Octicons name="shield" />;
    }

    right_arrow_icon(){
        return <MaterialIcons name="keyboard-arrow-right" />;
    }

    logout_icon(){
        return <MaterialCommunityIcons name="logout" />
    }

    crown_icon(){
        return <MaterialCommunityIcons name="crown" />
    }

    pass_icon(){
        return <Entypo name="lock" />
    }

    copy_icon(){
        return <AntDesign name="copy1" />
    }

    no_project_image(){
        return <Image source={require('../assets/images/project-not-found.png')} alt='No Project' size={"xl"} resizeMode={"contain"}></Image>
    }

    no_deadline_image(){
        return <Image source={require('../assets/images/no-deadline.png')} alt='No Deadline' size={"xl"} resizeMode={"contain"}></Image>
    }

    no_team_image(){
        return <Image source={require('../assets/images/no-team.png')} alt='No Deadline' size={"xl"} resizeMode={"contain"}></Image>
    }

    no_pekerjaan_image(){
        return <Image source={require('../assets/images/pekerjaan-not-found.png')} alt='No Project' size={"xl"} resizeMode={"contain"}></Image>
    }

    no_listToDo_image(){
        return <Image source={require('../assets/images/listToDo-not-found.png')} alt='No Project' size={"xl"} resizeMode={"contain"}></Image>
    }

    upgrade_image(){
        return <Image source={require('../assets/images/upgrade.png')} alt='Upgrade' size={"xl"} resizeMode={"contain"}></Image>
    }

    error_503(){
        return <Image source={require('../assets/images/error-503.png')} alt='Service Unavailable' size={"2xl"} resizeMode={"contain"}></Image>
    }

    error_400(){
        return <Image source={require('../assets/images/error-400.png')} alt='Bad Request' size={"2xl"} resizeMode={"contain"}></Image>
    }

    logo_bca(){
        return <Image source={require('../assets/images/logo-bbca.png')} alt='Bank Central Asia' size={"sm"} resizeMode={"contain"}></Image>
    }

    logo_bri(){
        return <Image source={require('../assets/images/logo-bbri.png')} alt='Bank Republik Indonesia' size={"sm"} resizeMode={"contain"}></Image>
    }

    logo_bni(){
        return <Image source={require('../assets/images/logo-bbni.png')} alt='Bank Negara Indonesia' size={"sm"} resizeMode={"contain"}></Image>
    }

    logo_mandiri(){
        return <Image source={require('../assets/images/logo-bmndr.png')} alt='Bank Mandiri' size={"sm"} resizeMode={"contain"}></Image>
    }

    logo_permata(){
        return <Image source={require('../assets/images/logo-bpmta.png')} alt='Bank Permata' size={"sm"} resizeMode={"contain"}></Image>
    }

    logo_gopay(){
        return <Image source={require('../assets/images/logo-gopay.png')} alt='Gopay' size={"sm"} resizeMode={"contain"}></Image>
    }

    credit_card_icon(){
        return <Image source={require('../assets/images/cc-icon.png')} alt='Credit Card' size={"sm"} resizeMode={"contain"}></Image>
    }
    // New
    account_icon(){
        return <MaterialCommunityIcons name="account"/>;
    }

    down_icon(){
        return <MaterialCommunityIcons name="chevron-down"/>;
    }
    
    trash_icon(){
        return <MaterialCommunityIcons name="trash-can"/>;
    }

    filter_icon(){
        return <MaterialCommunityIcons name="filter"/>;
    }

    job_icon(){
        return <MaterialCommunityIcons name="briefcase"/>;
    }

    navigate(response, onscreen, id){
        const navigation = useNavigation();

        if(response.notification.request.content.data.type && response.notification.request.content.data.type === "NTF" && onscreen !== "Notifikasi"){
            navigation.navigate("notifikasi");
        }
        else if(response.notification.request.content.data.type && response.notification.request.content.data.type === "LTD" && onscreen !== "ListToDo" && id !== response.notification.request.content.data.id){
            navigation.navigate('listToDo', {
              krj : response.notification.request.content.data.id,
              pyk : response.notification.request.content.data.pyk,
            })
        }
        else if(response.notification.request.content.data.type && response.notification.request.content.data.type === "CMD" && onscreen !== "Comment" && id !== response.notification.request.content.data.id){
            navigation.navigate('comment', {
                ltd: response.notification.request.content.data.id,
                tgjwb: response.notification.request.content.data.tgjwb,
                created: response.notification.request.content.data.created,
                stat: response.notification.request.content.data.stat,
                namaLTD: response.notification.request.content.data.nama,
            });
        }
    }

    async copy_clipboard(x){
        await Clipboard.setStringAsync(x);

        Toast.show({
          render: () => {
            return  <Box bgColor={this.light_muted_color} px="2" py="1" rounded="lg" mb={5}>
                      <Text>Copy ke clipboard</Text>
                    </Box>;
          },
          placement: "bottom"
        });
    }

    nav_goback(nav){
        nav.goBack();
    }
    
    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    list_color(){
        const name = ["pink", "purple", "violet", "indigo", "blue", "lightBlue", "darkBlue", "cyan", "teal", "green", "lime", "yellow", "orange", "red", "gray", "blueGray", "dark", "black", "white"], narr = [];

        for(var i = 0; i < name.length; i++)
        {
            if(name[i] === "black"){
                narr.push([name[i], "white"]);
            }
            else if(name[i] === "white"){
                narr.push([name[i], "black"]);
            }
            else
            {
                for(var j = 100; j < 1000; j+=100){
                    var txtColor = "black";
                    if(name[i] === "dark"){
                        var txtColor = "white";
                    }

                    if(j >= 500){
                        txtColor = "white";
                        if(name[i] === "dark"){
                            txtColor = "black";
                        }
                    }

                    narr.push([name[i]+"."+j, txtColor]);
                }
            }
        }

        return narr;
    }

    list_color_hex(){
        const narr = [
            //PINK
            '#fce7f3','#fbcfe8','#f9a8d4','#f472b6','#ec4899','#db2777','#be185d','#9d174d','#831843',
            //PURPLE
            '#f3e8ff','#e9d5ff','#d8b4fe','#c084fc','#a855f7','#9333ea','#7e22ce','#6b21a8','#581c87',
            //VIOLET
            '#ede9fe','#ddd6fe','#c4b5fd','#a78bfa','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95',
            //INDIGO
            '#e0e7ff','#c7d2fe','#a5b4fc','#818cf8','#6366f1','#4f46e5','#4338ca','#3730a3','#312e81',
            //BLUE
            '#dbeafe','#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a8a',
            //LIGHTBLUE
            '#e0f2fe','#bae6fd','#7dd3fc','#38bdf8','#0ea5e9','#0284c7','#0369a1','#075985','#0c4a6e',
            //DARKBLUE
            '#addbff','#7cc2ff','#4aa9ff','#1a91ff','#0077e6','#005db4','#004282','#002851','#000e21',
            //CYAN
            '#cffafe','#a5f3fc','#67e8f9','#22d3ee','#06b6d4','#0891b2','#0e7490','#155e75','#164e63',
            //TEAL
            '#ccfbf1','#99f6e4','#5eead4','#2dd4bf','#14b8a6','#0d9488','#0f766e','#115e59','#134e4a',
            //GREEN
            '#dcfce7','#bbf7d0','#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534','#14532d',
            //LIME
            '#ecfccb','#d9f99d','#bef264','#a3e635','#84cc16','#65a30d','#4d7c0f','#3f6212','#365314',
            //YELLOW
            '#fef9c3','#fef08a','#fde047','#facc15','#eab308','#ca8a04','#a16207','#854d0e','#713f12',
            //ORANGE
            '#ffedd5','#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12',
            //RED
            '#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b','#7f1d1d',
            //GRAY
            '#f4f4f5','#e4e4e7','#d4d4d8','#a1a1aa','#71717a','#52525b','#3f3f46','#27272a','#18181b',
            //BLUEGRAY
            '#f1f5f9','#e2e8f0','#cbd5e1','#94a3b8','#64748b','#475569','#334155','#1e293b','#0f172a',
            //DARK
            '#27272a','#3f3f46','#52525b','#71717a','#a1a1aa','#d4d4d8','#e4e4e7','#f4f4f5','#fafafa',
            //BLACK
            '#000000',
            //WHITE
            '#ffffff'
        ];

        return narr;
    }

    list_color_hex_simple(){
        const narr = [
            //PINK
            '#db2777',
            //PURPLE
            '#9333ea',
            //VIOLET
            '#7c3aed',
            //INDIGO
            '#4f46e5',
            //BLUE
            '#2563eb',
            //LIGHTBLUE
            '#0284c7',
            //DARKBLUE
            '#005db4',
            //CYAN
            '#0891b2',
            //TEAL
            '#0d9488',
            //GREEN
            '#16a34a',
            //LIME
            '#65a30d',
            //YELLOW
            '#ca8a04',
            //ORANGE
            '#ea580c',
            //RED
            '#dc2626',
            //GRAY
            '#52525b',
            //BLUEGRAY
            '#475569',
            //DARK
            '#d4d4d8',
        ];

        return narr;
    }

    async getUserID(){
        return AsyncStorage.getItem('@techno_lender_user');
    }

    async logout(){
        const email = await AsyncStorage.getItem("@techno_lender_user");
        const token = await AsyncStorage.getItem("@techno_lender_user_token");
        
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('token', token);

        const response = await fetch(this.server() + "/dusrtkn.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        AsyncStorage.setItem('@techno_lender_user', '');
        AsyncStorage.setItem('@techno_lender_user_token', '');
    }
    
    getCurDate(sep = "/"){
        var d = new Date().getDate();
        var m = new Date().getMonth()+1;
        var y = new Date().getFullYear();
        
        return this.getNDigit(d, 2)+sep+this.getNDigit(m, 2)+sep+y;
    }
    
    getDateDateTime(date, sep = "/"){
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        
        return this.getNDigit(d, 2)+sep+this.getNDigit(m, 2)+sep+y;
    }
    
    getDateDateTime2(date, sep = "-"){
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        
        return y+sep+this.getNDigit(m, 2)+sep+this.getNDigit(d, 2);
    }

    getNDigit(x, n){
        var hsl = x;
        
        for(var i = x.toString().length; i < n; i++)
            hsl = "0"+hsl;
        
        return hsl;
    }

    //LOGIN
    async login(email, pass){
        var data = new FormData();
        data.append('email', email);
        data.append('pass', pass);
        
        const response = await fetch(this.server()+"/login.php", {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body : data,
        });

        const json = await response.json();

        return json.err[0];
    }

    //REGISTER
    async register(email, pass, cpass, ngr, hp, nama){
        var data = new FormData();
        data.append('email', email);
        data.append('pass', pass);
        data.append('cpass', cpass);
        data.append('ngr', ngr);
        data.append('hp', hp);
        data.append('nama', nama);
        
        const response = await fetch(this.server()+"/register.php", {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body : data,
        });

        const json = await response.json();

        return json.err[0];
    }

    //RESET PASSWORD
    async resetPass(email){
        var data = new FormData();
        data.append('email', email);
        
        const response = await fetch(this.server()+"/resetpass.php", {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body : data,
        });

        const json = await response.json();

        return json.err[0];
    }

    //NEGARA
    async getAllNgr(){
        const response = await fetch(this.server()+"/gangr.php");

        const json = await response.json();

        return json.data;
    }

    //TEAM
    async getAllTeam(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gateam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json.data;
    }

    async getDataTeam(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/gdtteam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async syncContact(email, lctc){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('lctc', JSON.stringify(lctc));
        
        const response = await fetch(this.server() + "/syncctc.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async newTeam(nama, email, lmmbr){
        var frmdata = new FormData();
        frmdata.append('nama', nama);
        frmdata.append('email', email);
        frmdata.append('lmmbr', JSON.stringify(lmmbr));
        
        const response = await fetch(this.server() + "/nteam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async updTeam(id, nama, email, lmmbr){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('nama', nama);
        frmdata.append('email', email);
        frmdata.append('lmmbr', JSON.stringify(lmmbr));
        
        const response = await fetch(this.server() + "/uteam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async delTeam(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/dteam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    //PROYEK
    async getLastPyk(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/glpyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json.data;
    };

    async getAllPyk(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gapyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json.data;
    };

    async getDataPyk(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/gdtpyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async invTeam(id, idTeam){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('idTeam', idTeam);
        
        const response = await fetch(this.server() + "/invteam.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async invCtc(id, lctc){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('lctc', JSON.stringify(lctc));

        const response = await fetch(this.server() + "/invctc.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async invEmail(id, email){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('email', email);
        
        const response = await fetch(this.server() + "/invemail.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async verifInvPyk(id, email, stat){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('email', email);
        frmdata.append('stat', stat);
        
        const response = await fetch(this.server() + "/vinvpyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async newPyk(nama, bgColor, txtColor, email){
        var frmdata = new FormData();
        frmdata.append('nama', nama);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        frmdata.append('email', email);
        
        const response = await fetch(this.server() + "/npyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async updPyk(id, nama, bgColor, txtColor, email){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('nama', nama);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/upyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async delPyk(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/dpyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async delPstPyk(id, email){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/dmpyk.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    //PEKERJAAN
    async getAllKrj(pyk, email){
        var frmdata = new FormData();
        frmdata.append('pyk', pyk);
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gakrj.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json.data;
    };

    async newKrj(pyk, nama, email, bgColor, txtColor){
        var frmdata = new FormData();
        frmdata.append('pyk', pyk);
        frmdata.append('nama', nama);
        frmdata.append('email', email);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        
        const response = await fetch(this.server() + "/nkrj.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });
        const json = await response.json();

        return json;
    }

    async updKrj(id, nama, bgColor, txtColor){
        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('nama', nama);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        
        const response = await fetch(this.server() + "/ukrj.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async delKrj(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/dkrj.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    //MONTH
    getListMonth(){
        var arr = [];

        for(var i = 1; i <= 12; i++){
            var month = ("0" + i).slice(-2);
            arr.push([month, this.getNmMonth(i-1)]);
        }

        return arr;
    }

    getNmMonth(x){
        var arr = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return arr[x];
    }

    //YEAR
    getListYear(start, end){
        var arr = [], n = 0;

        for(var i = start; i <= end; i++){
            arr.push(i.toString());
        }

        return arr;
    }

    //LISTTODO
    getListNotif(){
        return [
            ["Selalu", 0],
            ["3 hari sebelum deadline", 3],
            ["7 hari sebelum deadline", 7],
            ["14 hari sebelum deadline", 14],
            ["30 hari sebelum deadline", 30],
        ]
    }

    async getAllLTD(krj, email, flmt, tlmt, filter = "A", vsearch){
        var frmdata = new FormData();
        frmdata.append('krj', krj);
        frmdata.append('email', email);
        frmdata.append('filter', filter);
        frmdata.append('flmt', flmt);
        frmdata.append('tlmt', tlmt);
        frmdata.append('vsearch', vsearch);
        
        const response = await fetch(this.server() + "/galtd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async getLastDeadLTD(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gldltd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    };

    async getAllDeadLTD(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gadltd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    };

    async newLTD(krj, nama, deadline, tgjwb, email, bgColor, txtColor, notif){
        if(deadline !== "")
            deadline = this.getDateDateTime2(deadline)

        var frmdata = new FormData();
        frmdata.append('krj', krj);
        frmdata.append('nama', nama);
        frmdata.append('deadline', deadline);
        frmdata.append('tgjwb', tgjwb);
        frmdata.append('email', email);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        frmdata.append('notif', notif);
        
        const response = await fetch(this.server() + "/nltd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });
        const json = await response.json();

        return json;
    }

    async updLTD(id, krj, nama, deadline, tgjwb, email, bgColor, txtColor, notif){
        if(deadline !== "")
            deadline = this.getDateDateTime2(deadline)

        var frmdata = new FormData();
        frmdata.append('id', id);
        frmdata.append('krj', krj);
        frmdata.append('nama', nama);
        frmdata.append('deadline', deadline);
        frmdata.append('tgjwb', tgjwb);
        frmdata.append('email', email);
        frmdata.append('bgcolor', bgColor);
        frmdata.append('txtcolor', txtColor);
        frmdata.append('notif', notif);
        
        const response = await fetch(this.server() + "/ultd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async delLTD(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/dltd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    //USER
    async getAllUser(){
        const response = await fetch(this.server() + "/gauser.php");
        const json = await response.json();
        this.lusr = json.data;

        return json.data;
    }

    async getAllTUser(type, tid){
        var frmdata = new FormData();
        frmdata.append('type', type);
        frmdata.append('tid', tid);
        
        const response = await fetch(this.server() + "/gatuser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json.data;
    }

    async getAllUserPyk(id){
        var frmdata = new FormData();
        frmdata.append('id', id);
        
        const response = await fetch(this.server() + "/gapykusr.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json.data;
    }

    async getDataUser(id){
        var frmdata = new FormData();
        frmdata.append('email', id);

        const response = await fetch(this.server() + "/gdtuser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    cekAksUser(x){
        for(var i = 0; i < x.length; i++)
        {
            if(x.substring(i, i+1) === "1")
                return true;
        }

        return false;
    }

    async countUserID(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await window.fetch(this.server() + "/cuser.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: frmdata,
        });

        const json = await Promise.resolve(response.json());
        return json.count[0];
    }

    async newUser(name, email, user, lvl, aks){
        var frmdata = new FormData();
        frmdata.append('name', name);
        frmdata.append('email', email);
        frmdata.append('user', user);
        frmdata.append('lvl', lvl);
        frmdata.append('aks', aks);

        const response = await fetch(this.server() + "/nuser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    async editUser(email, nama, phone, ngr, bemail){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('nama', nama);
        frmdata.append('phone', phone);
        frmdata.append('ngr', ngr);
        frmdata.append('bemail', bemail);
        
        const response = await fetch(this.server() + "/uusr.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async delUser(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/duser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });
    }

    async gantiPass(email, pass, npass, cpass){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('pass', pass);
        frmdata.append('npass', npass);
        frmdata.append('cpass', cpass);
        
        const response = await fetch(this.server() + "/cpass.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async addTUser(type, tid, user){
        var frmdata = new FormData();
        frmdata.append('type', type);
        frmdata.append('tid', tid);
        frmdata.append('user', user);
        
        const response = await fetch(this.server() + "/atuser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    async delTUser(type, tid, user){
        var frmdata = new FormData();
        frmdata.append('type', type);
        frmdata.append('tid', tid);
        frmdata.append('user', user);

        const response = await fetch(this.server() + "/dtuser.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    async lupaPass(mail){
        var frmdata = new FormData();
        frmdata.append('mail', mail);
        
        const response = await fetch(this.server() + "/lpass.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    //USER TOKEN
    async getUserToken(){
        return AsyncStorage.getItem("@techno_lender_user_token");
    }

    async updUserToken(email, token){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('token', token);

        const response = await fetch(this.server() + "/nusrtkn.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });
    }

    //CONTACT
    async getAllCtc(email){
        var frmdata = new FormData();
        frmdata.append('email', email);
        
        const response = await fetch(this.server() + "/gactc.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = response.json();

        return json;
    }

    //COMMAND
    async getAllCmd(ltd){
        var frmdata = new FormData();
        frmdata.append('id', ltd);
        
        const response = await fetch(this.server() + "/gacmd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();

        return json;
    }

    async newCmd(ltd, cmd, email, img, doc, rply = ""){
        var frmdata = new FormData();
        frmdata.append('ltd', ltd);
        frmdata.append('cmd', cmd);
        frmdata.append('email', email);
        frmdata.append('rply', rply);
        
        for(var i = 0; i < img.length; i++)
        {
            frmdata.append('img'+i, {
                uri : img[i].uri,
                type : img[i].type,
                name : img[i].name,
            });
        }

        frmdata.append('len', img.length);

        if(doc !== null)
        {
            frmdata.append('doc', {
                uri : doc.uri,
                type : doc.type,
                name : doc.name,
                size : doc.size,
            });
            frmdata.append('doc2', 1);
        }
        else
        {
            frmdata.append('doc', null);
            frmdata.append('doc2', 0);
        }
        
        const response = await fetch(this.server() + "/ncmd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json.err[0];
    }

    async editCmd(id, ltd, cmd, email, img, doc, doc2){
        var frmdata = new FormData(), limg = [], n = 0;
        frmdata.append('id', id);
        frmdata.append('ltd', ltd);
        frmdata.append('cmd', cmd);
        frmdata.append('email', email);
        
        for(var i = 0; i < img.length; i++)
        {
            if(img[i].uri.toLowerCase().indexOf(this.server_link()) >= 0)
                limg.push(img[i].uri);
            else
            {
                frmdata.append('img'+n, {
                    uri : img[i].uri,
                    type : img[i].type,
                    name : img[i].name,
                });

                n++;
            }
        }

        frmdata.append('limg', JSON.stringify(limg));
        frmdata.append('len', n);

        if(doc !== null)
        {
            var tdoc = {
                uri : doc.uri,
                type : doc.type,
                name : doc.name,
                size : doc.size,
            }, tdoc2 = 1;

            if(doc2 !== null)
            {
                if(doc.uri === doc2.uri)
                {
                    tdoc = null;
                    tdoc2 = 2;
                }
            }
            
            frmdata.append('doc', tdoc);
            frmdata.append('doc2', tdoc2);
        }
        else
        {
            frmdata.append('doc', null);
            frmdata.append('doc2', 0);
        }
        
        const response = await fetch(this.server() + "/ucmd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    async delCmd(id){
        var frmdata = new FormData();
        frmdata.append('id', id);

        const response = await fetch(this.server() + "/dcmd.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json.err[0];
    }

    //NOTIF
    async getCNotif(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/gaunnotif.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        return json;
    }

    async getAllNotif(email){
        var frmdata = new FormData();
        frmdata.append('email', email);

        const response = await fetch(this.server() + "/ganotif.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async updReadNotif(lntf){
        var frmdata = new FormData();
        frmdata.append('lntf', JSON.stringify(lntf));
        
        const response = await fetch(this.server() + "/urnotif.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    //MEMBERSHIP
    async getMShipUpg(email){
        var frmdata = new FormData();
        frmdata.append('email', email);
        
        const response = await fetch(this.server() + "/gmshipupg.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async getMShipID(id){
        var frmdata = new FormData();
        frmdata.append('id', id);
        
        const response = await fetch(this.server() + "/gdtmship.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    //PAYMENT
    async getAllPayment(email, filter){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('filter', filter);
        
        const response = await fetch(this.server() + "/gapay.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async getDataPayment(id){
        var frmdata = new FormData();
        frmdata.append('id', id);
        
        const response = await fetch(this.server() + "/gdtpay.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    getPayNm(id){
        if(id === "BCA_VA"){
            return "BCA - Virtual Account";
        }
        else if(id === "BRI_VA"){
            return "BRI - Virtual Account";
        }
        else if(id === "BNI_VA"){
            return "BNI - Virtual Account";
        }
        else if(id === "MNDR_VA"){
            return "Mandiri - Virtual Account";
        }
        else if(id === "PRMT_VA"){
            return "Permata - Virtual Account";
        }
        else if(id === "GOPAY"){
            return "Gopay";
        }
        
        return "Kartu Kredit";
    }

    async getMTGopayStat(email){
        var frmdata = new FormData();
        frmdata.append('email', email);
        
        const response = await fetch(this.server() + "/gmdgopay.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }

    async sendPayment(email, mship, mpay, ccNum, ccYear, ccMonth, cvv, hp, sub){
        var frmdata = new FormData();
        frmdata.append('email', email);
        frmdata.append('mship', mship);
        frmdata.append('mpay', mpay);
        frmdata.append('ccYear', ccYear);
        frmdata.append('ccMonth', ccMonth);
        frmdata.append('cvv', cvv);
        frmdata.append('hp', hp);
        frmdata.append('sub', sub);
        frmdata.append('ccNum', ccNum);
        console.log(frmdata);
        const response = await fetch(this.server() + "/sdpay.php", {
            method : 'POST',
            header : {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body : frmdata,
        });

        const json = await response.json();
        
        return json;
    }
}