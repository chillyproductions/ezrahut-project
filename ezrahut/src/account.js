import { useState } from 'react';
import {View,Button,Text, TextInput, ImageBackground, TouchableOpacity, Image} from 'react-native';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './accountStyles';
import backgroundImg from '../assets/backgroundImage.png'
import backButton from '../assets/backButton.png';


export default function AccountPage(){
    const [accountPageState, setAccountPageState] = useState("");

    if(accountPageState == "signIn")
        return (
            <>
                <AccountPageCover>
                    <SignIn></SignIn>
                </AccountPageCover>
                <TouchableOpacity style={styles.backButtonCover} onPress={()=>setAccountPageState("")}><Image style={styles.backButton} source={backButton}/></TouchableOpacity>
            </>
    )
    if(accountPageState == "signUp")
        return(
            <>
                <AccountPageCover>
                    <SignUp></SignUp>
                </AccountPageCover>
                <TouchableOpacity style={styles.backButtonCover} onPress={()=>setAccountPageState("")}><Image style={styles.backButton} source={backButton}/></TouchableOpacity>
            </>
    )
    return(
        <AccountPageCover>
            <TouchableOpacity style={{...styles.button, ...styles.topButton}} 
                onPress={()=>setAccountPageState("signIn")}>
                <Text style={styles.buttonText}>הירשם</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} 
                onPress={()=>setAccountPageState("signUp")}>
                <Text style={styles.buttonText}>צור משתמש</Text>
            </TouchableOpacity>
        </AccountPageCover>
    )
}

function AccountPageCover({children}){
    return(
        <ImageBackground style={styles.backgroundImage} source={backgroundImg}>
            <View style={styles.cover}>
                {children}
            </View>
        </ImageBackground>
    )
}

function SignIn(){
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState();
    const [errorMsg,setErrorMsg] = useState('');
    const navigate = useNavigate();

    async function signIn(){
        var res = await fetch(`http://192.168.7.220:3000/checkAccount?mail=${mail.toLowerCase().replace(' ','')}&pass=${pass.replace(" ",'')}`)
        
        res = await res.text();

        if(res == 'ok'){
            await AsyncStorage.setItem('mail',mail.toLowerCase().replace(' ',''));
            await AsyncStorage.setItem('pass',pass.replace(" ",''));
            navigate('/Main');
        }
        else
            setErrorMsg(res)
    }

    return(
        <View>
            <TextInput onChangeText={setMail} style={styles.textInput} placeholder='מייל'></TextInput>
            <TextInput onChangeText={setPass} style={styles.textInput} secureTextEntry={true} placeholder='סיסמה'></TextInput>
            <TouchableOpacity onPress={signIn} style={{...styles.button, backgroundColor:'#7A73E7'}}><Text style={styles.buttonText}>היכנס</Text></TouchableOpacity>
            <Text>{errorMsg}</Text>
        </View>
    )
}

function SignUp(){
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState();
    const [passRepeat, setPassRepeat] = useState();
    const [errorMsg,setErrorMsg] = useState('');
    
    async function signUp(){
        if(passRepeat != pass){setErrorMsg('הסיסמאות לא שוות'); return}

        var res = await fetch('http://192.168.7.220:3000/createAccount',{
            method:'POST',
            body:JSON.stringify({mail:mail.toLowerCase().replace(' ',''),pass:pass.replace(" ",'')}),
            headers:{'Content-Type': 'application/json'}
        })

        res = await res.text();

        if(res == 'ok'){
            await AsyncStorage.setItem('mail',mail.toLowerCase().replace(' ',''));
            await AsyncStorage.setItem('pass',pass.replace(" ",''));
            navigate('/Main');
        }
        else
            setErrorMsg(res)
    }

    return(
        <View>
            <TextInput onChangeText={setMail} style={styles.textInput} placeholder='מייל'></TextInput>
            <TextInput onChangeText={setPass} style={styles.textInput} secureTextEntry={true} placeholder='סיסמה'></TextInput>
            <TextInput onChangeText={setPassRepeat} style={styles.textInput} secureTextEntry={true} placeholder='חזור על הסיסמה'></TextInput>
            <TouchableOpacity onPress={signUp} style={{...styles.button, backgroundColor:'#7A73E7'}}><Text style={styles.buttonText}>צור משתמש</Text></TouchableOpacity>
            <Text>{errorMsg}</Text>
        </View>
    )
}
