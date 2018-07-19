## 예제로 배우기

참조 : https://github.com/start-react/native-starter-kit

<br>

### Redux, Store, Router 정리

#### index.js
<pre>
<code>
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AppRegistry } from 'react-native';
import setup from './src/setup';

AppRegistry.registerComponent('App', () => setup);
</code>
</pre>

<br>

#### setup.js
<pre>
<code>
/*********************  ************************************/

import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { StyleProvider, Root, Toast } from 'native-base';
import App from './App';
import configureStore from './configureStore';
import getTheme from '../native-base-theme/components';
import customer from '../native-base-theme/variables/customer';

function setup():React.Component {
  class Main extends Component {
    constructor() {
      super();
      this.state = {
        isLoading: false,
        store: configureStore(() => this.setState({ isLoading: false })),
      };
    }

    componentWillMount(){
      //this.state.store
    }

    componentWillReceiveProps(){
    }

    componentWillUnmount(){
      Toast.toastInstance = null;
    }

    render() {
      return (
        <StyleProvider style={getTheme(customer)}>
          <Provider store={this.state.store}>
            <Root>
              <App />
            </Root>
          </Provider>
        </StyleProvider>
      );
    }
  }

  return Main;
}

export default setup;

</code>
</pre>

#### promise.js
<pre>
<code>
function warn(error){
  throw error;
}

module.exports = () => next => action => (  
  typeof action.then === 'function'
  ? Promise.resolve(action).then(next, warn)
  : next(action)
);
</code>
</pre>

#### configureStore.js
<pre>
<code>

import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducer from './reducers';
import promise from './promise';

export default function configureStore(onCompletion:()=>void):any {
  const enhancer = compose(
    applyMiddleware(thunk, promise),
    autoRehydrate(),
    // devTools({
    //   name: 'Info21c', realtime: true
    // }),
  );

  const store = createStore(reducer, enhancer);
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  return store;
}

</code>
</pre>


#### App.js
<pre>
<code>
import React, { Component } from 'react';
import {
    StyleSheet, AppState, Platform, Modal, Alert, Linking, StatusBar, Image, AsyncStorage
} from 'react-native';
import CodePush from 'react-native-code-push';

import { Container, Content, Text, View } from 'native-base';

import MainStackRouter from './Routers/MainStackRouter';
import ProgressBar from './components/loaders/ProgressBar';

import theme from '../native-base-theme/variables/customer';

import DeviceInfo from 'react-native-device-info';
import { setIndex, getNotice, getSucwin, userStateCheck } from "./actions";
import {connect} from "react-redux";
import { SafeAreaView } from 'react-navigation';

import { pushNotifications } from './services';

pushNotifications.configure();

class App extends Component {
  constructor(props){
    super(props);

    //console.log('APP============', DeviceInfo.getUniqueID());
    this.state = {
      showInstalling: false,
      downloadProgress: 0,
      showNotification: false,
      time: 5,
      intro: true
    };
  }

  componentWillMount(){
    // CodePush.disallowRestart();
    const user = AsyncStorage.getItem('reduxPersist:user')
    .then((response)=>{
      return JSON.parse(response);
    }).then((json)=>{
      if( json && json.userid && json.deviceid ){
        this.props.userStateCheck({userid:json.userid, deviceid:json.deviceid});
      }
    });
    this.props.getNotice();
    this.props.getSucwin();

  }

  componentWillUnmount(){
    // CodePush.allowRestart();
    AppState.removeEventListener('change', this.handleStateChange);
  }

