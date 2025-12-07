import {Router} from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getAllProducts } from "../controllers/admin.controller.js"
import { getProductById } from "../controllers/product.controller.js"

const route=Router()

route.get("/",protectRoute,getAllProducts)
route.get("/:id",protectRoute,getProductById)


export default route