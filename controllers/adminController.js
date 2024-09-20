const { catchAsyncErrors } = require("../middlewares/catchAsyncError")

exports.homepage = catchAsyncErrors(async(req, res, next) =>{
    res.json({message: "Homepage"})
})