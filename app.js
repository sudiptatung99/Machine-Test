const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const DataBase = require("./DB/Database");
// const user = require("./Route/UserRoute");
const Product = require("./Route/ProductRoute");
const RoiInvests = require("./Route/RoiInvestsRoute");
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
DataBase();

// app.use("/",user);
app.use("/", Product);
app.use("/", RoiInvests);




app.listen(process.env.PORT || 8000, () => {
    console.log(`Server start http://localhost:${process.env.PORT}`);
})

