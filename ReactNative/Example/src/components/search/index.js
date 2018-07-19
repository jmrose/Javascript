import List from './list';
import SearchForm from "./search-form";

import { StackNavigator } from 'react-navigation';

export default ( StackNav = StackNavigator({
  SearchForm: { screen: SearchForm },
  List: { screen: List }
}, {
  navigationOptions: { header: null }
}));