  componentDidMount(){
    CodePush.notifyAppReady();
    AppState.addEventListener('change', this.handleStateChange);

    // 버젼 체크
    fetch('http://djcp.info21c.net/info21c/mobile/setting/version')
    .then( res => {
      return res.json();
    })
    .then(function(response) {
      //https://play.google.com/store/apps/details?id=com.dongjin.Info21c&hl=kr
      // let regexp = /(softwareVersion([^<]+))/g;
      // let remoteVersion = (response._bodyText).match(regexp);
      // remoteVersion = (remoteVersion+'').replace(/softwareVersion">/g,'');
      // remoteVersion = (remoteVersion+'').replace(/ /g, '');
      //remoteVersion = '0';

      if( response.version > DeviceInfo.getVersion() && Platform.OS === "android" ){
        Alert.alert(null,
          '업데이트를 설치해야 정상적으로 사용할 수 있습니다',
          [
            {text:'확인', onPress:()=>{
              Linking.canOpenURL('market://details?id=com.dongjin.Info21c').then(supported => {
                if (!supported) {
                  console.log('not supported');
                } else {
                  return Linking.openURL('market://details?id=com.dongjin.Info21c');
                }
              }).catch(err => console.log('error', err));
            }}
          ]
        );
      }else{
      }
    }).catch((error) => {
    });

    CodePush.getCurrentPackage().then((localPackageInfo) => {
       console.log('[localPackageInfo]', localPackageInfo);
    });

    CodePush.checkForUpdate().then((remotePackage)=>{
      // CodePush.notifyAppReady();
      if(!remotePackage){
      }else{
        console.log('[remotePackage]', remotePackage);
        remotePackage.download((downloadProgress) => {
          console.log('[downloadProgress]', downloadProgress);
        }).then((localPackage) => {
          // CodePush.sync();
          localPackage.install(CodePush.InstallMode.IMMEDIATE, 0);
        });
      }
    }, (error)=>{
      console.log('error', error);
    });

    setTimeout(() => {
        this.setState({intro: false});
    }, 2000);
  }

  handleStateChange = (appState) => {

    console.log('handleStateChange', appState);
    if( appState === 'background'){
    }
  }

  _onClose = () => {
    this.setState({isOpen:false});
  }

  render() {
    if (this.state.intro) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2462d3'}}>
                <StatusBar animated hidden />
                <Image source={{uri: 'intro_logo'}} resizeMode='contain' style={{width: 160, height:70}} />
            </View>
        );
    } else {
        return (
            <SafeAreaView style={{flex:1}}>
                <MainStackRouter />
            </SafeAreaView>
        );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIndex: index => dispatch(setIndex(index)),
    getNotice: () => dispatch(getNotice()),
    getSucwin: () => dispatch(getSucwin()),
    userStateCheck: (params) => dispatch(userStateCheck(params))
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modal1: {
    height: 300
  }
});


export default connect(null, mapDispatchToProps)(App);

</code>
</pre>

#### Routers/MainStackRouter.js
<pre>
<code>
import React, { Component } from "react";
//import { AsyncStorage } from 'react-native';

import Home from './HomeDrawerRouter';
import Guide from '../components/guide/';
import Login from '../components/login/';
import Member from '../components/member/';
// import Join from '../components/join/';
// import pJoin from '../components/pjoin/';

import { StackNavigator } from 'react-navigation';

Home.navigationOptions = ({ navigation }) => ({
  header: null
});

Login.navigationOptions = ({ navigation }) => ({
  header: null
});

// Member.navigationOptions = ({ navigation }) => ({
//   header: null
// });

export default ( StackNav = StackNavigator({
  Guide: { screen: Guide },
  Home: { screen: Home },
  Login: { screen: Login },
  Member: { screen: Member },
  // Join: { screen: Join },
  // pJoin: { screen: pJoin },
},{
  initialRouteName: 'Home'
}));

</code>
</pre>

#### Routers/HomeDrawerRouter.js
<pre>
<code>
import React, { Component } from "react";
import Home from "../components/home/";
import Banner from "../components/home/banner";
import Bid from "../components/bids/";
import Suc from "../components/bids/";
import Mybox from "../components/mybox/";
import Search from "../components/search/";
import Bidassist from "../components/bidassist/";
import Customer from "../components/customer/";
import Setting from "../components/setting/";
import Join from '../components/join/';
import Pjoin from '../components/pjoin/';
import Find from '../components/find/';
import Member from '../components/member/';
import Login from '../components/login/';

import { DrawerNavigator, StackNavigator } from "react-navigation";

import DrawBar from "../components/drawerbar";

