import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js"
  export async function createReview(req,res) {
    try {
        const {productId,orderId,rating}=req.body

        if(!rating || rating <1 || rating >5){
            return res.status(400).json({error:"Rattin must be between 1 and 5"})
        }

        const user=req.user
        //verfiy order exists and is deleverd
        const order=await Order.findById(orderId);

        if(!order)return res.status(404).json({message:"Order not found"})

        if(order.clerkId !==user.clerkId)return res.status(403).json({error:"User not authorized to review this order"})

        if(order.status !=="delivered") return res.status(400).json({error:"Can only review deliverd order"}) 
         
       // verfiy product is in the order
       const productInOrder=order.orderItems.find((item)=>item.product.toString()===productId.toString())
       if(!productInOrder)return res.status(400).json({error:" product not found in this order "}) 

        //check if review already exists
        const existingReview=await Review.findOne({productId,userId:user._id})
        if(existingReview)return res.status(400).json({error:" you have already reviewed this product"})
        
        const review=await Review.create({
            productId,
            userId:user._id,
            orderId,
            rating
        })

        //update the product ratting
         const reviews =await Review.find(productId)
         const totalRatting=reviews.reduce((sum,rev)=>sum + rev.rating,0)
         const updatedProduct=await Product.findByIdAndUpdate(
            productId,
            {
                averageRating:totalRatting/reviews.length,
                totalReviews:reviews.length
            },
            {new:true,runValidators:true}
         )

        if(! updatedProduct){
            await Review.findByIdAndDelete(review._id) ;
            return res.status(404).json({error:"Product not found"})
          }

        res.status(201).json({message:" Reviw submitid successfuly",review})
    } catch (error) {
        console.error("error in  createReview controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}
export async function deleteReview(req,res) {
   try {
    const {reviewId}=req.params
    const user=req.user

    const review=await Review.findById(reviewId);
    if(! review) return res.status(404).json({error:"Review not found"})
     
    if(review.userId.toString()!==user._id.toString())  return res.status(403).json({error:"Not authorized to delete this review"}) 
    
    const productId=review.productId;
    await Review.findByIdAndDelete(reviewId) 

    //update product  review
    const reviews=await Review.find({productId})
    const totalRatting=reviews.reduce((sum ,rev)=>sum + rev.rating,0);
    await Product.findByIdAndUpdate(productId,{
        averageRating:reviews.length>0?totalRatting/reviews.length:0,
        totalReviews:reviews.length
    })

    res.status(200).json({message:"Review deleted succssfully"})

        
   } catch (error) {
    console.error("Error in deleteReview controller ",error)
    res.status(500).json({error:"Internal server error"})
   } 
}