require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

app.listen(
  process.env.PORT,
  console.log(`app is running on PORT ${process.env.PORT}`)
);