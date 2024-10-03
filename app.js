require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({ origin: 'https://group-project-frontend.onrender.com', credentials: true}));
console.log("cors setup done")

//dbconnection
require("./database/dbConnection").connectDatabase();

//logger means it will log the status of route
const logger = require("morgan");
app.use(logger("tiny"));

//bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieparser());

//base route or entry route of user file
app.use("/user", require("./routes/userRouter"));

//base route for manager
app.use("/admin", require("./routes/adminRouter"));

//ErrorHandler
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/error");
app.all("*", (req, res, next) => {
  //isme error ane ke baad or hamare pass bahut bada error milega isliye iske baad generatederrors wali line chalegi
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

app.listen(
  process.env.PORT,
  console.log(`sever is running on port ${process.env.PORT}`)
);
