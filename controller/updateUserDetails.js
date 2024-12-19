const getUserDetailsFromToken = require("../helpers/getUserDetailesFromToken");
const UserModel = require("../models/userModel");


async function updateUserDetails(req,res) {
    try {
        const token=req.cookies.token || ""
        const user=await getUserDetailsFromToken(token)
        const {name,profile}=req.body
        const updateUser =await UserModel.updateOne({_id:user._id},{
            name,profile
        })
        const userInformation=await UserModel.findById(user._id)
        return res.status(200).json({
            message:"updataion succed",
            data:userInformation,
            success:true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
module.exports=updateUserDetails