const mongoose = require("mongoose");

const DataBase = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("DB connected successful"))
    .catch(()=>console.log("Sorry not connect DB"))
}
module.exports=DataBase;