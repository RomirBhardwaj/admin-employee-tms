require("dotenv").config()
const mongoose=require("mongoose")
const userModel=require("./models/userModel")
const bcrypt=require("bcrypt")

mongoose.connect(process.env.connection_string).then(()=>{
    console.log("Mongo DB connected successfully.")}).catch((err)=>
        {console.log("Error occured",err)})



const super_admin_details={name:"super admin",
    email:"superadmin@gmail.com",
    password:"superadmin123"
};
async function fun(){
    try{

        super_admin_details.password=await bcrypt.hash(super_admin_details.password,10)
        super_admin_details.role="super-admin"
        const super_admin=await userModel.create(super_admin_details)
        if(super_admin){
            console.log("super admin created successfully.\nSuper Admin :",{name:super_admin.name,email:super_admin.email,role:super_admin.role})
        }
    }catch(err){
        console.log("Error occured",err)
    }

}
fun()
mongoose.disconnect()