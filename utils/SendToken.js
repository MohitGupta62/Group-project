exports.sendtoken = (user, statuscode, res) => {
  const token = user.getjwttoken();

  const options = {
    expires: new Date(Date.now() + process.env.EXPIRES_JWT * 60 * 60 * 1000),
    httpOnly: true, // if we use with localhost
    //secure: true,              if we use our app on http
  };

  //is line se pehle toh statuscode melega phir token name se token cookie me jayega phir .json se hume
  // message and user._id and token milega
  res
    .status(statuscode)
    .cookie("token", token, options)
    .json({ success: true, id: user._id, token });
};
