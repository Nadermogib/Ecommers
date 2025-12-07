import {Router} from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createReview, deleteReview } from "../controllers/review.controller.js"

const route=Router()

route.post("/",protectRoute,createReview)
//we didnot implement this function in the mobile app -in frontend 
//but just in case if you woude like to impelement
//todo
route.delete("/:reviewId",protectRoute,deleteReview)



export default route