export default ( DrawNav = DrawerNavigator(
  {
    Home: { screen: Home },
    Bid: { screen: ({navigation, screenProps}) => <Bid screenProps={{parentNavigation:navigation, ...screenProps}} /> },
    Suc: { screen: ({navigation, screenProps}) => <Suc screenProps={{parentNavigation:navigation, ...screenProps}} /> },
    Search: { screen: Search },
    Mybox: { screen: Mybox },
    Bidassist: { screen: Bidassist },
    Customer: { screen: Customer },
    Setting: { screen: Setting },
    Join: { screen: Join },
    Pjoin: { screen: Pjoin },
    Find: { screen: Find },
    Member: { screen: Member },
    Banner: { screen: Banner },
    Login: { screen: Login },
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
));

</code>
</pre>

#### components/Home.js
<pre>
<code>
import React, {Component} from "react";
import {TouchableOpacity, TouchableHighlight, FlatList, Linking, Image, PixelRatio, Dimensions, Platform, BackHandler, Alert} from "react-native";
import {connect} from "react-redux";
import {DrawerNavigator, NavigationActions} from "react-navigation";
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Body,
  Right,
  Text,
  Icon,
  View,
  List,
  ListItem, Segment
} from "native-base";

import Swiper from 'react-native-swiper';
import { Grid, Row, Col } from 'react-native-easy-grid';

import styles from "./styles";
import url from '../../values/url';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import customerTheme from '../../../native-base-theme/variables/customer';

import { fetchGets } from '../../actions/sync-network';
import Toast from '../utils/toast';

