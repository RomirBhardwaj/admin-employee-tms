const multer=require("multer");

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads")
    },
    filename:(req,file,cb)=>{
        const fileName= Date.now()
        console.log(fileName, file.originalname)
        cb(null,`${fileName}-${file.originalname}`)
    }

})

const upload=multer({
    storage:storage
})

module.exports=upload