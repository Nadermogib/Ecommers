import multer from "multer"
import path from "path"


const storage=multer.diskStorage({
    filename:(req,file,cb)=>{
        const ext=path.extname(file.originalname || "").toLowerCase()
        const safeEXt=[".png",".jpeg",".jpg",".webp"].includes(ext)?ext :""
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null,`${unique}${safeEXt}`)
    }
})

// filefilltring :jpeg .jpg,png,webp

const fileFilter=(req,file,cb)=>{

    const allowedTypes=/jpeg|jpg|png|webp/
    const extname=allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType=allowedTypes.test(file.mimetype)
    if(extname && mimeType){
        cb(null,true)
    }else{
        cb(new Error("Only imege files are allowed (jpeg|jpg|png|webp)"))
    }
}

export const uplode=multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024}//5mb
})