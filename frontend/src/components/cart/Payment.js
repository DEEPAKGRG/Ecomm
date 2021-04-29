import React, { Fragment, useEffect } from "react";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearErrors } from "../../actions/orderActions";

// elements from the react-stripe module
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import axios from "axios";

// if card details are invalid change the color
const options = {
  style: {
    base: {
      fontSize: "16px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const Payment = ({ history }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  //   creating a order to store in the mongodatabase
  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  //   getting back the info of the the order stored in the sesssionStorage of the browser at the time of confirm order
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    //   also saving other details in the order and which are in the sesssionStorage of the browser
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    //   stripe accepts payment in the lowest form of the currency so that have to convert it
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // disabling the button after the first click
    document.querySelector("#pay_btn").disabled = true;

    let res;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      //  sending request to the backend and backend will request to the stripe for the clientSecret and using this
      // client secret frontend now can send request to the stripe
      res = await axios.post("/api/v1/payment/process", paymentData, config);

      const clientSecret = res.data.client_secret;

      console.log(clientSecret);

      //   checking these things exist to avoid anykind of error
      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              country: "US",
              postal_code: shippingInfo.postalCode,
            },
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
        // enable the button in error case
        document.querySelector("#pay_btn").disabled = false;
      } else {
        // The payment is processed or not
        if (result.paymentIntent.status === "succeeded") {
          // if order successful then adding the payment info to the order
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

         
          
          //  creating an new order with all the details
          dispatch(createOrder(order));
          //   sending user to the success page
          localStorage.removeItem("cartItems");
          history.push("/success");
        } else {
          alert.error("There is some issue while payment processing");
        }
      }
    } catch (error) {
      document.querySelector("#pay_btn").disabled = false;
      alert.error(error.response.data.message);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Payment"} />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              {/* these elements of stripe will autoVerfiy detials */}
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                options={options}
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {` - ${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
