import React, { Component } from "react";
import {
  TouchableOpacity, Alert, Picker, Animated, StyleSheet, PixelRatio, ActivityIndicator
} from "react-native";
import {
  Container, Content, Header, Left, Body, Right, Title, Footer, Text, Button, Icon, View
} from "native-base";

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { requestListConf, receiveListConfSave, onUpdateListConfs } from '../../actions';

import url from '../../values/url';
import { fetchPosts, fetchGets } from '../../actions/sync-network';

import Toast from '../utils/toast';
import ConfigOptPanel from './config-opt-panel';
import ConfigOptDlg from './config-opt-dlg';
import Dropdown from '../utils/dropdown';

class ConfigForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      word:'',
      bid_suc:'bid',
      bidtype_name: {'con':'공사','ser':'용역','pur':'구매'},
      bidtype:'con',
      division: '1',
      division_name: '설정1',
      itemcode:[],
      location:[],
      apt:[{"code":"N","name":"아파트공고 함께 보기"}],
      print_range:'6month',
      sort:'writedt',
      save: false,
      animating: false,
      suc_agree: true
    };
    this.sort = [
        {label: '입력일', value: 'writedt'},
        {label: '입찰일', value: 'constdt'},
        {label: '투찰마감일', value: 'closedt'},
        {label: '참가마감일', value: 'registdt'}
    ];
  }

  componentDidMount(){
    const { dispatch, userid, deviceid, navigation, listConf } = this.props;
    const { params } = navigation.state;
    // console.log('config componentDidMount==', this.props, params);

    this.setState({
      bid_suc:params.bid_suc,
      bidtype:params.bidtype,
      division:params.division,
      division_name:params.division_name,
      // itemcode: listConf.itemcode,
      // location: listConf.location,
      // print_range: listConf.print_range,
      // sort: listConf.sort
    });

    if( userid && deviceid ){
      this._requestListConf({userid:userid,deviceid:deviceid,bid_suc:params.bid_suc,bidtype:params.bidtype,division:params.division});
    }
  }

  componentWillReceiveProps(nextProps){
      if( nextProps.listConf ){
        // console.log( ' ConfigForm componentWillReceiveProps' , this.state, nextProps, this.props );
        // this.setState({
        //   itemcode: nextProps.listConf.itemcode ? nextProps.listConf.itemcode : [],
        //   location: nextProps.listConf.location ? nextProps.listConf.location : [],
        //   print_range: nextProps.listConf.print_range ? nextProps.listConf.print_range : '6month',
        //   sort: nextProps.listConf.sort ? nextProps.listConf.sort : 'writedt'
        // });
      }
  }

  _requestListConf = (params) => {
    this.setState({animating: true});
    var thatState = this.state;
    let req = fetchGets( url.listConf, params);
    req.then( res => {
      return res.json();
    }).then( json => {
      this.setState({
        itemcode: json.itemcode ? json.itemcode : [],
        location: json.location ? json.location : [],
        print_range: json.print_range ? json.print_range : '6month',
        sort: json.sort ? json.sort : 'writedt',
        animating: false
      });
    });
  }

  _onListConfSaveAction = () => {
    this.setState({animating: true});

    let itemcode = this.state.itemcode.map(function(item){
        return item.code;
    });
    let location = this.state.location.map(function(item){
        return item.code;
    });
    let params = {
      userid:this.props.userid,
      deviceid:this.props.deviceid,
      bid_suc:this.state.bid_suc,
      bidtype:this.state.bidtype,
      division:this.state.division,
      itemcode:itemcode,
      location:location,
      print_range:this.state.print_range,
      sort:this.state.sort,
      division_name:this.state.division_name,
      suc_agree:this.state.suc_agree
    };

    var thatState = this.state;
    let req = fetchPosts( url.listConfSave, params);
    req.then( res => {
        console.log(res);
      return res.json();
    }).then( json => {
        if( json.message == 'ok' ){
            this.setState({
              save: true,
              animating: false
            });

            this.props.onUpdateListConfs(json.listConfs);
console.log(json);
            this.refs.toast.show({text: '정상 처리되었습니다', duration: 1000});
            //Toast.show({text:'정상 처리되었습니다.',position:'top',duration:1000,style:{lignItems:'center',justifyContent:'center',marginTop:'50%',marginLeft:30,marginRight:30,borderRadius:5}});

            let that = this;
            setTimeout(function(){
              that._goBack();
            }, 2000);
        }
    });

    //this.props.receiveListConfSave(params);
  }

  _openOptionModal = (type) => {
    if(type == 'itemcode' && !this.state.bidtype[0] ){
      Alert.alert(null, '구분을 먼저 선택하여 주십시오');
    }else this.optionModal._onOpen(type, this.state.bidtype, this.state[type]);
  }

  _onSelectCodes = (type, codes) => {
    let state = this.state;
    if(type == 'bidtype') state['itemcode'] = [];

    state[type] = codes;
    this.setState(state);
  }

  _goBack = (message) => {
    if( this.state.save ){
      this.props.navigation.state.params.handleRefresh();
      this.props.navigation.state.params.setParams({use:'Y'});
    }else this.props.navigation.state.params.setParams({});

    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.state.itemcode
                ? this._goBack()
                : this.props.screenProps.parentNavigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    key: null,
                    actions: [
                      NavigationActions.navigate({
                        routeName: 'Home'
                      })
                    ]
                  })
                )
              }>
              <Icon name="md-arrow-round-back" />
            </Button>
          </Left>
          <Body>
            <Title>맞춤설정</Title>
          </Body>
          <Right />
        </Header>

        <Content style={styles.content}>
          <View style={styles.body}>
            <View style={{paddingHorizontal:18,paddingVertical:10,backgroundColor:'#eee'}}>
              <Text style={{fontSize:18,color:'#000'}}>
                {this.state.division_name}
              </Text>
              <Text style={{fontSize:14,color:'#666'}}>
                {this.state.bid_suc == 'bid' ? '[입찰] ' : '[낙찰] '}
                {this.state.bidtype_name[this.state.bidtype]}
              </Text>
            </View>
            <ConfigOptPanel title='업종' type='itemcode' value={this.state.itemcode} openOptionModal={this._openOptionModal} />
            <ConfigOptPanel title='지역' type='location' value={this.state.location} openOptionModal={this._openOptionModal} />
            {
                this.state.bid_suc == 'bid'
                ?
                    <View style={[{flexDirection:'row', alignItems: 'center', marginLeft:15, marginRight:15, paddingVertical:20}, styles.bottomBorder]}>
                      <Text style={{width:90}}>리스트출력</Text>
                      <TouchableOpacity onPress={()=>this.setState({print_range:'6month'})}>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginRight:6}}>
                          {
                            this.state.print_range=='6month'
                            ?<Icon name='md-checkbox-outline' style={{color:'#35a0d5',fontSize:20}} />
                            :<Icon name='md-square-outline' style={{color:'#35a0d5',fontSize:20}} />
                          }
                          <Text style={{marginLeft:5,fontSize:14}}>최근(6개월)</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.setState({print_range:'pastbid'})}>
                        <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                          {
                            this.state.print_range!='6month'
                            ?<Icon name='md-checkbox-outline' style={{color:'#35a0d5',fontSize:20}} />
                            :<Icon name='md-square-outline' style={{color:'#35a0d5',fontSize:20}} />
                          }
                          <Text style={{marginLeft:5,fontSize:14}}>지난입찰제외</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                : null
            }
            <View style={{flexDirection:'row', alignItems: 'center', marginTop:10,marginLeft:15,marginRight:25,marginBottom:10}}>
              <Text style={{width:80}}>정렬기준</Text>
              <Dropdown
                  defaultValue={this.state.sort}
                  style={{margin: 5}}
                  options={this.sort}
                  renderButton={(label, value) => {
                      return (
                          <View style={{flexDirection: 'row', alignItems: 'center', width: 100, padding: 5}}>
                              <Text style={{color: '#000'}}>{label}</Text>
                              <Icon name="md-arrow-dropdown" style={{color:'#000', marginLeft: 10}} />
                          </View>
                      );
                  }}
                  dropdownStyle={{width: 100, height: 160}}
                  onSelect={(item, index) => {
                      this.setState({
                          sort: item.value,
                      });
                  }}
              />
              {/*
              <Picker
                mode='dropdown'
                style={{width:170,borderColor:'#ccc',borderWidth:1}}
                selectedValue={this.state.sort}
                itemStyle={{borderWidth:1, borderColor:'#ccc'}}
                onValueChange={(itemValue, itemIndex)=>this.setState({sort:itemValue})}>
                <Picker.Item label="입력일" value='writedt' />
                <Picker.Item label="입찰일" value='constdt' />
                <Picker.Item label="투찰마감일" value='closedt' />
                <Picker.Item label="참가마감일" value='registdt' />
              </Picker>
              <Text></Text>
              */}
            </View>
          </View>
          <View style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', marginTop:5}}>
            <Text style={{marginLeft:5,fontSize:12,color:'#666'}}>- 사이트(www.info21c.net)에서 보다 상세한 설정을 하실 수 있습니다</Text>
          </View>
          <View style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', marginTop:20, width:"80%"}}>
            <TouchableOpacity onPress={()=>this.setState({suc_agree:this.state.suc_agree?false:true})}>
              <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                {
                  this.state.suc_agree
                  ?<Icon name='md-checkbox-outline' style={{color:'#35a0d5',fontSize:20}} />
                  :<Icon name='md-square-outline' style={{color:'#35a0d5',fontSize:20}} />
                }
                <Text style={{marginLeft:5,fontSize:14}}>
                    {this.state.bid_suc=='bid'?'낙찰':'입찰'}정보도 동일설정으로 저장</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Button style={{alignSelf:'center', alignItems: 'center', justifyContent:'center', marginBottom:40, marginTop:20, backgroundColor:'#5EA1FC', width:"60%"}}
            onPress={()=>this._onListConfSaveAction()}>
              <Text style={{marginLeft:10,color:'#fff',fontSize:16}}>저장</Text>
          </Button>
        </Content>
        <ConfigOptDlg onRef={ref=>(this.optionModal = ref)} onSelectCodes={this._onSelectCodes} bidtype={this.state.bidtype} />
        <Toast ref="toast" />
        <ActivityIndicator animating={this.state.animating} style={{position:'absolute',left:'45%',top:'25%'}} size="large" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFF',
    },
    content: {
      padding: 10,
      backgroundColor: '#f6f6f6'
    },
    body: {
      backgroundColor: '#ffffff',
      borderWidth:1,
      borderColor:'#ddd',
    },
    selected:{
    },
    disabled:{
      backgroundColor:'#d1d1d1',
      borderColor:'#d1d1d1',
      borderWidth:1
    },
    bottomBorder:{
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#bbb'
    },
    thinBorder:{
      borderWidth: 1 / PixelRatio.get(),
      borderColor: '#bbb'
    }
});

const mapStateToProps = state => {
  const { user, listConfs, saveResult } = state;
  return {
    userid: user.userid,
    deviceid: user.deviceid,
    officename: user.officename,
    cap: user.cap,
    state: user.state,
    listConf: listConfs.listConf,
    listConfs: listConfs.listConfs,
    saveResult: listConfs.saveResult
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestListConf:(params)=>{
      dispatch(requestListConf(params))
    },
    receiveListConfSave:(params)=>{
      dispatch(receiveListConfSave(params))
    },
    onUpdateListConfs:(params)=>{
      dispatch(onUpdateListConfs(params))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ConfigForm);
