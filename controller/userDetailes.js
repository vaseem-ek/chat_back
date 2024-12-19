const getUserDetailsFromToken = require("../helpers/getUserDetailesFromToken");



async function userDetails(req,res) {
    try {
        const token=req.cookies.token || ""
        const user=await getUserDetailsFromToken(token)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

module.exports=userDetails