class Home extends Component {
  static propTypes = {
    name: PropTypes.string,
    setIndex: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.string),
    openDrawer: PropTypes.func,
    notice: PropTypes.array,
    sucwin: PropTypes.object,
  };

  constructor(props){
    super(props);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;

    this.state = {
      swipers: [
        {"img":(<Image source={{uri: 'vs01'}} resizeMode='cover' style={{width:this.width, height:this.width - customerTheme.toolbarHeight}} />),"url":""},
        {"img":(<Image source={{uri: 'vs02'}} resizeMode='cover' style={{width:this.width, height:this.width - customerTheme.toolbarHeight}} />),"url":""},
        {"img":(<Image source={{uri: 'vs03'}} resizeMode='cover' style={{width:this.width, height:this.width - customerTheme.toolbarHeight}} />),"url":""}
      ]
    }
    this.backKeyPressedTime = 0;
  }

  componentWillMount() {
    if (Platform.OS === 'android') BackHandler.addEventListener('hardwareBackPress', this.onBack);

    // var thatState = this.state;
    // let req = fetchGets( url.banners, {});
    // req.then( res => {
    //   return res.json();
    // }).then( json => {
    //   this.setState({
    //     swipers: json
    //   });
    // });
  }

  componentWillUnmount() {
      if (Platform.OS === 'android') BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => {
      if (_.now() > this.backKeyPressedTime + 2000) {
          this.backKeyPressedTime = _.now();
          this.refs.toast.show({
              text: '뒤로 버튼을 한번 더 누르시면 종료됩니다.',
              duration: 2000
          });
      } else if (_.now() <= this.backKeyPressedTime + 2000) {
          BackHandler.exitApp();
      }
      return true;
  }

  educationVideo = (step) => (e) => {
      Linking.canOpenURL(url.education[step]).then(supported => {
        if (!supported) {
          console.log('not supported');
        } else {
          return Linking.openURL(url.education[step]);
        }
      }).catch(err => console.log('error', err));
  }

  render() {
    const noticeList = this.props.notice.length > 0 ? this.props.notice.map((data, i) => {
      return (
        <TouchableOpacity onPress={() => {
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Customer',
                        action:NavigationActions.reset({
                            index:0,
                            actions:[
                                NavigationActions.navigate({
                                    routeName: 'NoticeView',
                                    params: {num: data.num}
                                }),
                            ]
                        })
                    })
                );
            }} key={i}>
          <View style={{flexDirection:'row',paddingVertical:3}}>
              <Text numberOfLines={1} ellipsis='tail' style={{flex:1.7}}>{data.title} </Text>
              <Text style={{marginLeft:5}}>{data.strWritedaySum}</Text>
          </View>
        </TouchableOpacity>
      );
    }) : null;

    return (<Container style={styles.container}>
      <Header style={{backgroundColor:'#fff'}}>
        <Left>
          <Button transparent dark onPress={() => this.props.navigation.navigate("DrawerOpen")}>
            <Icon name="menu"/>
          </Button>
        </Left>

        <Body>
          <Image source={{uri: 'infomobilelogo'}} resizeMode='contain' style={{width: 140, height:20}} />
        </Body>
        <Right/>
      </Header>
      <Content>
        <Grid>
          <Row style={{
              height: this.width - customerTheme.toolbarHeight
            }}>
            <Swiper showsButtons width={this.width} height={this.width - customerTheme.toolbarHeight}>
            {this.state.swipers.map((item, key)=>{
              return (
                item.url
                ? <TouchableHighlight key={key} onPress={() => this.props.navigation.navigate({
                    key:'Banner',
                    routeName:'Banner',
                    params: { detailUrl: item.url }
                  })}>
                    <View key={key}>
                      {item.img}
                    </View>
                  </TouchableHighlight>
                : <View key={key}>
                    {item.img}
                  </View>
              )
            })}
            </Swiper>
          </Row>
          <Row size={30}>
            <Col>
              <Button full style={{backgroundColor:'#003040',flexDirection:'column',height:80, paddingLeft: 0, paddingRight: 0}} onPress={() => this.props.navigation.navigate(
                  !this.props.userid
                  ? 'Login'
                  : 'Bid', this.props.defaultBidConf)}>
                <Feather name='bar-chart-2' style={{color:'#fff',fontSize:24}}/>
                <Text style={{fontSize:14}}>맞춤입찰</Text>
              </Button>
            </Col>
            <Col>
              <Button full style={{backgroundColor:'#001545',flexDirection:'column',height:80, paddingLeft: 0, paddingRight: 0}} onPress={() => this.props.navigation.navigate(
                  !this.props.userid
                  ? 'Login'
                  : 'Suc', this.props.defaultSucConf)}>
                <Feather name='bar-chart-2' style={{color:'#fff',fontSize:24}}/>
                <Text style={{fontSize:14}}>맞춤낙찰</Text>
              </Button>
            </Col>
            <Col>
              <Button full style={{backgroundColor:'#003263',flexDirection:'column',height:80, paddingLeft: 0, paddingRight: 0}} onPress={() => {
                    if (!this.props.userid) {
                      this.props.navigation.navigate('Login');
                    } else if (this.props.state != 4) {
                      Alert.alert('알림', '유료회원 전용 서비스 입니다.', [{text: '확인'}], { cancelable: false });
                    } else {
                        this.props.navigation.dispatch(
                          NavigationActions.reset({
                            index: 0,
                            key: 'Mybox',
                            actions: [NavigationActions.navigate({routeName: 'Bid'})]
                          })
                        );
                    }
                  }}>
                <Feather name='inbox' style={{color:'#fff',fontSize:24}}/>
                <Text>서류함</Text>
              </Button>
            </Col>
            <Col>
              <Button full style={{backgroundColor:'#001024',flexDirection:'column',height:80, paddingLeft: 0, paddingRight: 0}} onPress={() =>
                  this.props.navigation.dispatch(
                    NavigationActions.reset({
                      index: 0,
                      key: 'Search',
                      actions: [NavigationActions.navigate({routeName: 'SearchForm', params: {}})]
                    })
                  )
                }>
                <Feather name='search' style={{color:'#fff',fontSize:24}}/>
                <Text style={{fontSize:14}}>통합검색</Text>
              </Button>
            </Col>
          </Row>
          <Row style={{marginTop: 15}}>
            <View style={{flex: 1,backgroundColor: '#fff',padding:20}}>
              <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', marginBottom:20}}>
                <Text style={{backgroundColor:'#dedede',borderRadius:20,paddingVertical:5,paddingHorizontal:25,fontWeight:'bold',fontSize:16}}>공지사항</Text>
                <TouchableOpacity style={{justifyContent:'flex-end'}} onPress={() => {
                        this.props.navigation.navigate('Notice')
                        this.props.navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: 'Customer',
                                action:NavigationActions.reset({
                                    index:0,
                                    actions:[
                                        NavigationActions.navigate({
                                            routeName: 'Notice'
                                        }),
                                    ]
                                })
                            })
                        );
                    }}>
                  <Text style={{backgroundColor:'#dedede',color:'#545454',fontSize:14,paddingHorizontal:10,borderRadius:3}}>more +</Text>
                </TouchableOpacity>
              </View>
              {noticeList}
            </View>
          </Row>
          <Row style={{marginTop: 5}}>
            <Col>
              <TouchableOpacity onPress={() => {
                      this.props.navigation.dispatch(
                          NavigationActions.navigate({
                              routeName: 'Bidassist',
                              action:NavigationActions.reset({
                                  index:0,
                                  actions:[
                                      NavigationActions.navigate({
                                          routeName: 'OrgTu'
                                      }),
                                  ]
                              })
                          })
                      );
                  }}>
                <View style={[styles.btnEtc]}>
                  <FAIcon name='line-chart' style={{color:'#737877',fontSize:26}} />
                  <Text style={{color:'#545454',fontSize:14,fontWeight:'bold'}}>발주처별{'\n'}투찰율</Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity onPress={() => {
                      this.props.navigation.dispatch(
                          NavigationActions.navigate({
                              routeName: 'Bidassist',
                              action:NavigationActions.reset({
                                  index:0,
                                  actions:[
                                      NavigationActions.navigate({
                                          routeName: 'NanLevel'
                                      }),
                                  ]
                              })
                          })
                      );
                  }}>
                <View style={[styles.btnEtc]}>
                  <Feather name='activity' style={{color:'#737877',fontSize:26}} />
                  <Text style={{color:'#545454',fontSize:14,fontWeight:'bold'}}>난이도{'\n'}계수</Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity onPress={() => {
                      this.props.navigation.dispatch(
                          NavigationActions.navigate({
                              routeName: 'Bidassist',
                              action:NavigationActions.reset({
                                  index:0,
                                  actions:[
                                      NavigationActions.navigate({
                                          routeName: 'Ra'
                                      }),
                                  ]
                              })
                          })
                      );
                  }}>
                <View style={[styles.btnEtc]}>
                  <FAIcon name='pie-chart' style={{color:'#737877',fontSize:26}} />
                  <Text style={{color:'#545454',fontSize:14,fontWeight:'bold'}}>경영상태{'\n'}평균비율</Text>
                </View>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row style={{
              marginTop: 2,
              backgroundColor: '#dde3eb',
              borderTopWidth:1,
              borderTopColor:'#c3cfde'
            }}>
            <View style={{flex: 1,backgroundColor: '#dde3eb',padding:15}}>
              <View style={{flexDirection:'row'}}>
                  <Text style={{marginRight: 5,fontWeight:'bold',fontSize:16}}>1순위 낙찰현황</Text>
                  <Text style={{marginLeft: 0,color:'#545353'}}>(기준: {this.props.sucwin.year}년 {this.props.sucwin.mon}월)</Text>
              </View>
              <View style={{marginTop:10,flexDirection:'row',justifyContent: 'space-between',borderBottomWidth:1, borderBottomColor:'#b6c4d6',paddingBottom:6}}>
                <View style={{flexDirection:'row', alignItems: 'center'}}>
                  <MIcon name="numeric-1-box" color='#e3646a' size={22}/>
                  <Text style={{color: "#545454"}}>최고낙찰금액</Text>
                </View>
                <View style={{marginRight:5}}>
                  <Text style={{color:'#545454',alignSelf:'flex-end'}}>
                    <Text style={{color: "#CC0000"}}>{this.props.sucwin.max_suc}</Text>원
                  </Text>
                  <Text style={{alignSelf:'flex-end',color: "#545454"}}>{this.props.sucwin.max_com}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent: 'space-between',marginTop:6}}>
                <View style={{flexDirection:'row', alignItems: 'center'}}>
                  <MIcon name="numeric-1-box" color='#e3646a' size={22}/>
                  <Text style={{color: "#545454"}}>최다낙찰건수</Text>
                </View>
                <View style={{marginRight:5}}>
                  <Text style={{color:'#545454',alignSelf:'flex-end'}}>
                    <Text style={{color: "#CC0000"}}>{this.props.sucwin.many_cnt}</Text>건
                  </Text>
                  <Text style={{alignSelf:'flex-end',color: "#545454"}}>{this.props.sucwin.many_com}</Text>
                </View>
              </View>
            </View>
          </Row>
          <Row style={{
              flex: 1,
              marginTop: 10,
              backgroundColor: '#fff',
              width:'90%',
              justifyContent:'center',
              alignItems:'center',
              alignSelf:'center'
            }}>
              <TouchableOpacity style={{
                  flex:1, flexDirection:'row', backgroundColor: '#f5dc00',padding:10, justifyContent:'center',alignItems:'center',borderRadius:3
                }} onPress={() => {
                  Linking.canOpenURL(url.kakaotalkapp).then(supported => {
                    if (!supported) {
                      return Linking.openURL(url.kakaotalkweb);
                    } else {
                      return Linking.openURL(url.kakaotalkapp);
                    }
                  }).catch(err => console.log('error', err));
                }}>
                <FAIcon name="comments" color="#741B47" size={22}/>
                <Text style={{
                    color: '#361c1a',
                    fontWeight: 'bold',
                    marginLeft: 10
                  }}>인포21C 카카오톡 친구추가</Text>
              </TouchableOpacity>
          </Row>
          <Row style={{flex: 1,marginTop: 20}}>
            <Col>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={() => {
                Linking.canOpenURL(url.tel).then(supported => {
                    if (!supported) {
                        console.log('not supported');
                    } else {
                        return Linking.openURL(url.tel);
                    }
                }).catch(err => console.log('error', err));
                }}>
                <View style={{flexDirection:'row',padding:5}}>
                  <Feather style={{fontSize:24}} name='phone' />
                  <Text style={{fontSize:18,fontWeight:'bold'}}> 고객센터</Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col style={{width:10}}>
              <View style={{borderLeftWidth:1,borderLeftColor:'#999',width:10,height:15,marginTop:10}}>
                <Text />
              </View>
            </Col>
            <Col>
              <TouchableOpacity style={{alignSelf:'center'}}  onPress={() =>
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Customer',
                        action:NavigationActions.reset({
                            index:0,
                            actions:[
                                NavigationActions.navigate({
                                    routeName: 'Qna'
                                }),
                            ]
                        })
                    })
                )}>
                <View style={{flexDirection:'row',padding:5}}>
                  <Text style={{fontSize:18,fontWeight:'bold'}}>문의하기(Q&A)</Text>
                </View>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row style={{flex: 1, marginTop: 30, backgroundColor:'#838991'}}>
            <View style={{flex: 1, flexDirection:'row',marginTop: 30,justifyContent: 'center',alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Policy", {url: 'use'})} style={[styles.btnFooter,{borderRightWidth:0,borderTopLeftRadius:5,borderBottomLeftRadius:5}]}>
                <Text style={{color: '#fff', fontSize:14}}>이용약관</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Policy", {url: 'protection'})} style={[styles.btnFooter]}>
                <Text style={{color: '#fff', fontSize:14}}>개인정보처리방침</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Policy", {url: 'tos'})} style={[styles.btnFooter,{borderLeftWidth:0,borderTopRightRadius:5,borderBottomRightRadius:5}]}>
                <Text style={{color: '#fff', fontSize:14}}>통합계정약관</Text>
              </TouchableOpacity>
            </View>
          </Row>
          <Row style={{flex: 1, paddingBottom:30, backgroundColor:'#838991'}}>
            <View style={{flex:1}}>
              <Text style={{marginTop:10, color:'#d1d1d1', fontSize:14, alignSelf:'center'}}>ⓒINFOSE corp.</Text>
            </View>
          </Row>
        </Grid>
      </Content>
      <Toast ref="toast" />
    </Container>);
  }
}

