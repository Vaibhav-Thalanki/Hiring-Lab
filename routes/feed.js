const express=require("express")
const index=require("../index")

const router=express.Router()

console.log(`curr_user is ${index.curr_user}`)

router.get("/",(req,res)=>{

    res.send(index.curr_user)
})
module.exports=router