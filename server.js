const express=require("express")    
const mongoose=require("mongoose")
const userRoutes=require("./routes/userRoutes.js")
require("dotenv").config()

mongoose.connect(process.env.connection_string).then(()=>{
    console.log("Mongo DB connected successfully.")}).catch((err)=>
        {console.log("Error occured",err)})
    
    const app=express()

    
app.use(express.json())
app.use("/",userRoutes)


app.listen(3000,()=>{console.log("Server is running at port 3000")})