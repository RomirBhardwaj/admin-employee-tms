const express=require("express")    
const mongoose=require("mongoose")
const adminRoutes=require("./routes/adminRoutes.js")
const empRoutes=require("./routes/empRoutes.js")
const commonRoutes=require("./routes/commonRoutes.js")
const errorHandler=require("./middleware/error/errorHandler.js")
require("dotenv").config()

mongoose.connect(process.env.connection_string).then(()=>{
    console.log("Mongo DB connected successfully.")}).catch((err)=>
        {console.log("Error occured",err)})
    
    const app=express()

    
app.use(express.json()) //middleware to parse json data
app.use("/admin",adminRoutes)   //middleware to route admin routes
app.use("/emp",empRoutes)       //middleware to route employee routes
app.use("/",commonRoutes)       //middleware to route common routes
app.use(errorHandler)           //middleware to handle errors.It will always be the last middleware to handle errors

app.listen(3000,()=>{console.log("Server is running at port 3000")})