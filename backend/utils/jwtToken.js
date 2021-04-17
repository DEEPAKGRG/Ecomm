// function to make a token and with that also send in the cookie
const sendToken = (user, statusCode, res) => {
  // create token
  const token = user.getJwtToken();
  //   options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

module.exports = sendToken;
