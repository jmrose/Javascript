import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  row: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  mt: {
    marginTop: 18,
  },
  btnEtc: {
    flexDirection: 'column',
    backgroundColor:'#e9f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1/ PixelRatio.get(),
    borderColor:'#b1bbbd',
    paddingVertical: 10
  },
  btnEduLabel: {
    backgroundColor:'#5ca3fa',
    borderRadius:5,
    color:'#fff',
    paddingHorizontal:5,
    fontSize:14
  },
  btnFooter:{
    borderWidth:1,
    borderColor:'#3c4652',
    paddingHorizontal:18,
    paddingVertical:3,
    backgroundColor:'#66727d'
  },
  lineTop:{
    borderTopWidth:1/ PixelRatio.get(),
    borderTopColor:'#b1bbbd',
  },
  lineLeft:{
    borderLeftWidth:1/ PixelRatio.get(),
    borderLeftColor:'#b1bbbd',
  },
  lineBottom:{
    borderBottomWidth:1/ PixelRatio.get(),
    borderBottomColor:'#b1bbbd',
  },
  lineRight:{
    borderRightWidth:1/ PixelRatio.get(),
    borderRightColor:'#b1bbbd',
  }
});
