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

            var res = await fetch(`http://192.168.14.54:3000/getAccountData?mail=${mail}&pass=${pass}`);
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
    const [moneyValue, setMoneyValue] = useState(getMoneyValue());

    useEffect(()=>{
        setFormatedData(formatData());
    },[data])

    useEffect(()=>{
        setMoneyValue(getMoneyValue());
    },[formatedData])

    function formatData(){
        var formatedData = {
            labels: [],
            datasets: [
              {
                data: [0],
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

    function getMoneyValue(money){
        const cost = [0,20,50,100,200,300,400,600,800,1000,2000,3000,4000,5000,6000];
        const value = [
            "5 חמצוצים",
            "מנוי חודשי לספוטיפי",
            "פיצה של פיצה האט",
            "רובה מסג'",
            "מנוי חודשי לחדר כושר",
            "משקפי מעצבים של קרולינה למקה ברלין",
            "רמקול של jbl",
            "פטיפון עם מספר תקליתים",
            "16 ליטר של חלב",
            "30 קלטות dvd של שרק",
            "אופני הרים",
            "איפון 13",
            "אייפד פרו",
            "10000 חמצוצים",
            "סטייק מצופה זהב"
        ]
    
        for(var i = 0; cost[i] < Math.abs(formatedData.total); i++){}
        return value[i-1];
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
        <View style={{alignItems:'center'}}>
            <View>
                <Text style={styles.totalLossCaption}>{formatedData.total > 0? "ניצחון סך הכל":"הפסד סך הכל"}:{Math.abs(formatedData.total)}</Text>
            </View>
            <View>
                <Text style={styles.graphCaption}>גרף הפסדים להורך זמן:</Text>
            </View>
            <LineChart
                data={formatedData}
                width={350}
                height={220}
                chartConfig={chartConfig}
            />
            {formatedData.total < 0?
            <View>
                <Text style={styles.moneyValue}>היית יכול לקנות {moneyValue} עם הכסף שהפסדת</Text>
            </View>
            :null
            }
        </View>
    )
}

function InputNewGamle({cancel,mail,pass,showAddData,addData}){
    const [cost, setCost] = useState();
    const [profit, setProfit] = useState();

    async function createAccountData(){
        var res = await fetch('http://192.168.14.54:3000/createAccountData',{
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
