const test=(err1,err2,req,res,next)=>{
    console.log("Entered test middleware")
   next(err)
}

module.exports=test