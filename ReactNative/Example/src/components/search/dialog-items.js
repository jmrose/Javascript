import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Container, Content, View, Text } from 'native-base';

import Modal from 'react-native-modalbox';

const screen = Dimensions.get('window');

class DialogItems extends Component {
  componentWillMount(){
    this.props.onRef(this);
    console.log( this.props );
  }

  _onOpen = (type) => {
    //window.alert('do stuff');
    this.refs.dialog.open();
  }

  render() {
    return (
      <Modal ref="dialog" style={{justifyContent:'center', alignItems:'center', height:300, width:100}}>
        <Content>
          <View>
            <Text>modal</Text>
          </View>
        </Content>
      </Modal>
    );
  }
}

export default DialogItems;
