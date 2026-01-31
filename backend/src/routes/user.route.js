import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addAddress, addToWishList, deleteAddress, deleteFromWishList, getAllAddresses, getWishList, updateAddress } from "../controllers/user.controller.js";

const router=Router();
//protects routes
router.use(protectRoute)

// addresses Routes
router.post("/addresses",addAddress)
router.get("/addresses",getAllAddresses)
router.put("/addresses/:addressId",updateAddress)
router.delete("/addresses/:addressId",deleteAddress)


//whishList Routes
router.post("/wishlist",addToWishList)
router.get("/wishlist",getWishList)
router.delete("/wishlist/:productId",deleteFromWishList)
export default router