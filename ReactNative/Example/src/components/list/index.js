import List from './list';
import Detail from './detail';
import TypeConfig from './type-config'
import ConfigForm from './config-form';
import Search from "../search/";

import { StackNavigator } from 'react-navigation';

export default ( StackNav = StackNavigator({
  List: { screen: List },
  Detail: { screen: Detail },
  TypeConfig: { screen: TypeConfig },
  ConfigForm: { screen: ConfigForm },
  Search: { screen: Search },
}, {
  navigationOptions: { header: null }
}));
