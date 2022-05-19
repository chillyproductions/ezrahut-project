import { StyleSheet,Dimensions} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    backgroundImage:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:-1,

    },
    cover:{
        backgroundColor:'white',
        width:0.8*windowWidth,
        paddingVertical:0.1*windowHeight,
        borderRadius: 30,
        justifyContent:'center',
        alignItems:'center',
        elevation: 10,
        position:'relative'
    },
    backButton:{
        width:70,
        height:70,

    },
    backButtonCover:{
        position:"absolute",
        zIndex:1,
        elevation:1,
        top:10,
        left:15
    },
    topButton:{
        width:0.6*windowWidth,
        marginBottom:10,
        backgroundColor:'#7A73E7'
    },
    button:{
        width:0.6*windowWidth,
        backgroundColor:'#D4D5DA',
        height:0.1*windowHeight,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15
    },
    buttonText:{
        color:"white",
        fontSize:20,
    },
    textInput:{
        width:0.6*windowWidth,
        backgroundColor:'#D4D5DA',
        height:0.08*windowHeight,
        marginBottom:15,
        borderRadius:12,
        fontSize:15,
        padding:5,
        color:"white"
    }
});