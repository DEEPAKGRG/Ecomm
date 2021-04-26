import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";

import Cart from "./components/cart/Cart";

import ProductDetails from "./components/product/ProductDetails";
import ProtectedRoute from "./components/route/ProtectedRoute";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UpdatePassword from "./components/user/UpdatePassword";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useEffect } from "react";
import UpdateProfile from "./components/user/UpdateProfile";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

function App() {
  // to get the current logged in user when page is refreshed
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <div className="App">
        <Header></Header>
        <div className="container container-fluid">
          <Route exact path="/" component={Home} />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <Route exact path="/cart" component={Cart} />

          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />
        </div>
        <Footer></Footer>
      </div>
      d
    </Router>
  );
}

export default App;