const mapStateToProps = state => {
  const {user, home, listConfs} = state;

  let defaultBidConf = {
    title: '설정1',
    bid_suc: 'bid',
    bidtype: 'con',
    key: 1,
    use: 'N'
  };

  let defaultSucConf = {
    title: '설정1',
    bid_suc: 'suc',
    bidtype: 'con',
    key: 1,
    use: 'N'
  };

  if( listConfs.listConfs.bid ) {
     let i = 0;
     listConfs.listConfs.bid.map(function(confs){
       confs.data.map(function(conf){
          if( conf.use == 'Y' && i == 0 ){
            defaultBidConf = {
              title: conf.name,
              bid_suc: conf.bid_suc,
              bidtype: conf.bidtype,
              key: conf.key,
              use: conf.use
            };
            i++;
          }
      });
    });
  }

  if( listConfs.listConfs.suc ) {
    let i = 0;
    listConfs.listConfs.suc.map(function(confs){
      confs.data.map(function(conf){
         if( conf.use == 'Y' && i == 0 ){
           defaultSucConf = {
             title: conf.name,
             bid_suc: conf.bid_suc,
             bidtype: conf.bidtype,
             key: conf.key,
             use: conf.use
           };
           i++;
         }
     });
   });
  }
  return {
    userid: user.userid ? user.userid : '',
    deviceid: user.deviceid ? user.deviceid : '',
    state: user.state ? user.state : '',
    notice: home.notice ? home.notice : '',
    sucwin: home.sucwin,
    defaultBidConf: defaultBidConf,
    defaultSucConf: defaultSucConf
  }
}

