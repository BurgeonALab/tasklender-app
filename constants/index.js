import { StyleSheet } from "react-native";

export default StyleSheet.create({
    bg_main : {
        color: "#ffffff",
        backgroundColor: "#113d58",
        borderWidth: 1,
        borderColor: "#103a53",
    },

    bg_transparent : {
        backgroundColor: 'transparent'
    },

    btn : {
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },

    text_light : {
        color: "#FFFFFF",
    },

    text_danger : {
        color: "#dc3545",
    },

    nav_bottom : {
        height: 51,
        justifyContent: 'flex-end',
        marginBottom: 5
    },

    rotate_m45: {
        transform: [{ rotate : '-45deg' }],
    },

    d_none:{
        display: "none",
    },

    d_flex:{
        display: "flex",
    },

    d_absolute:{
        display: "absolute",
    },

    // New
    bg_black: {
        backgroundColor: '#000000',
    },

    bg_white: {
        backgroundColor: '#FFFFFF',
    },

    logo_sm: {
        width: 70,
        height: 70,
    },

    tsk_btn_main: {
        backgroundColor: '#1CA3FF',
    },

    tsk_btn_green: {
        backgroundColor: '#009F4F',
    },

    txt_black: {
        color: '#000000',
    },

    txt_main: {
        color: '#1CA3FF',
    },

    frm_background: {
        backgroundColor: 'rgba(28, 163, 255, 0.3)',
    },

    codeFieldRoot: {
        marginTop: 0
    },
    
    cell: {
        width: 40,
        height: 50,
        lineHeight: 40,
        fontSize: 28,
        borderBottomWidth: 2,
        fontWeight: 'bold',
        borderColor: 'grey',
        textAlign: 'center',
    },
    
    focusCell: {
        borderColor: '#000',
    },
})