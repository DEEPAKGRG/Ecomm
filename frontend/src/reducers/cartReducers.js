import {
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      // checking if the item is already in the cart
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      // if the item is already then update that item
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
        // else add the new item
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_ITEM_CART:
      // removing the item from the cart
      return {
        ...state,
        // checking all the items in te cartItems and using filter function deleted the item
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    //shipping info of the user address,pincode and other info of the user
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
