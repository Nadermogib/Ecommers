import { User } from "../models/user.model.js"


//Adresses user manage
export async function addAddress(req,res) {
   try {
    const {label,fullName,streetAddress,state,city,zipCode,phoneNumber,isDefault}=req.body
    const user=req.user

    if(!fullName || !streetAddress|| !state|| !zipCode|| !city || !phoneNumber){
        return res.status(400).json({error:"Missing required address fileds"})
    }
    // if this is set as defult ,unset all other defulet
    if(isDefault){
        user.addresses.forEach((addr)=>{
            addr.isDefault=false
        })
    }

    user.addresses.push({
        label,
        fullName,
        streetAddress,
        state,
        city,
        zipCode,
        phoneNumber,
        isDefault:isDefault || false
    })

    await user.save()

    res.status(201).json({message:"Addresses added scussfully",addresses:user.addresses})
   } catch (error) {
   console.error("error in addAddress controller",error)
    res.status(500).json("Internal server error") 
   } 
}
export async function getAllAddresses(req,res) {
   try {

    const user=req.user
    res.status(201).json({addresses:user.addresses})
    
   } catch (error) {
       console.error("error in getAllAddresses controller",error)
    res.status(500).json("Internal server error")
   } 
}
export async function updateAddress(req,res) {
    try {
    const {label,fullName,streetAddress,state,city,zipCode,phoneNumber,isDefault}=req.body
    const {addressId}=req.params;
    const user=req.user

    const address=user.addresses.id(addressId)
    if(!address){
      return res.status(404).json({error:"Adderss not found"})
    }

    // if this is set as defult ,unset all other defulet
    if(isDefault){
        user.addresses.forEach((addr)=>{
            addr.isDefault=false
        })
    } 
    
    address.label=label || address.label
    address.fullName=fullName || address.fullName
    address.streetAddress=streetAddress || address.streetAddress
    address.state=state || address.state
    address.city=city || address.city
    address.zipCode=zipCode || address.zipCode
    address.phoneNumber=phoneNumber || address.phoneNumber
    address.isDefault=isDefault !== undefined?isDefault : address.isDefault

    await user.save()

    res.status(200).json({message:"Address updated successfully",addresses:user.addresses})

    } catch (error) {
      console.error("error in updateAddress controller",error)
    res.status(500).json("Internal server error")  
    }
}
export async function deleteAddress(req,res) {
   try {
      const {addressId}=req.params
      const user=req.user

      user.addresses.pull(addressId)
      await user.save()

      res.status(200).json({message:"Adderess deleted successfully",addresses:user.addresses})

   } catch (error) {
     console.error("error in deleteAddress controller",error)
    res.status(500).json("Internal server error")
   } 
}

//wishlist user manage
export async function addToWishList(req,res) {
   try {
    const {productId}=req.body
    const user=req.user

    if(user.wishList.includes(productId)){
       return res.status(400).json({error:"product already in wishlist"})
    }
    user.wishList.push(productId)
    await user.save()
    res.status(200).json({message:"product added to wishlist",wishList:user.wishList})
   } catch (error) {
      console.error("error in addToWishList controller",error)
    res.status(500).json("Internal server error") 
   } 
}
export async function getWishList(req,res) {
   try {
     const user=await User.findById(res.user._id).populate("wishList")
     res.state(200).json({wishList:user.wishList})
   } catch (error) {
    console.error("error in getWishList controller",error)
    res.status(500).json("Internal server error") 
   }
}
export async function deleteFromWishList(req,res) {
  try {
    const {productId}=req.params
    const user=req.user

  if(! user.wishList.includes(productId)){
       return res.status(400).json({error:"product not even in wishlist"})
    }
    user.wishList.pull(productId)
    await user.save()
    res.status(200).json({message:"product removed from wishlist",wishList:user.wishList})

   } catch (error) {
      console.error("error in deleteFromWishList controller",error)
    res.status(500).json("Internal server error") 
   }
}