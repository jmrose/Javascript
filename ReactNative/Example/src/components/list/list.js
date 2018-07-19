import React, { PureComponent } from "react";
import {
    FlatList, ActivityIndicator,
    TouchableOpacity, Platform,
    Text, TouchableNativeFeedback,
    Picker, Animated,
    Easing, Alert,
    NativeModules,
    LayoutAnimation
} from "react-native";

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Header,
  Left, Body, Right,
  Title, Button,
  Icon,
  View
} from "native-base";

import Feather from 'react-native-vector-icons/Feather';

import { Grid, Row, Col } from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';

import { requestList, requestMyboxAdd } from "../../actions";

import Fab from './fab';
import styles from './styles';
import OptionModal from './option-modal';
import Toast from '../utils/toast';

import url from '../../values/url';
import { fetchPosts } from '../../actions/sync-network';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

var CustomLayoutAnimation = {
    duration:200,
    create:{
        type:LayoutAnimation.Types.linear,
        property:LayoutAnimation.Properties.opacity
    },
    update:{
        type:LayoutAnimation.Types.easeInEaseOut
    }
};

class List extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      sort: '',
      ordering: '',
      searchType : 'config',
      list:[],
      loading:false,
      refreshing:false,
      scrolling: false,
      userid: '',
      deviceid: '',
      userState: '',
      title:'',
      itemcode: '',
      itemcode_name: '',
      location: '',
      location_name: '',
      kind: '',
      kind_name: '',
      price: '',
      price_name: '',
      key:1,
      page:1,
      sortScale: 0,
      sortHeight: 0,
      filterScale: 0,
      filterHeight: 0
      // sortScale: new Animated.Value(0),
      // sortHeight: new Animated.Value(0),
      // filterScale: new Animated.Value(0),
      // filterHeight: new Animated.Value(0)
    }
  }

  componentDidMount(){
    // const { params } = this.props.navigation.state;
    if( !this.props.userid ) this.props.screenProps.parentNavigation.dispatch('Login');
    const { params } = this.props.screenProps.parentNavigation.state;

    this.setState({
      sort: '',
      ordering: '',
      userid: this.props.userid,
      deviceid: this.props.deviceid,
      userState: this.props.userState,
      title : params.title,
      key : params.key,
      use: params.use,
      itemcode: '',
      itemcode_name: '',
      location: '',
      location_name: '',
      kind: '',
      kind_name: '',
      price: '',
      price_name: '',
      page: 1,
      refreshing: true
    },()=>{
      if( this.state.use == 'N' ) this._goConfig();
      else this._requestList();
    });
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.screenProps.parentNavigation.state;

    // drawer 메뉴에서 접근을 하는 경우
    if( this.state.key != params.key ){
      this.setState({
        sort: '',
        ordering: '',
        list:[],
        userid: this.props.userid,
        deviceid: this.props.deviceid,
        userState: this.props.userState,
        title: params.title,
        key: params.key,
        use: params.use,
        itemcode: '',
        itemcode_name: '',
        location: '',
        location_name: '',
        kind: '',
        kind_name: '',
        price: '',
        price_name: '',
        page: 1,
        refreshing: true
      },()=>{
        if( this.state.use == 'N' ) this._goConfig();
        else this._requestList();
      });
    }else if(nextProps.list && nextProps.params){
      this.setState({
        loading:false,
        list:nextProps.list,
        sort:nextProps.params.sort?nextProps.params.sort:this.state.sort,
        ordering:nextProps.params.ordering?nextProps.params.ordering:this.state.ordering,
        refreshing:false
      }, ()=>{
      });
    }else{
      if( nextProps.error && nextProps.error.toString().indexOf('SyntaxError') ){
        Alert.alert(
          null,
          '에러가 있습니다. 관리자에 문의하여 주십시오',
          [{ text:'확인'}]
        );
      }else if( nextProps.error ){
        Alert.alert(
          null,
          '네트워크가 불안정합니다',
          [{ text:'확인'}]
        )
      }

      this.setState({
        list:[],
        loading:false,
        refreshing:false
      }, ()=>{
      });
    }
  }

  _requestList = () => {
    this._onHide();

    let values = {...this.state};
    values['list'] = [];
    values['sortHeight'] = '';
    values['filterScale'] = '';
    values['filterHeight'] = '';
    this.props.requestList(values);
  }

  _goConfig = () => {
    this.setState({
      loading:false,
      list:[],
      refreshing:false
    });

    Alert.alert(
      null,
      '설정 시, \n원하는 정보를 확인할 수 있습니다. \n설정하시겠습니까?',
      [
        { text:'확인', onPress:()=>this.props.navigation.navigate({
            key:'ConfigForm',
            routeName:'ConfigForm',
            params: {
            division_name:this.state.title,
            division:this.state.key,
            setParams:this._setParams,
            handleRefresh: this._handleRefresh
          }
        })
        },
        { text:'취소', onPress:()=>this.props.screenProps.parentNavigation.navigate("Home") }
      ]
    );
  }

  // 초기화하기
  _initList = () => {

    this.setState({
      sort: '',
      ordering: '',
      page: 1,
      list:[],
      refreshing: true,
      loading: false,
      itemcode: '',
      itemcode_name: '',
      location: '',
      location_name: '',
      kind: '',
      kind_name: '',
      price: '',
      price_name: '',
    },()=>{
        if(this.state.sortScale._value != 0 || this.state.filterScale._value != 0){
            this._onHide();
            setTimeout(()=>{
                this._requestList();
            }, 1000);
        }else this._requestList();
    });
  }

  _setParams = (params) => {
    this.setState({
      use: params.use ? params.use : this.state.use,
      itemcode: '',
      itemcode_name: '',
      location: '',
      location_name: '',
      kind: '',
      kind_name: '',
      price: '',
      price_name: ''
    });
  }

  _handleRefresh = () => {
    this._onHide();
    this.setState({
      page: 1,
      refreshing: true
    }, ()=>{
      this._requestList();
    });
  }

  _handleLoadMore = () => {
    this._onHide();
    if( !(this.state.list.length % 30) ){
      this.setState({
        page: this.state.page+1,
        loading: true
      },()=>{
        this._requestList();
      });
    }
  }

  _scrolling = (event:Object) => {
    this._onHide();
    if( event.nativeEvent.contentOffset.y > 20 )
      this.setState({scrolling: true});
    else
      this.setState({scrolling: false});
  }

  _onSort = (sort, ordering) => {
    this._onHide();

    if( sort == this.state.sort ){
      ordering = ordering == 'desc' ? 'asc' : 'desc';
    }

    this.setState({
      page: 1,
      refreshing: true,
      sort: sort,
      ordering: ordering
    }, ()=>{
      this._requestList();
    });
  }

  _onSelectParams = (type, value) => {
    let state = this.state;
    this.setState({
      itemcode: type == 'itemcode' ? value.code : state.itemcode,
      itemcode_name: type == 'itemcode' ? value.name : state.itemcode_name,
      location: type == 'location' ? value.code : state.location,
      location_name: type == 'location' ? value.name : state.location_name,
      kind: type == 'kind' ? value.code : state.kind,
      kind_name: type == 'kind' ? value.name : state.kind_name,
      price: type == 'price' ? value.code : state.price,
      price_name: type == 'price' ? value.name : state.price_name,
      searchType : 'config'
    }, ()=>{
      // console.log("_onSelectParams", this.state);
    });
  }

  // 업종/지역/공고타입 조건 검색
  _onFilterSubmit = () => {
    this._onHide();
    this.setState({
      page: 1,
      refreshing: true
    }, ()=>{
      this._requestList();
    });
  }

  _renderItem = ({item, index}) => {
    return (
  	<TouchableOpacity
            ref={c => this._root = c}
            onPress={ () => this._gotoDetail(item, index) }>
            <Grid style={{padding:5,paddingHorizontal:10,zIndex:0,elevation:0,borderBottomColor:'#ccc',borderBottomWidth:0.6}}>
              <Row style={{paddingVertical:5}}>
                <Text style={{fontSize:15,color:'#171717'}}>
                  {item.title}
                </Text>
              </Row>
              <Row>
                <Col>
                    <Row><Text style={{color:'#666',fontSize:13}}>{item.org}</Text></Row>
                    <Row>
                      <Col size={0.7}><Text style={{color:'#486ec1',fontSize:13}}>{item.date_label+' '+item.date_value}</Text></Col>
                      <Col size={1.3}><Text style={{color:'#666',fontSize:13}}>{this.state.price}</Text></Col>
                    </Row>
                </Col>
              </Row>
            </Grid>
	</TouchableOpacity>
  	);
     }
  }

  _onHide = () => {
      LayoutAnimation.configureNext(CustomLayoutAnimation);
      this.setState({
          filterHeight:0,
          sortHeight:0
      });
  }

  _onSortToggle = () => {
      // LayoutAnimation.spring();
      LayoutAnimation.configureNext(CustomLayoutAnimation);
      if(this.state.sortHeight == 0){
          this.setState({
              filterHeight:0,
              sortHeight:206
          });
      }else this.setState({sortHeight:0});
  }

  _onFilterToggle = () => {
      LayoutAnimation.configureNext(CustomLayoutAnimation);
      if(this.state.filterHeight == 0){
          this.setState({
              sortHeight:0,
              filterHeight:256
          });
      }else this.setState({filterHeight:0});
  }

  _openOptionModal = (type) => {
    this.optionModal._onOpen(type);
  }

  _renderHeader = () => {
    let strFilter = this.state.itemcode_name+' '+this.state.location_name+' '+this.state.kind_name+' '+this.state.price_name;
    if( strFilter.length > 10 ) strFilter = (strFilter).substring(0,10)+'...';
    // console.log('_renderHeader', this.state);
    return (
      <Grid>
        <Row style={{backgroundColor:'#e3e3e3',paddingVertical:15,justifyContent: 'space-between'}}>
            <Button small transparent dark onPress={() => this._onSortToggle()} style={{paddingLeft: 5, paddingRight: 0}}>
              <Icon style={{transform:[{rotate: '90deg'}]}} name='md-swap' />
              <Text style={{color:'#111'}}>정렬</Text>
            </Button>
            <Button small transparent dark onPress={() => this._onFilterToggle()} style={{paddingLeft: 0, paddingRight: 0}}>
              <Icon name='md-funnel' style={[this.state.itemcode!==''||this.state.location!== ''||this.state.kind||this.state.price?{color:'#1892d3'}:{}]} />
              {
                this.state.itemcode !== '' ||this.state.location !=='' ||this.state.kind||this.state.price
                ? <Text style={{color:'#1892d3'}}>{strFilter}</Text>
                : <Text style={{color:'#111'}}>종목/지역/타입</Text>
              }
            </Button>
            <Button small transparent dark onPress={() => this._initList()} style={{paddingLeft: 0, paddingRight: 10}}>
              <Icon name='ios-refresh' />
              <Text style={{color:'#111'}}>초기화</Text>
            </Button>
        </Row>
        <Row style={{height:this.state.filterHeight}}>
            {
                this.state.filterHeight > 0
                ?
                <View style={{flex:1, backgroundColor:'#e3e3e3', paddingHorizontal:15}}>
                    <Button block transparent dark style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._openOptionModal('itemcode')}>
                      {
                        this.state.itemcode_name
                        ? <Text style={{width:100,color:'#ff0000'}}>{this.state.itemcode_name}</Text>
                        : <Text style={{width:100}}>종목</Text>
                      }
                      <Icon style={{color:'#777'}} name='ios-arrow-down' />
                    </Button>
                    <Button block transparent dark style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._openOptionModal('location')}>
                      {
                        this.state.location_name
                        ? <Text style={{width:100,color:'#ff0000'}}>{this.state.location_name}</Text>
                        : <Text style={{width:100}}>지역</Text>
                      }
                      <Icon style={{color:'#777'}} name='ios-arrow-down' />
                    </Button>
                    <Button block transparent dark style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._openOptionModal('kind')}>
                      {
                        this.state.kind_name
                        ? <Text style={{width:100,color:'#ff0000'}}>{this.state.kind_name}</Text>
                        : <Text style={{width:100}}>타입</Text>
                      }
                      <Icon style={{color:'#777'}} name='ios-arrow-down' />
                    </Button>
                    <Button block transparent dark style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._openOptionModal('price')}>
                      {
                        this.state.price_name
                        ? <Text style={{width:100,color:'#ff0000'}}>{this.state.price_name}</Text>
                        : <Text style={{width:100}}>금액보기</Text>
                      }
                      <Icon style={{color:'#777'}} name='ios-arrow-down' />
                    </Button>
                    <Button block transparent dark
                      style={[this.state.itemcode_name||this.state.location_name||this.state.kind_name||this.state.price_name?{backgroundColor:'#5ea1fc'}:{backgroundColor:'#ccc'}]}
                      onPress={this._onFilterSubmit}>
                      <Text style={[this.state.itemcode_name||this.state.location_name||this.state.kind_name||this.state.price_name?{color:'#fff'}:{color:'#888'}]}>조건적용</Text>
                    </Button>
                </View>
                : null
            }
        </Row>
        <Row style={{height:this.state.sortHeight}}>
            {
                this.state.sortHeight > 0
                ?
                <View style={{flex:1, backgroundColor:'#e3e3e3', paddingHorizontal:15}}>
                    <Button block transparent style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._onSort('writedt', this.state.ordering)}>
                      <Text style={[{width:100},this.state.sort=='writedt'?{color:'#ff0000'}:{color:'#999'}]}>날짜1</Text>
                      <Icon style={{color:'#777'}} name={this.state.sort=='writedt'&&this.state.ordering=='desc'?'md-arrow-dropdown':'md-arrow-dropup'} />
                    </Button>
                    <Button block transparent dark style={{backgroundColor:'#fff',marginBottom:6}} onPress={()=>this._onSort('closedt', this.state.ordering)}>
                      <Text style={[{width:100},this.state.sort=='closedt'?{color:'#ff0000'}:{color:'#999'}]}>날짜2</Text>
                      <Icon style={{color:'#777'}} name={this.state.sort=='closedt'&&this.state.ordering=='desc'?'md-arrow-dropdown':'md-arrow-dropup'} />
                    </Button>
                </View>
                : null
            }
        </Row>
      </Grid>
    );
  }

  _listEmptyComponent = () => {
    return (
      <View style={{marginTop:30,marginBottom:30,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:16}}>
            {
                this.state.refreshing
                ? '검색 중입니다'
                : '검색된 결과가 없습니다'
            }
        </Text>
      </View>
    );
  }

  _renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  _listScrollTop = () => {
    this.refs.flatList.scrollToOffset({x:0,y:0,animated:true});
  }

  _gotoDetail = (item, index) => {
    this._onHide();

    if(this.props.userState != 4){
      Alert.alert(null, '유료서비스 입니다');
    }else{
      this.props.navigation.navigate({
        key:'Detail',
        routeName:'Detail',
        params:{
          type:item.type,
          id:item.id,
          index:index,
        }
      });
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.screenProps.parentNavigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>

          <Body>
            <Title>{this.state.title}</Title>
          </Body>

          <Right>
            <Button
              transparent
              onPress={()=>{
                  this._onHide();
                  this.props.navigation.navigate({
                    key:'Search',
                    routeName:'Search',
                    params: {}
                  });
                }
              }>
              <Icon active name="ios-search" />
            </Button>
            <Button
              transparent
              onPress={()=>{
                  this._onHide();
                  this.props.navigation.navigate({
                    key:'ConfigForm',
                    routeName:'ConfigForm',
                    params: {
                    division_name:this.state.title,
                    type:this.state.type,
                    division:this.state.key,
                    setParams:this._setParams,
                    handleRefresh: this._handleRefresh
                  }});
                }
              }>
              <Icon active name="md-settings" />
            </Button>
          </Right>
        </Header>

        <Fab ref='fab' scrolling={this.state.scrolling} onPress={this._listScrollTop} />
        <FlatList
          ref="flatList"
          extraData={this.state}
          data={this.state.list}
          keyExtractor={(item, index) => index }
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          ListEmptyComponent={this._listEmptyComponent}
          onRefresh={this._handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
          onScroll={this._scrolling}
          />
        <OptionModal onRef={ref=>(this.optionModal = ref)} onSelectParams={this._onSelectParams} />
        <Toast ref="toast" />
      </Container>
    );
  }
}

List.PropTypes = {
    list:PropTypes.array,
    params:PropTypes.array,
    done:PropTypes.bool
}

const mapStateToProps = (state) => {
  const { list, user } = state;

  return {
    userid: user.userid,
    deviceid: user.deviceid,
    userState: user.state,
    list: list.list,
    error: list.error
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestList:(params)=>{
      dispatch(requestList(params))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(List);
