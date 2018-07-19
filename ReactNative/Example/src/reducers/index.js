import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import user from "./user";
import home from "./home";
import list from "./list";


export default combineReducers({
  form: formReducer,
  user,
  home,
  list
});
