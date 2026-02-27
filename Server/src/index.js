import express from "express"
import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/db.js"

const PORT=5000


dotenv.config({
    path:"./env"
})

connectDB()


.then(()=>{
    app.listen(process.env.PORT||8001,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})

.catch((error)=>{
    console.log("MONGODB CONNECTION FAILED ",error)
})