export default connect(mapStateToProps, null)(Home);

</code>
</pre>

#### actions/index.js
<pre>
<code>

import Url from '../values/url';
import { fetchPosts, fetchGets, receiveResult } from './network';

// Home
export const RECEIVE_NOTICE_LIST = 'RECEIVE_NOTICE_LIST';
export const RECEIVE_SUCWIN = 'RECEIVE_SUCWIN';
export const USER_STATE_CHECK = 'USER_STATE_CHECK';

export const USER_LOGIN = 'USER_LOGIN';
export const GET_MEMBER = 'GET_MEMBER';
export const USER_LOGOUT = 'USER_LOGOUT';

export const RECEIVE_LIST_CONFS = 'RECEIVE_LIST_CONFS';
export const RECEIVE_LIST_CONF =  'RECEIVE_LIST_CONF';
export const RECEIVE_LIST_CONF_SAVE =  'RECEIVE_LIST_CONF_SAVE';

export const RECEIVE_BIDS = 'RECEIVE_BIDS';
export const RECEIVE_MYBOX_ADDITION = 'RECEIVE_MYBOX_ADDITION';
export const RECEIVE_CODES = 'RECEIVE_CODES';
export const SET_FORMS = 'SET_FORMS';

// Home - 공지사항
export function getNotice() {
  return (dispatch, getState) => {
    return dispatch( fetchPosts(Url.notice.list, {home: true}, RECEIVE_NOTICE_LIST) );
  }
}

