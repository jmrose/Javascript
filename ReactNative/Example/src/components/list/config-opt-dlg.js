import React, {Component} from 'react';
import {
    Dimensions, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, FlatList, PixelRatio
} from 'react-native';

import {
    View,Text,Icon,List,Button,ListItem,Badge
} from 'native-base';

import Codes from '../../values/code';
import {requestCodes} from '../../actions';
import {connect} from 'react-redux';

const screen = Dimensions.get('window');

class ConfigOptDlg extends Component {
    componentWillMount() {
        this.state = {
            type: 'itemcode',
            modalTitle: {
                'itemcode': '업종',
                'location': '지역'
            },
            isOpen: false,
            codes: [],
            selectCodes: [],
            allCodes: []
        };
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onSelectCodes(this.state.type, this.state.selectCodes);
        this.props.onRef(undefined);
    }

    _onOpen = (type, type, selectCodes) => {
      var allCodes = type == 'itemcode'
          ? Codes.itemcode[type]
          : Codes[type];

      var codes = allCodes;
      this.setState({codes: codes.filter(function(code){
        code.selected = false;
        code.cnt = null; // 갱신해주지 않으면 전에 값으로 셋팅되는 현상있음.

        if(!selectCodes) selectCodes = [];
        // 선택된 코드가 있는 경우
        selectCodes.map(function(selectCode){
          //하위 코드 색 선택으로 전환
          if( selectCode.code == code.code ) code.selected = true;

          //해당 그룹의 카운트를 표기
          if( selectCode.group == code.group && !code.code ){
             code.cnt = code.cnt ? code.cnt+1 : 1;
             console.log( code.cnt, code, selectCode);
          }
        });

        if( ( !code.code && code.group) || (code.code && !code.group) ) return code;
      })});

      this.setState({
          type: type,
          isOpen: true,
          selectCodes: selectCodes ? selectCodes : [],
          allCodes: allCodes
      });
    }

    // 창닫기
    _onClose = () => {
        this.setState({isOpen: false});
    }

    // 선택된 코드를 부모창(맞춤설정창)에 전달하기
    _onSubmit = () => {
      let codes = [];
      codes[this.state.type] = this.state.selectCodes;
      this.props.onSelectCodes(this.state.type, this.state.selectCodes);

      this._onClose();
    }

    // 상위 그룹이 선택 될 경우, 하위 코드를 보여주기
    _onGroupSelected = (itemcode) => {
      //console.log("_onGroupSelected", this.state.codes);
      this.setState({codes: this.state.allCodes.filter(function(allCode){
        if( itemcode.group == allCode.group ){ //선택된 그룹인 경우 visible 로 전환
          allCode.visiblility = allCode.visiblility == null || !allCode.visiblility ? 'visible' : '';
        }

        // 선택된 그룹의 하위 코드인 경우 또는 모든 그룹코드
        if( allCode.code && itemcode.group == allCode.group && allCode.visiblility == 'visible' ) return allCode;
        else if( (!allCode.code && allCode.group) ) return allCode;
      })});
    }

    _onCodeSelected = (item, index) => {

      var selectCodes = this.state.selectCodes;

      if (item.selected){
          // selectCodes.splice(selectCodes.indexOf(item), 1);
          selectCodes = selectCodes.filter(function(code){
            if( item.code != code.code ) return code;
          })


          let codes = [...this.state.codes];
          codes[index].selected = false;
          this.setState({
              codes: codes
          });

          this.setState({codes: this.state.codes.filter(function(code){
            if( item.group == code.group && !code.code ) code.cnt = code.cnt ? code.cnt-1 : null;
            return code;
          })});
      }else{
          selectCodes.push(item);

          let codes = [...this.state.codes];
          codes[index].selected = true;
          this.setState({
              codes: codes
          });

          this.setState({codes: this.state.codes.filter(function(code){
            if( item.group == code.group && !code.code ) code.cnt = code.cnt ? code.cnt+1 : 1;
            return code;
          })});
      }

      this.setState({
          selectCodes: selectCodes
      });
    }

    _renderItem = ( item, index ) => {
      var status = false;
      this.state.selectCodes.map(function(val){
        if( val.code == item.code ) status = true;
      });

      if(item.group && !item.code){ // 그룹명
        return (
          <TouchableOpacity onPress={()=>this._onGroupSelected(item, index)}
            style={[
              {flexDirection:'row',justifyContent:'space-between'},
              item.code ? {paddingLeft:30}:{paddingLeft:30,paddingTop:6,paddingBottom:6},
              item.selected?{backgroundColor:'#bee3f3'}:{},
              styles.bottomBorder
            ]}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Badge info><Text>{item.group}</Text></Badge>
                <Text style={{marginLeft:10,alignSelf:'center'}}>{item.name}</Text>
            </View>
            {
              item.cnt ? <Text style={{color:'#bc4343',alignSelf:'center',marginRight:20}}>{item.cnt}</Text> : null
            }
          </TouchableOpacity>
        );
      }else{
        return (
          <TouchableOpacity onPress={()=>this._onCodeSelected(item, index)}
            style={[
              {flexDirection:'row'},
              item.group?{paddingLeft:45,paddingTop:6,paddingBottom:6}:{paddingLeft:30,paddingTop:6,paddingBottom:6},
              styles.bottomBorder
            ]}>
              {
                item.selected
                ? <Icon name='md-checkbox-outline' style={{color:'#35a0d5'}} />
                : <Icon name='md-square-outline' style={{color:'#35a0d5'}} />
              }
              <Text style={{marginLeft:10,alignSelf:'center'}}>{item.name}</Text>
          </TouchableOpacity>
        );
      }
    }

    render() {
        return (
          <Modal animationType="fade" transparent={true} visible={this.state.isOpen} onRequestClose={this._onClose}>
              <TouchableWithoutFeedback onPress={() => this._onClose()}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent:'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                      <TouchableWithoutFeedback>
                          <View style={{
                                  width: screen.width - 40,
                                  height: screen.height - 100,
                                  backgroundColor: '#ffffff'
                              }}>
                              <View style={styles.header}>
                                  <Text style={{marginLeft:20,fontSize:16,color:'#666'}}>{this.state.modalTitle[this.state.type]}을 선택하십시오</Text>
                                  <Button transparent onPress={() => this._onClose()}>
                                      <Icon name="md-close" style={{'color' : '#666'}}/>
                                  </Button>
                              </View>
                              <FlatList
                                data={this.state.codes}
                                renderItem={({item, index})=>this._renderItem(item, index)}
                                keyExtractor={(item, index) => index }
                                />
                              <View style={{marginTop: 'auto'}}>
                                  <Button full primary onPress={() => this._onSubmit()}>
                                      <Text>선택적용</Text>
                                  </Button>
                              </View>
                          </View>
                      </TouchableWithoutFeedback>
                  </View>
              </TouchableWithoutFeedback>
          </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'space-between',
        backgroundColor:'#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    bottomBorder:{
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#bbb'
    }
});

const mapStateToProps = (state) => {
    const {codes} = state;
    //console.log("===options modal===mapStateToProps===", state, codes);
    return {codes: codes.codes};
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestCodes: (params) => {
            dispatch(requestCodes(params))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigOptDlg);
