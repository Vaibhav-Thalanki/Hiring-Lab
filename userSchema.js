const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:String,
    post:[String],
    connected_users:[String]
})

module.exports=mongoose.model("User",userSchema);


