import React, {Component} from 'react';
import {Platform, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, Icon, List,ListItem} from 'native-base';

const screen = Dimensions.get('window');
const platform = Platform.OS;

class ConfigOptPanel extends Component {
  constructor(props) {
      super(props);

      this.state = {
          title: props.title,
          data: props.value,
          itemsText: '',
          itemsStyle: {height: 0},
          containerHeight: {height:40}
      };
  }

  componentWillMount() {
      this._addition();
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
          data: nextProps.value
      }, () => {
          this._addition();
      });
  }

  _addition = () => {
    let text = '';
    let h = 0;

    if(this.state.data){
      this.state.data.filter((item, key) => {
          if (key > 0)
              text += ' / ' + item.name;
          else
              text += item.name;
          }
      );

      this.setState({itemsText: text});
      h = (parseInt(text.length/35)*14);
      if( h==0 && text.length>0 ) h=14;

      this.setState({itemsStyle: {height: h+5}});
      this.setState({containerHeight: {height: h+40}});
    }
  }

  render() {
      return (
          <ListItem style={styles.itemContainer} onPress={() => this.props.openOptionModal(this.props.type)}>
              <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                  <Text style={{color:'#000'}}>{this.state.title}</Text>
                  <Icon style={{color:'#555',marginLeft:5}} name='ios-arrow-down'/>
                </View>
                <View style={[{flexDirection: 'row',marginTop:4}]}>
                    <Text style={[{fontSize:13,color:'#555'}]}>
                        {this.state.itemsText}
                    </Text>
                </View>
              </View>

          </ListItem>
      );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    marginLeft:15,
    marginRight:15,
    paddingTop:10,
    paddingBottom:10
  }
});

export default ConfigOptPanel;
