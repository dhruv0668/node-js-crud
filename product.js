const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:String,
    Price:String,
    Category:String,
    userId:String,
    Company:String,
    Image:Array
});

module.exports = mongoose.model("products", productSchema);