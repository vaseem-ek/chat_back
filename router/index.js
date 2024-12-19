const exoress=require('express')
const registerUser = require('../controller/registerUser')
const checkEmail=require('../controller/checkEmail')
const checkPassword=require('../controller/checkPassword')
const userDetails = require('../controller/userDetailes')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')

const route=exoress.Router()
//create user api
route.post('/register',registerUser)
//checking user email
route.post('/email',checkEmail)
//checking user password
route.post('/password',checkPassword)
//login user detailes
route.get('/user-details',userDetails)
//logout user 
route.get('/logout',logout)
//update user details
route.post('/update-user',updateUserDetails)
//search user
route.post('/search-user',searchUser)
module.exports=route