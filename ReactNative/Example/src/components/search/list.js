import React, { PureComponent } from "react";
import { FlatList, ActivityIndicator, TouchableHighlight, Platform, TouchableNativeFeedback } from "react-native";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
  Text,
  Button,
  Icon,
  ListItem,
  View,
  Item, Input, Fab
} from "native-base";
import { Grid, Row, Col } from 'react-native-easy-grid';

import { requestSucs } from "../../actions/sucs";
import styles from './styles';

class List extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      sucs:[],
      loading:false,
      refreshing:false,
      title:'',
      bid_suc:'suc',
      bidtype:'con',
      key:1,
      page:1
    }
  }

  componentDidMount(){

    console.log("===== search list componentDidMount==========================",this.props);
  }

  componentWillReceiveProps(nextProps){
    console.log(' componentWillReceiveProps----------', this.state, this.props, nextProps );
    //const { params } = nextProps.navigation.state;
    const { params } = nextProps.screenProps.parentNavigation.state;

    if( this.state.bid_suc != params.bid_suc || this.state.bidtype != params.bidtype || this.state.key != params.key ){
      this.setState({
        title : params.title,
        bid_suc : params.bid_suc,
        bidtype : params.bidtype,
        key : params.key,
        page: 1,
        loading: true
      },()=>{
        //this.props.requestSucs(params);
      });
    }else{
      this.setState({
        loading:false,
        sucs:nextProps.sucs,
        refreshing:false
      });
    }
  }

  _handleRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      sucs: []
    }, ()=>{
      const params = {
        title : this.state.title,
        bid_suc : this.state.bid_suc,
        bidtype : this.state.bidtype,
        key : this.state.key,
        page: this.state.page
      }
      this.props.requestSucs(params);
    });
  }

  _handleLoadMore = () => {
    this.setState({
      page: this.state.page+1,
      loading: true
    },()=>{
      const params = {
        title : this.state.title,
        bid_suc : this.state.bid_suc,
        bidtype : this.state.bidtype,
        key : this.state.key,
        page: this.state.page
      }
      this.props.requestSucs(params);
    });
  }

  _renderItem = ({item, index}) => {
    //console.log("=======_renderItem=========",index);
      if ( Platform.OS === "ios" || Platform.Version <= 21 ) {
  			return (
  				<TouchableHighlight
            onPress={ () => this._gotoDetail(item, index) }
  					ref={c => (this._root = c)}
  				>
            <Grid style={{padding:5}}>
              <Row>
                <Text>{item.constnm+' ['+item.notinum+']'}</Text>
              </Row>
              <Row>
                <Col style={{width:50,margin:5}}>
                  <Button bordered block style={{padding:5,paddingLeft:5,paddingRight:5}} onPress={()=>this._myboxAddition(item, index)}>
                    <Icon name={ item.state != 'Y' ? 'md-folder-open' : 'md-folder'} />
                  </Button>
                </Col>
                <Col>
                    <Row><Text style={{color:'#777'}}>{item.org}</Text></Row>
                    <Row>
                      <Col><Text style={{color:'#777'}}>{'입력 '+item.writedt}</Text></Col>
                      <Col><Text style={{color:'#777'}}>{'추정 '+item.presum}</Text></Col>
                    </Row>
                </Col>
              </Row>
            </Grid>
  				</TouchableHighlight>
  			);
  		} else {

  			return (
  				<TouchableNativeFeedback
            ref={c => this._root = c}
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={ () => this._gotoDetail(item, index) }
  				>
            <Grid style={{padding:5}}>
              <Row>
                <Text>{item.constnm+' ['+item.notinum+']'}</Text>
              </Row>
              <Row>
                <Col style={{width:50,margin:5}}>
                  <Button bordered block style={{padding:5,paddingLeft:5,paddingRight:5}} onPress={()=>this._myboxAddition(item, index)}>
                    <Icon name={ item.state != 'Y' ? 'md-folder-open' : 'md-folder'} />
                  </Button>
                </Col>
                <Col>
                    <Row><Text style={{color:'#777'}}>{item.org}</Text></Row>
                    <Row>
                      <Col><Text style={{color:'#777'}}>{'입력 '+item.writedt}</Text></Col>
                      <Col><Text style={{color:'#777'}}>{'추정 '+item.presum}</Text></Col>
                    </Row>
                </Col>
              </Row>
            </Grid>
  				</TouchableNativeFeedback>
  			);
  		}
  }

  renderSeparator = () => {
    return (
      <View style={{height:1, width:'100%', borderBottomColor:'#CED0CE', borderBottomWidth:1}} />
    )
  }

  _renderHeader = () => {
    return <View><Text>header</Text></View>
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
  }

  _gotoDetail = (item, index) => {
    this.props.navigation.navigate('Detail',{bidtype:item.bidtype,bidid:item.bidid});
  }

  _myboxAddition = (item, index) => {
    let datas = [...this.state.sucs];
    datas[index].state = item.state == 'Y' ? 'N' : 'Y';
    this.setState({
        sucs: datas
    },()=>{
      console.log("==============",this.state.sucs);
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.screenProps != null ? this.props.screenProps.parentNavigation.navigate("DrawerOpen") : this.props.navigation.navigate("DrawerOpen")}>
              <Icon active name="menu" />
            </Button>
          </Left>

          <Body>
            <Title>통합검색</Title>
          </Body>

          <Right />
        </Header>
        <Fab
          active={true}
          androidRippleColor={'#fffffff'}
          containerStyle={{width:30, height:30}}
          style={{ borderRadius:0, backgroundColor: '#ffffff', height:30, width:30, fontSize:11 }}
          position="bottomRight"
          onPress={this.__listScrollTop}>
          <Text style={{fontSize:11}}>Top</Text>
        </Fab>
        <FlatList
          ref="flatList"
          data={this.state.sucs}
          keyExtractor={(item, index) => index }
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
          />
      </Container>
    );
  }
}

List.PropTypes = {
    sucs:PropTypes.array,
    done:PropTypes.bool,
    mybox_result:PropTypes.bool
}

const mapStateToProps = (state) => {
  const { sucs, done, mybox_result, error } = state.sucs;
  return {
    sucs: sucs,
    done: done,
    mybox_result: mybox_result
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestSucs:(params)=>{
      dispatch(requestSucs(params))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(List);
