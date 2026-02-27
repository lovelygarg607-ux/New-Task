import mongoose from "mongoose"

import {DB_NAME} from "../constant.js"


const connectDB=async()=>{
    try {

        const connectioninstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log(`Mongoose connected:${connectioninstance.connection.host}`)
        
    } catch (error) {
        


        console.log("MONGODB CONNECTION ERROR",error)

        process.exist(1)
    }
}


export default connectDB;