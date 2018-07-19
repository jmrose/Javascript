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
        </Grid>
      </Content>
      <Toast ref="toast" />
    </Container>);
  }
}

const mapStateToProps = state => {
  const {user, home} = state;

  return {
    userid: user.userid ? user.userid : '',
    deviceid: user.deviceid ? user.deviceid : '',
    state: user.state ? user.state : '',
    notice: home.notice ? home.notice : '',
  }
}

export default connect(mapStateToProps, null)(Home);
