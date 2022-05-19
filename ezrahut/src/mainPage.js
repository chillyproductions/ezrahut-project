import { useEffect, useState} from "react"
import { Text,View,TextInput, TouchableOpacity, FlatList, Image, I18nManager} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {LineChart} from "react-native-chart-kit";

import { styles } from "./mainPageStyles"
import plusButton from '../assets/plusButton.png';

I18nManager.forceRTL(true)

export default function MainPage(){
    const [mail, setMail] = useState();
    const [pass, setPass] = useState();
    const [data,setData] = useState();
    const [history,setHistory] = useState(false);
    const [showAddData, setShowAddData] = useState(false)

    useEffect(()=>{
        async function getData(){
            let mail = await AsyncStorage.getItem("mail");
            let pass = await AsyncStorage.getItem("pass");

            setMail(mail);
            setPass(pass);

            var res = await fetch(`http://192.168.7.220:3000/getAccountData?mail=${mail}&pass=${pass}`);
            if(res.status != 400){
                res = await res.json();
                setData(res.history);
            }
        }
        getData();
    },[])

    function addData(cost,profit){
        var tmpdata = data.slice();
        tmpdata.push({cost,profit});
        setData(tmpdata);
    }

    if(!data){
        return(
            <View style={styles.container}>
                <Text>Loading</Text>
            </View>
        )
    }

    return (
        <>
            <View style={styles.navBar}>
                <TouchableOpacity style={{...styles.navButton, ...(history?'':styles.selectedNav)}} onPress={()=>setHistory(false)}><Text style={{fontSize:20, color:"white"}}>גרפים</Text></TouchableOpacity>
                <TouchableOpacity style={{...styles.navButton, ...(history?styles.selectedNav:'')}} onPress={()=>setHistory(true)}><Text style={{fontSize:20, color:"white"}}>היסטוריה</Text></TouchableOpacity>
            </View>
            {history?<HistoryTab data={data}/>:<GraphTab data={data} />}
            <TouchableOpacity style={styles.plusButtonCover} onPress={()=>setShowAddData(true)}><Image style={styles.plusButton} source={plusButton} /></TouchableOpacity>
            <InputNewGamle addData={addData} showAddData={showAddData} mail={mail} pass={pass} cancel={()=>setShowAddData(false)} />
        </>
        
    )
}

function HistoryTab({data}){
    return(
        <View style={styles.historyCover}>
            <FlatList
                style={{paddingHorizontal:20}}
                data={data}
                renderItem={Gamble}
                ListFooterComponent={<View style={{height: 100}}/>}
            />
        </View>
    )
}

function Gamble({item: data}){
    return(
        <View style={styles.gambleCover}>
            <Text>מחיר:{data.cost}</Text> 
            <Text>ניצחון:{data.profit}</Text> 
        </View>
    )
}

function GraphTab({data}){
    const [formatedData, setFormatedData] = useState(formatData());

    useEffect(()=>{
        setFormatedData(formatData());
    },[data])

    function formatData(){
        var formatedData = {
            labels: [],
            datasets: [
              {
                data: [1,2],
              }
            ],
        };

        var total = 0;
        for(let gamble of data){
            total += gamble.profit - gamble.cost;
            formatedData.datasets[0].data.push(total);
        }
        formatedData.total = total; 

        return formatedData;
    }   

    const chartConfig = {
        backgroundGradientFrom: "gray",
        backgroundGradientTo: 'gray',
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 10,
        },
        propsForDots: {
          r: "3",
          strokeWidth: "1",
          stroke: "#7A73E7"
        }
      };

    return(
        <Text>
            <View>
                <Text>הפסד סך הכל:{formatedData.total}</Text>
            </View>
            <View>
                <Text>גרף הספדים להורך זמן:</Text>
            </View>
            <LineChart
                data={formatedData}
                width={350}
                height={220}
                chartConfig={chartConfig}
            />
        </Text>
    )
}

function InputNewGamle({cancel,mail,pass,showAddData,addData}){
    const [cost, setCost] = useState();
    const [profit, setProfit] = useState();

    async function createAccountData(){
        var res = await fetch('http://192.168.7.220:3000/createAccountData',{
            method:"POST",
            body:JSON.stringify({mail,pass,cost:parseInt(cost),profit:parseInt(profit)}),
            headers:{'Content-Type':'application/json'}
        })
        if(res.status == 200){
            cancelButton();
            addData(cost,profit);
        }
    }

    function cancelButton(){
        setCost();
        setProfit()
        cancel();
    }

    return(
        <View style={{ ...styles.addDataMenu,...(showAddData?styles.revealedMenu:'')}}>
            <View style={styles.menuCaptionCover}><Text style={styles.menuCaption}>הוספת הימור</Text></View>
            <View>
                <Text style={styles.inputCaption}>מחיר:</Text>
                <TextInput style={styles.input} value={cost} keyboardType="numeric" onChangeText={setCost} placeholder="מחיר"/>
            </View>
            <View >
                <Text style={styles.inputCaption}>ניצחון:</Text>
                <TextInput style={styles.input} value={profit} keyboardType="numeric" onChangeText={setProfit} placeholder="ניצחון"/>
            </View>
            <View style={styles.menuButtonCover}>
                <TouchableOpacity style={{...styles.menuButton, backgroundColor:'#7A73E7'}} onPress={createAccountData}><Text style={{fontSize:20}}>הוסף</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={cancelButton}><Text style={{fontSize:20}}>ביטול</Text></TouchableOpacity>
            </View>
        </View>
    )
}