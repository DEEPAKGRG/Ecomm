// to get data from the backend axios is used
import axios from "axios";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_RESET,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";

// action to login user
export const login = (email, password) => async (dispatch) => {
  try {
    console.log("try login user");

    dispatch({
      type: LOGIN_REQUEST,
    });

    const config = {
      headers: {
        CONTENT_TYPE: "application/json",
      },
    };

    let link = `/api/v1/login`;
    //  a post request to get login user from the backend
    const { data } = await axios.post(link, { email, password }, config);

    console.log(data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    // link to register the user with userData details
    let link = `/api/v1/register`;

    // also have to add images in the cloudinary
    const config = {
      headers: {
        CONTENT_TYPE: "multipart/form-data",
      },
    };

    const { data } = await axios.post(link, userData, config);

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// load current User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    // link to get the current use
    let link = `/api/v1/me`;

    const { data } = await axios.get(link);

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Profile of the user
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    // link to Update the profile of the user
    let link = `/api/v1/me/update`;

    // also have to add images in the cloudinary
    const config = {
      headers: {
        CONTENT_TYPE: "multipart/form-data",
      },
    };

    const { data } = await axios.put(link, userData, config);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Password of the user
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    // link to Update the Password of the user
    let link = `/api/v1//password/update`;

    const config = {
      headers: {
        CONTENT_TYPE: "application/json",
      },
    };
    // two passwords ,old password to verify user and a new password
    const { data } = await axios.put(link, passwords, config);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// forgot Password of the user
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    // link for forgot password
    let link = `/api/v1//password/forgot`;

    const config = {
      headers: {
        CONTENT_TYPE: "application/json",
      },
    };
    // sending post request for the forgot request and email of the user
    const { data } = await axios.post(link, email, config);

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// new Password of the user after sending email to the user
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST });

    // link for forgot password
    let link = `/api/v1//password/reset/${token}`;

    const config = {
      headers: {
        CONTENT_TYPE: "application/json",
      },
    };
    // sending post request for the forgot request and email of the user
    const { data } = await axios.put(link, passwords, config);

    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      success: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// logout current user
export const logout = () => async (dispatch) => {
  try {
    // to logout current user
    let link = `/api/v1/logout`;
    await axios.get(link);

    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
