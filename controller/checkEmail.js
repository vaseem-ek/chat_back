const UserModel=require('../models/userModel')

async function checkEmail(req,res){
    try {
        const {email}=req.body

        const checkEmail=await UserModel.findOne({email}).select("-password")

        if(!checkEmail){
            res.status(400).json("no exist email")
        }
        res.status(200).json(checkEmail)
        
    } catch (error) {
        console.log(error);
        res.status(500).json("internal error",error)
    }
}
module.exports=checkEmail