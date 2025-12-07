import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart.controller.js";

const route=Router()
route.use(protectRoute)

route.get("/",getCart)
route.post("/",addToCart)
route.put("/:productId",updateCartItem)
route.delete("/:productId",removeFromCart)
route.delete("/",clearCart)

export default route