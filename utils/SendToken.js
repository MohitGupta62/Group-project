exports.sendtoken = (user, statuscode, res) => {
  const token = user.getjwttoken();

  if (!token) {
    return res.status(500).json({ success: false, message: "Token generation failed" });
  }

  const options = {
    expires: new Date(Date.now() + process.env.EXPIRES_JWT * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(statuscode)
    .cookie("token", token, options)
    .json({ success: true, id: user._id, token });
};
