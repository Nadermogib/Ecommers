import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { creatOrder, getUserOrders } from "../controllers/order.controller.js";

const route=Router()

route.post("/",protectRoute,creatOrder)
route.get("/",protectRoute,getUserOrders)

export default route