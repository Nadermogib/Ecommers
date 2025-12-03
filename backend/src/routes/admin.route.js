import {Router} from "express"
import { createProduct, getAllCoustomers, getAllOrders, getAllProducts, getDashboardStata, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js"
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js"
import { uplode } from "../middleware/multr.middleware.js"

const router=Router()

//optimiztion
router.use(protectRoute,adminOnly)


router.post("/products",uplode.array("images",3),createProduct)
router.get("/products",getAllProducts)
router.put("/products/:id",uplode.array("images",3),updateProduct)

router.get("/orders",getAllOrders)
router.patch("/order/:orderId/status",updateOrderStatus)

router.get("/customers",getAllCoustomers)
router.get("/stats",getDashboardStata)

export default router