// Login - 로그인
export function loginExe(params) {
  return (dispatch, getState) => {
    return dispatch( fetchPosts(Url.login, params, USER_LOGIN) );
  }
}

// Setting - 로그아웃
export function logoutExe(){
  return (dispatch, getState) => {
    return dispatch( receiveResult( USER_LOGOUT, {}) );
  }
}

export function requestMember(params){
  return (dispatch, getState) => {
    return dispatch( fetchPosts(Url.member.select, params, GET_MEMBER) );
  }
}

// Drawer - 고객별 입찰 설정정보 전부 요청하기
export function requestListConfs(params){
  return ( dispatch, getState ) => {
    return dispatch( fetchGets(Url.listConfs, params, RECEIVE_LIST_CONFS) );
  }
}

// 입찰설정에서 변경 시 confs update
export function onUpdateListConfs(params){
  return ( dispatch, getState ) => {
    return dispatch( receiveResult( RECEIVE_LIST_CONFS, params ) );
  }
}

// Bid - 입찰 설정정보 요청하기
export function requestListConf(params){
  return ( dispatch, getState ) => {
    return dispatch( fetchGets(Url.listConf, params, RECEIVE_LIST_CONF) );
  }
}

// Bid - 입찰 설정정보 요청하기
export function receiveListConfSave(params){
  return ( dispatch, getState ) => {
    return dispatch( fetchPosts(Url.listConfSave, params, RECEIVE_LIST_CONF_SAVE) );
  }
}


// Bid - 입찰리스트 요청하기
export function requestBids(params){
  return ( dispatch, getState ) => {
    return dispatch( fetchGets(Url.bids, params, RECEIVE_BIDS) );
  }
}

//통합검색
export function setForms(forms){
    return {
      type: SET_FORMS,
      ...forms
    }
}

</code>
</pre>
