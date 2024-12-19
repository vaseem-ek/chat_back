const UserModel=require('../models/userModel')
const bcryptjs=require('bcryptjs')
const { json } = require('express')
const jwt =require('jsonwebtoken')

async function checkPassword(req,res) {
    try {
        const {password,userId}=req.body
        const user =await UserModel.findById(userId)
        const verifyPassword=await bcryptjs.compare(password,user.password)
        if(!verifyPassword){
            res.status(400).json("incorrect password")
        }
        const tokenData={
            id:user._id,
            email:user.email
        }
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        const cookieOptions={
            http:true,
            secure:true
        }
       return res.cookie("token",token,cookieOptions).status(200).json({
            message:json,
            token:token,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json("internal error",error)
    }
}

module.exports=checkPassword