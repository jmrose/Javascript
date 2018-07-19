import React, { Component } from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, Platform, TouchableHighlight } from 'react-native';
import { View, Text, Icon, List, CheckBox, Footer, Button} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';

import { requestCodes } from '../../actions';
import { connect } from 'react-redux';
import Codes from '../../values/code';

const screen = Dimensions.get('window');

class Picker extends Component {
  componentWillMount(){
    this.state = {
      type: 'item',
      isOpen: false,
      codes:  [],
      selectCodes: []
    };
    this.props.onRef(this);
  }

  componentWillUnmount(){
    this.props.onSelectCodes(this.state.type, this.state.selectCodes);
    this.props.onRef(undefined);
  }

  _onOpen = (type, bidtype, selectCodes) => {
    this.setState({
      type: type,
      isOpen: true,
      selectCodes: selectCodes?selectCodes:[],
      codes: this.props.codes
    });
  }

  _onClose = () => {
    this.setState({
      isOpen: false
    });

    let codes=[];
    codes[this.state.type] = this.state.selectCodes;
    this.props.onSelectCodes(this.state.type, this.state.selectCodes);
  }

  _onSelected = (item, status) => {
    let selectCodes = this.state.selectCodes;

    if( this.state.type == 'bidtype' || this.state.type == 'apt') selectCodes = [];

    if( selectCodes.indexOf(item) != -1 ) selectCodes.splice( selectCodes.indexOf(item), 1);
    else selectCodes.push(item);

    this.setState({
      selectCodes: selectCodes
    }, ()=>{
      if( this.state.type == 'bidtype' || this.state.type == 'apt') this._onClose();
    });
  }

  _renderItem = (item) => {
    return (
				<TouchableOpacity
          onPress={ () => this._onSelected(item) }
					ref={c => (this._root = c)}
				>
          <View>
            <Text>{item.name}</Text>
            <CheckBox checked={false} />
          </View>
				</TouchableOpacity>
  	);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isOpen}
        onRequestClose={()=>{alert("modal close")}}
        >
        <TouchableNativeFeedback onPress={()=>this._onClose()}>
          <View style={{flex:1, padding:20, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback>
              <View style={{width:screen.width-40, height:screen.height-100,backgroundColor:'#fff',justifyContent:'flex-start'}}>
                <List ref="codelist" dataArray={this.state.codes}
                  renderRow={(item, index) => this._renderItem(item)}>
                </List>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableNativeFeedback >
      </Modal>
    );
  }
}

export default Picker;
