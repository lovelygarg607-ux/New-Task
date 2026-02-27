import express from "express";
import cors from "cors";
import adminrouter from "./route/adminroute.js"


const app=express();
 app.use(cors({
    origin: [
    "http://localhost:3000",
    "http://localhost:8000",
  " https://new-task-2-g3c8.onrender.com"
    "https://new-task-gilt-eta.vercel.app/"
  ],
  credentials: true
  
 }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use("/store/admin", adminrouter)




export {app}
