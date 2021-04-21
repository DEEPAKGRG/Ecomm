import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productDetailsReducer,
} from "./reducers/productReducers";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
});

const middleware = [thunk];
const initialStage = {};

const store = createStore(
  reducer,
  initialStage,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
