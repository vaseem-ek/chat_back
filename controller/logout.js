async function logout(req,res) {
    try {
        const cookieOptions={
            http:true,
            secure:true
        }

        return res.cookie('token','',cookieOptions).status(200).json({
            message:"session out",
            success:true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json('internal error',error)
    }
}
module.exports=logout