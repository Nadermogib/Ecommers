import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js";

export async function creatOrder(req,res) {
  try {
    const user=req.user
    const {orderItems, shippingAddress, paymentResult,totalPrice}=req.body
    
    if(!orderItems || orderItems.length ===0){
       return res.status(400).json({error:"No order items"})
    }

    //validate products and stock 
    for(const item of orderItems){
        const product=await Product.findById(item.Product._id);
        if(!product){
              return res.status(400).json({error:`Product ${item.name} not found`})
        }

        if (product.stock <item.quantity){

            return res.status(400).json({error:`Insufficints stock for ${product.name} not found`})
        }
    }

    const order= await Order.create({
        user:user._id,
        clerkId:user.clerkId,
        orderItems,
        shippingAddress,
        paymentResult,
        totalPrice,
    })
    //todo:
    //update product stock
    for (const item of orderItems){
        await Product.findByIdAndUpdate(item.product._id,{$inc:{stock:-item.quantity}})
    }
  
    res.status(201).json({message:"Order ceated succssfully",order})


    
  } catch (error) {
    console.error("error in creatOrder controller",error)
    res.status(500).json("Internal server error")
  }  
}
export async function getUserOrders(req,res) {
 try {
    const user=req.user

    const orders=await Order.find({clerkId:user.clerkId})
    .populate("orderItems.product")
    .sort({createdAt:-1})

    //check if each order has been reviwed
    const orderIds = orders.map(o => o._id);
    const reviews = await Review.find({ orderId: { $in: orderIds } });
    const reviewedSet = new Set(reviews.map(r => String(r.orderId)));
    const ordersWithReviewStatus=await Promise.all(
        orders.map(async (order)=>{
           
            return{
                ...order.toObject(),
                hasReviewed:reviewedSet.has(String(order._id))

            }
        })
    )
    res.status(200).json({orders:ordersWithReviewStatus})

    
 } catch (error) {
      console.error("error in getUserOrders controller",error)
    res.status(500).json("Internal server error")  
 }   
}