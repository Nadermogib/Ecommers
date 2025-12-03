import mongoose from "mongoose";


const catrItemsSchema=new mongoose.Schema({
   product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true    
   },
   quantity:{
    type:Number,
    required:true,
    min:1,
    default:1
   }
})

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    items:[catrItemsSchema]
},{timestamps:true})

export const Cart=mongoose.model("Cart",cartSchema)