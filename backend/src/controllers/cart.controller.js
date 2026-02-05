import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req,res) {
    try {
        let cart=await Cart.findOne({clerkId:req.user.clerkId}).populate("items.product")

        if(!cart){
            const user=req.user
            cart=await Cart.create({
                user:user._id,
                clerkId:user.clerkId,
                items:[]

            })
        }
        res.status(200).json({cart})
    } catch (error) {
        console.error("Error in getCart controller ",error)
        res.status(500).json({error:"Internal server error"})
    }
}
export async function addToCart(req,res) {
  try {
    const {productId,quantity=1}=req.body
    //validate product exists and has stock
    const product= await Product.findById(productId)
    if(!product){
        return res.status(404).json({error:"product not found"})
    }

    if(product.stock<quantity){
       return res.status(400).json({error:"Insufficint Stock"})   
    }

    let cart=await Cart.findOne({clerkId:req.user.clerkId})
    if(!cart){
        const user=req.user

        cart=await Cart.create({
             user:user._id,
            clerkId:user.clerkId,
             items:[]

            }) 
    }

    //check if item already on the cart
    const existingItem=cart.items.find((item)=>item.product.toString()===productId)
    if(existingItem){
        //increment quntity by 1
        const newQuntity=existingItem.quantity +1
        if(product.stock<newQuntity){
            return res.status(400).json({error:"Insufficint Stock"}) 
        }
        existingItem.quantity=newQuntity
    }else{
        //add new item
        cart.items.push({product:productId,quantity})
    }
    await cart.save()
     res.status(200).json({message:"Item added to cart",cart})
  } catch (error) {
    console.error("Error in addToCart controller ",error)
    res.status(500).json({error:"Internal server error"}) 
  }   
}
export async function updateCartItem(req,res) {
 try {
    const {productId}=req.params
    const {quantity}=req.body
    
    if(quantity<1){
        return res.status(400).json({error:"Quntity must be at least one "})
    }

     const cart=await Cart.findOne({clerkId:req.user.clerkId})
     if(!cart){
          return res.status(404).json({error:"Cart not found "})

     }
     const itemIndex=cart.items.find((item)=>item.product.toString()=== productId)
     if(itemIndex=== -1){
         return res.status(404).json({error:"Item  not found in cart "})
     }
     //check if product exists and validate stock
     const product=await Product.findById(productId)
     if(!product){
         return res.status(404).json({error:"Product  not found  "})
     }

     if(product.stock < quantity){
         return res.status(400).json({error:"Insufficint Stock"})  
     }
     cart.items[itemIndex].quantity=quantity
     await cart.save()
     return res.status(200).json({message:"Cart updated succcfully",cart}) 
 } catch (error) {
     console.error("Error in updateCartItem controller ",error)
    res.status(500).json({error:"Internal server error"})  
 }   
}
export async function removeFromCart(req,res) {
 try {
     const {productId}=req.params

     const cart=await Cart.findOne({clerkId:req.user.clerkId})
     if(!cart){
        return  res.status(404).json({error:"Cart not found"}) 
     }
         //if an error check ---------------------------------------------------[here]
     cart.items=cart.items.filter((item)=>item.product.toString() !== productId.toString())
    await cart.save()
     res.status(200).json({message:"Item removed from cart ",cart})  
 } catch (error) {
    console.error("Error in removeFromCart controller ",error)
    res.status(500).json({error:"Internal server error"})  
 }   
}
export async function clearCart(req,res) {
    try {
       const cart=await Cart.findOne({clerkId:req.user.clerkId})
       if(!cart){
        return  res.status(404).json({error:"Cart not found"}) 
       } 

       cart.items=[]
       await cart.save() 

       res.status(200).json({message:"Cart cleard ",cart})  
    } catch (error) {
    console.error("Error in clearCart controller ",error)
    res.status(500).json({error:"Internal server error"})   
    }
}