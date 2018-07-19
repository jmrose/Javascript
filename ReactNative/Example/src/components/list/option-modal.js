import React, {Component} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import {
    View,
    Text,
    Icon,
    List,
    ListItem,
    Button
} from 'native-base';

import {Grid, Row, Col} from 'react-native-easy-grid';
import {connect} from 'react-redux';
const screen = Dimensions.get('window');

class OptionModal extends Component {
    componentWillMount() {
      this.state = {
          type: 'itemcode',
          isOpen: false,
          modalTitle: {
              'itemcode': '업종을 선택하세요',
              'location': '지역을 선택하세요',
              'bid_kind': '공고타입을 선택하세요',
              'price': '금액보기 항목을 선택하세요'
          },
          params: [],
          codes: []
      };

      this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps){
      // console.log('componentWillReceiveProps',nextProps);
      this.setState({
        params: nextProps.params
      });
    }

    _onOpen = (type) => {
        this.setState({
            isOpen: true,
            type: type,
            codes: this.state.params[type]
        });
    }

    _onClose = () => {
        this.setState({isOpen: false});
    }

    _onSelected = (item) => {
      this.props.onSelectParams(this.state.type, item);
      this._onClose();
    }

    _renderItem = (item) => {
        return (
          <ListItem onPress={()=>this._onSelected(item)} style={{paddingHorizontal:10}}>
            <Text>{item.name}</Text>
          </ListItem>
        );
    }

    render() {
        return (
        <Modal animationType="fade" transparent={true} visible={this.state.isOpen} onRequestClose={() => this._onClose()}>
            <TouchableWithoutFeedback>
                <View style={{flex:1, alignItems: 'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <TouchableWithoutFeedback>
                      <View style={{
                          backgroundColor:'#fff',
                          width: screen.width - 40,
                          height: screen.height - 100,
                      }}>
                        <View style={styles.header}>
                            <Text>{this.state.modalTitle[this.state.type]}</Text>
                            <TouchableOpacity onPress={() => this._onClose()}>
                              <Icon name="md-close" style={{'color' : '#777'}}/>
                            </TouchableOpacity>
                        </View>
                        <List ref="codelist" dataArray={this.state.codes} renderRow={(item, index) => this._renderItem(item)}></List>
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
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#ddd',
    alignItems:'center',
    height:55,
    paddingVertical:20,
    paddingHorizontal:20
  }
});

const mapStateToProps = (state) => {
    const { bids } = state;
    return { params: bids.params };
}

export default connect(mapStateToProps, null)(OptionModal);
