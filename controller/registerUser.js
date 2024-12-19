
const UserModel=require('../models/userModel')
const bcryptjs = require('bcryptjs')



  async function registerUser(req, res){
    try {
        const { name, email, password, profile } = req.body

        const checkEmail = await UserModel.findOne({ email })
        if (checkEmail) {
            res.status(400).json("user already exist")
        }
        //password int hashedpassword
        const salt = await bcryptjs.genSalt(10)
        const hashedpassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            profile,
            password: hashedpassword
        }

        const user = new UserModel(payload)
        const userSave = await user.save()
        res.status(201).json(userSave)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
module.exports=registerUser