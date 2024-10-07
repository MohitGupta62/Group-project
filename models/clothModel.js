const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [15, "Cloth should have atmost 15 Characters"],
        minLength: [3, "Cloth should have atleast 3 Characters"],
    },
    category:{
        type:String,
        required: [true, "category is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price:{
        type: Number,
        required: [true, "Description is required"],
        min: [0, "price must be greater than zero"]
    },
    clothImage: {
        type:String,
        required: true
    }
})

module.exports  = mongoose.model("Cloth", clothSchema)