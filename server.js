const express=require("express")    
const mongoose=require("mongoose")
const adminRoutes=require("./routes/adminRoutes.js")
const empRoutes=require("./routes/empRoutes.js")
const commonRoutes=require("./routes/commonRoutes.js")
const errorHandler=require("./middleware/error/errorHandler.js")
const test=require("./middleware/error/test.js")
require("dotenv").config()

mongoose.connect(process.env.connection_string).then(()=>{
    console.log("Mongo DB connected successfully.")}).catch((err)=>
        {console.log("Error occured",err)})
    
    const app=express()

    
app.use(express.json())
app.use("/admin",adminRoutes)
app.use("/emp",empRoutes)
app.use("/",commonRoutes)
app.use(test)
app.use(errorHandler)

app.listen(3000,()=>{console.log("Server is running at port 3000")})