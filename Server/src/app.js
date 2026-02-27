import express from "express";
import cors from "cors";
import adminrouter from "./route/adminroute.js"


const app=express();

app.use(cors({
   origin: "http://localhost:8000"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use("/store/admin", adminrouter)




export {app}
