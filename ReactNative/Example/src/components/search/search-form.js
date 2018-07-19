import React, { Component } from "react";
import { TouchableOpacity, FlatList, Dimensions, TouchableNativeFeedback } from "react-native";
import {
  Container,
  Content,
  Header, Left, Body, Right, Title,
  Footer,
  Text,
  Button,
  Icon, View, Separator,
  Item, Input, Segment, Picker, List, ListItem, Radio, Label
} from "native-base";

import { Field, reduxForm } from 'redux-form';
import { NavigationActions } from 'react-navigation';
import { Grid, Row, Col } from 'react-native-easy-grid';

import styles from './styles';
import DialogItems from './dialog-items';
import Modal from 'react-native-modalbox';

const screen = Dimensions.get('window');

class SearchForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      bidtype:'con',
      items:[],
      location:[],
      apt:[{'code':'', name:'아파트공고'},{'code':'1','name':'아파트공고 포함'},{'code':'2','name':'아파트공고 제외'},{'code':'3','name':'아파트공고만 보기'}]
    }
  }

  componentDidMount(){
    this.setState({
      bidtype:'con',
      items:[{'code':'','name':'업종'},{'code':'1','name':'토목'},{'code':'2','name':'건축'}],
      location:[{'code':'','name':'지역'},{'code':'1','name':'서울'},{'code':'2','name':'경기'}]
    })
  }

  _renderSelect = ({input:{value, onChange, ...inputProps}, meta, style, ...props}) => {
        console.log("==========_renderSelect====", style);
    return (
        <Picker
          mode="dropdown"
          { ...inputProps }
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          { ...props } />
    );
  }

  _renderInput = ({input, label, placeholder, style, type, meta : {touched, error, warning}}) => {
    var hasError = false;
    if(error !== undefined){
      hasError = true;
    }
    return (
      <Item rounded style={style} error={hasError}>
        <Input placeholder={placeholder} {...input} />
        { hasError ? <Text>{error}</Text> : <Text /> }
      </Item>
    )
  }

  _renderItemList = (type, item) => {
    console.log("render", type, item);
    if( item.code == '' ){
      return (
          <View style={{flex:1,alignItems:'center',flexDirection:'row',marginHorizontal:10,paddingHorizontal:20,paddingVertical:10,justifyContent:'space-between',backgroundColor:'#eee',borderBottomWidth:0.5, borderColor:'#777'}}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={ () => this._openItemsWin(type) }>
              <Icon name="md-settings" style={{'color':'#999'}} />
            </TouchableOpacity>
          </View>
      );
    }else{
      return (
          <View style={{flex:1,flexDirection:'row',paddingHorizontal:20,marginHorizontal:10,paddingVertical:10,justifyContent:'space-between'}}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={ () => this._removeItemsList(type, item)}>
              <Icon name="md-close" style={{'color':'#777'}} />
            </TouchableOpacity>
          </View>
      );
    }
  }

  _removeItemsList = (type, item) => {

  }

  _openItemsWin = (type) => {
  this.refs.dialog.open();
  }

  _renderCheckbox = (item) => {
    if( item.code == ''){
      return (
        <View style={{flex:1,alignItems:'center',flexDirection:'row',marginHorizontal:10,paddingHorizontal:20,paddingVertical:10,justifyContent:'space-between',backgroundColor:'#eee',borderBottomWidth:0.5, borderColor:'#777'}}>
          <Text>{item.name}</Text>
          <TouchableOpacity><Icon name="md-settings" style={{'color':'#999'}} /></TouchableOpacity>
        </View>
      );
    }else{
      return (
        <View style={{flex:1,flexDirection:'row',paddingHorizontal:20,marginHorizontal:10,paddingVertical:10,justifyContent:'space-between'}}>
          <Text>{item.name}</Text>
          <Radio selected={false} />
        </View>
      );
    }
  }

  _onSubmit = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      key: 'Search',
      actions: [
        NavigationActions.navigate({
          routeName: 'List',
          params:{}
        })
      ]
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const { props : { name, index, list } } = this;
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Body>
            <Title style={styles.title}>통합검색</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
              <Icon active style={styles.title} name="md-close" />
            </Button>
          </Right>
        </Header>
        <Segment>
          <Button first><Text>입찰</Text></Button>
          <Button last active><Text>낙찰</Text></Button>
        </Segment>
        <Content style={{paddingHorizontal:20,paddingVertical:20,marginBottom:30}}>
          <Field name="word" placeholder="검색어(공고명,공고번호,발주기관) 입력" component={this._renderInput} />

          <View style={{flexDirection:'row',backgroundColor:'#ecf3f9',paddingHorizontal:15,paddingVertical:7,borderBottomWidth:0.5,borderBottomColor:'#9abfde',marginTop:30}}>
            <Icon style={{color:'#4389c2'}} name='md-funnel' />
            <Text style={{paddingLeft:10, color:'#4389c2'}}>상세조건</Text>
          </View>
          <Field name="bidtype" component={this._renderSelect} >
            <Picker.Item label="구분" value="" style={{backgroundColor:'#eee',borderBottomWidth:0.5, borderColor:'#777'}} />
            <Picker.Item label="공사" value="con" />
            <Picker.Item label="용역" value="ser" />
            <Picker.Item label="구매" value="pur" />
          </Field>
          <List dataArray={this.state.items}
            renderRow={(item) => this._renderItemList('items', item)}>
          </List>
          <List dataArray={this.state.location}
            renderRow={(item) => this._renderItemList('localtion', item)}>
          </List>
          <List style={{paddingBottom:10}} dataArray={this.state.apt}
            renderRow={this._renderCheckbox}>
          </List>
        </Content>
        <Footer>
          <Grid>
            <Col size={2}>
              <Button full dark>
                <Text>초기화</Text>
              </Button>
            </Col>
            <Col size={3}>
              <Button full onPress={this._onSubmit}>
                <Text>검색</Text>
              </Button>
            </Col>
          </Grid>
        </Footer>

        <Modal ref="dialog" style={{justifyContent:'center', alignItems:'center', height:300, width:100}}>
          <Content>
            <View>
              <Text>modal</Text>
            </View>
          </Content>
        </Modal>
      </Container>
    );
  }
}

const validate = values => {
  const error = {};
  error.word = "";
  return error;
};

export default reduxForm({
  form: 'search',
  validate
},
function bindAction(dispatch){
  return {
    setData: data => dispatch(setData(name))
  }
})(SearchForm);
