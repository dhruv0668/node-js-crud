const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },

    image:{
        data:Buffer,
        content:String
    }
})


module.exports = imageModel =  mongoose.model("imageModel", imageSchema);
