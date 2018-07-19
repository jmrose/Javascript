import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AppRegistry, SectionList, Image, View, Dimensions, TouchableOpacity, TouchableNativeFeedback, StyleSheet } from "react-native";
import { Container,  Content,  Button,  Text,  Icon,  H1, H2, H3 } from "native-base";
import { NavigationActions } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { requestListConfs } from '../../actions/listConfs';
import Category from './category';
import styles from './styles';
import theme from '../../../native-base-theme/variables/customer';

class DrawBar extends React.Component {

  constructor(){
    super();
    this.state = {
      listConfs: {},
      CategoryType : '',
      CategoryTitle : '',
      CategorySource : []
    }
  }

  componentDidMount(){
    const { dispatch, userid, listConfs } = this.props;
    dispatch(requestListConfs(userid));
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      listConfs : nextProps.listConfs,
      CategoryType : 'Bids',
      CategoryTitle : '리스트',
      CategorySource : nextProps.listConfs.bid
    });
    //console.log('componentWillReceiveProps', nextProps.listConfs);
  }

  _selectItem = (categoryType, categoryName, category) => {
    if(categoryType == 'Search' || categoryType == 'Setting'){
      this.setState({
        CategoryType : categoryType,
        CategoryTitle : categoryName,
        CategorySource : []
      });
      this.props.navigation.navigate(categoryType);
    }else{
      this.setState({
        CategoryType : categoryType,
        CategoryTitle : categoryName,
        CategorySource : category
      });
    }
  }

  _renderItem = ({item}) => {
    return (
      <View style={{paddingVertical:5, marginLeft:15, marginRight:15}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.CategoryType, {
            //categoryName : this.state.CategoryTitle,
            title:item.name,
            bid_suc:item.bid_suc,
            bidtype:item.bidtype,
            key:item.key,
            page:1
          })}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderSectionHeader = ({section}) => {
    if( !section.title ) return <Text style={{height:0}}></Text>;
    return (
        <View style={styles.sectionHeader}>
          <Text style={{paddingHorizontal:10}}>{section.title}</Text>
        </View>
    );
  }

  render() {
    return (
      <Container>
        <Grid>
          <Row size={8} style={{backgroundColor:theme.brandPrimary}}>
            <Col size={22}>
              <Button
                transparent
                onPress={()=>this.props.navigation.navigate('Home')}
                >
                <Icon style={{color:'#ffffff'}} name='ios-home-outline' />
              </Button>
            </Col>
            <Col size={80}>
              <H2 style={{paddingVertical:10,color:'#ffffff'}}>Info21c</H2>
            </Col>
            <Col size={20}>
              <Button transparent onPress={()=>this.props.navigation.navigate('DrawerClose')}>
                  <Icon style={{color:'#ffffff'}} name='md-close' />
              </Button>
            </Col>
          </Row>
          <Row size={8} style={{backgroundColor:theme.brandPrimary}}>
            <TouchableOpacity>
              <View style={{flexDirection:'row',paddingHorizontal:10}}>
                <Text style={{color:'#ffffff'}}>{user.name}</Text>
                <Icon style={{color:'#ffffff',paddingLeft:20,fontSize:16,marginTop:3}} name='ios-arrow-forward' />
              </View>
              <Text style={{color:'#ffffff',paddingHorizontal:10, alignItems:"center"}}>{user.state}</Text>
            </TouchableOpacity>
          </Row>
          <Row size={85}>
            <Col style={{width:100, flexDirection:'column', backgroundColor:'#e7e7e7'}}>
              <Category iconnm='md-list-box' text='리스트'
                selected={(this.state.CategoryType=='Bids')?'active':'none'}
                onPress={()=>this._selectItem('Bids', '리스트', this.state.listConfs.bid)} />
              <Category iconnm='ios-folder-open' text='개인정보'
                selected={(this.state.CategoryType=='Mybox')?'active':'none'}
                onPress={()=>this._selectItem('Mybox', '개인정보', this.state.listConfs.mybox)} />
              <Category iconnm='ios-paper' text='자료실'
                selected={(this.state.CategoryType=='Etc')?'active':'none'}
                onPress={()=>this._selectItem('Etc', '자료실', this.state.listConfs.etc)} />
              <Category iconnm='ios-call' text='고객센터'
                selected={(this.state.CategoryType=='Customer')?'active':'none'}
                onPress={()=>this._selectItem('Customer', '고객센터', this.state.listConfs.customer)} />
              <Category iconnm='md-settings' text='설정'
                selected={(this.state.CategoryType=='Setting')?'active':'none'}
                onPress={()=>this._selectItem('Setting', '설정', null)}  />
            </Col>
            <Col style={{paddingHorizontal:10}}>
              <View style={{borderBottomColor:'#343434', borderBottomWidth:2}}>
                <Text style={{padding:10, alignSelf:'stretch'}}>{this.state.CategoryTitle}</Text>
              </View>
              <SectionList
                renderItem={this._renderItem}
                renderSectionHeader={this._renderSectionHeader}
                sections = {this.state.CategorySource}
              />
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateTopProps = state =>({
    //userid: state.user.userid
    userid: 'devinfo',
    listConfs: state.listConfs.listConfs
});

export default connect(mapStateTopProps)(DrawBar);
