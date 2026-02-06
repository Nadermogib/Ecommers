import Stripe from "stripe"
import { ENV } from "../config/env.js"
import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { Cart } from "../models/cart.model.js"

const stripe=new Stripe(ENV.STRIPE_SECRET_KEY)
export async function createPaymentIntent(req,res){
    try {

        const{cartItems,shippingAddress}=req.body
        const user=req.user;

        //validate cartItems
        if(!cartItems || cartItems.length ===0){
            return res.status(400).json({error:"Cart is empty"})
        }

        //calculet total amount from server-side (dont trust client-ever)
        let subtotal=0
        const validatedItems=[]

        for(const item of cartItems){
            const product =await Product.findById(item.product._id)
            if(!product){
              return  res.status(404).json({error:`product${item.product.name} not found`})

            }
            if(product.stock <item.quantity){
              return  res.status(400).json({error:`Insufficient stock of${item.product.name}`})   
            }

            subtotal+=product.price * item.quantity

            validatedItems.push({
                product:product._id.toString(),
                name:product.name,
                price: product.price,
                quantity:item.quantity,
                image:product.images[0],
            })
        }

        const shipping=10.0;//10$
        const tax=subtotal *0.08 //8%
        const total=subtotal+shipping+tax

        if(total<=0){
         return  res.status(404).json({error:"Invalid order total"})

        }

        //find or create the stripe customer
        let customer;
        if(user.stripeCustomerId){
            //find the customer
            customer=await stripe.customers.retrieve(user.stripeCustomerId)
        }else{
            //create the customer
            customer=await stripe.customers.create({
                email:user.email,
                name:user.name,
                metadata:{
                   clerkId:user.clerkId,
                   userId:user._id.toString()

                }

            })
            await User.findByIdAndUpdate(user._id,{stripeCustomerId:customer.id})
        }

        //create payment intent

        const paymentIntent=await stripe.paymentIntents.create({
            amount:Math.round(total *100),//convert to Cents
            currency:"usd",
            customer:customer.id,
            automatic_payment_methods:{
                enabled:true,
            },
            metadata:{
                clerkId:user.clerkId,
                userId:user._id.toString(),
                orderItems:JSON.stringify(validatedItems),
                shippingAddress:JSON.stringify(shippingAddress),
                totalPrice:total.toFixed(2)
            }

        })

        res.status(200).json({clientSecret:paymentIntent.client_secret})

        
       } catch (error) {
        console.log("Erorr creating payment intent",error)

          res.status(500).json({error:error})   
        }
    }
