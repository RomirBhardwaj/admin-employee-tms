require("dotenv").config()
const mongoose=require("mongoose")
const userModel=require("./models/userModel")
const bcrypt=require("bcrypt")

mongoose.connect(process.env.connection_string).then(()=>{
    console.log("Mongo DB connected successfully.")}).catch((err)=>
        {console.log("Error occured",err)})



const super_admin_details={name:"sup-tester-1",
    email:"superadmin1@email.com",
    password:"superadmin123",
    parentId:null
};
async function fun(){
    try{

        super_admin_details.password=await bcrypt.hash(super_admin_details.password,10)
        super_admin_details.role="super-admin"
        const super_admin=await userModel.create(super_admin_details)
        mongoose.disconnect()
        if(super_admin){
            console.log("super admin created successfully.\nSuper Admin :",{name:super_admin.name,email:super_admin.email,role:super_admin.role})
        }
    }catch(err){
        mongoose.disconnect()
        console.log("Error occured",err)
    }

}
fun()