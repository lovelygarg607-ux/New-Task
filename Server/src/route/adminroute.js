import express from "express"
import { admincontroller } from "../controllers/admincontroller.js"
import { createProduct, deleteProduct, listProducts, updateProduct } from "../controllers/productcontroller.js"
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categorycontroller.js"





const adminrouter=express.Router()

adminrouter.post("/login",
 admincontroller)
adminrouter.get("/products", listProducts)
adminrouter.post("/products", createProduct)
adminrouter.put("/products/:id", updateProduct)
adminrouter.delete("/products/:id", deleteProduct)
adminrouter.get("/categories", listCategories)
adminrouter.post("/categories", createCategory)
adminrouter.put("/categories/:id", updateCategory)
adminrouter.delete("/categories/:id", deleteCategory)

export default adminrouter
