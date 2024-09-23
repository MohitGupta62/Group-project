const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const adminModel = new mongoose.Schema({
    email: {
        type:String,
        required:[true , "Email is required!"],
        unique:[true, "Email already Exist"],
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Email address is invalid!"],
    },
    password: {
        type:String,
        required:[true , "Password is required!"],
        // match: [ ,""],
        maxLength: [15, "Password must be less than 15 Characters"],
        minLength: [6, "Password should have atleast 6 Characters"],
    },
    
    createdOrders: {
        type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectIds
        ref: "Cloth",
        default: []
    },

}, { timestamps: true });

adminModel.pre("save", function(){
    if(!this.isModified("password")){
    return;
 }   
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
})

adminModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

adminModel.methods.getjwttoken = function(){             //jb bhi ye call hoga to token generate hojayega iske liye alag se utils mai sendtoken file bayenge
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


module.exports = mongoose.model("Admin", adminModel);