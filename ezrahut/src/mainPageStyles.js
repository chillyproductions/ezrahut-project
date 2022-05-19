import { StyleSheet,Dimensions} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    plusButton:{
        width: windowHeight*0.12,
        height:windowHeight*0.12,
    },
    plusButtonCover:{
        position:'absolute',
        bottom:30,
        justifyContent:"center",
        alignItems:'center',
        width:windowWidth,
    },
    addDataMenu:{
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        position:'absolute',
        backgroundColor:'white',
        bottom:-windowHeight*0.6,
        width:windowWidth,
        height:windowHeight*0.6,
        elevation:10,
    },
    revealedMenu:{
        bottom:0
    },
    menuButtonCover:{
        marginTop:0.08*windowHeight,
        width:windowWidth,
        display:"flex",
        flexDirection:'row-reverse',
        justifyContent:'space-around',
        alignItems:'center'
    },
    menuButton:{
        width:windowWidth*0.4,
        height:windowHeight*0.07,
        backgroundColor:'white',
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:'#D4D5DA',
    },
    menuCaptionCover:{
        marginTop:30,
        marginBottom:30,
        justifyContent:"center",
        alignItems:"center",
        width:windowWidth,
    },
    menuCaption:{
        color:'#7A73E7',
        fontSize:30
    },
    inputCaption:{
        paddingRight:15,
    },
    input:{
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        textAlign:'right'
    },
    gambleCover:{
        width:0.8*windowWidth,
        backgroundColor:'#D4D5DA',
        padding:10,
        marginBottom:20,
        borderRadius:10
    },
    historyCover:{
        alignItems:'center',
        padding:20
    },
    navBar:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        display:'flex',
        flexDirection:'row-reverse'
    },
    navButton:{
        fontSize:30,
        height:50,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:'#D4D5DA',
        width:0.5*windowWidth,
    },
    selectedNav:{
        height:70,
        backgroundColor:'#7A73E7'
    }

})