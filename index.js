const express =require('express')
const cors=require('cors')
require('dotenv').config()
require('./config/connectDB')
const route=require('./router/index')
const cookiesParse=require('cookie-parser')
const {app,server}=require('./socket/index')


// const app=express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookiesParse())

app.use('/api',route)

const PORT=8080 || process.env.PORT

server.listen(PORT,()=>{
    console.log("server runing at:",PORT);
    
})
app.get('/',(req,res)=>{
    res.send('server working succesffullt')
})