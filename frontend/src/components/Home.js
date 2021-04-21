import React, { Fragment } from "react";
// import "../App.css";
import { Link } from "react-router-dom";
import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import Loader from "./layout/Loader";

import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../actions/productActions";
import { useAlert } from "react-alert";
import { useEffect } from "react";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  
  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Fragment>
          <MetaData title={`Buy Best Products`} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
