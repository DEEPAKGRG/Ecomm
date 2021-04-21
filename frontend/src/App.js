import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import { BrowserRouter as Router, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <div className="container container-fluid">
          <Route exact path="/" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />
        </div>
        <Footer></Footer>
      </div>
      d
    </Router>
  );
}

export default App;
