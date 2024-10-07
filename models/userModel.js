const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: [true, "Username already Exist"],
      minLength: [3, "Username should atleast have 3 Characters"],
      maxLength: [15, "Username should atmost have 15 Characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email already Exist"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email address is invalid!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      // match: [ ,""],
      maxLength: [15, "Password must be less than 15 Characters"],
      minLength: [6, "Password should have atleast 6 Characters"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    profileImage: {
      type: Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1682905926517-6be3768e29f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8",
      },
    },
    contact: {
      type: String,
      required: true,
      minLength: [10, "Contact should contain atleast 10 digits"],
      maxLength: [10, "Contact should contain atmost 10 digits"],
    },
    allorders: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
      ref: "Order",
      default: [],
    },
    resetPasswordToken: String, //Password reset token
    resetPasswordExpire: Date, // Reset token ka expiry date
  },
  { timestamps: true }
);

userModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userModel.methods.getjwttoken = function () {
  //jb bhi ye call hoga to token generate hojayega iske liye alag se utils mai sendtoken file bayenge
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userModel.methods.getResetPasswordToken = function () {
  // Crypto ka use karke random token generate karte hain
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Random token ko SHA-256 ka use karke hash karte hain aur resetPasswordToken field mein store karte hain
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Reset password token ka expiration time 15 minutes baad ka set karte hain
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Plain reset token (jo hash nahi hua hai) return karte hain
  return resetToken;
};

module.exports = mongoose.model("User", userModel);
