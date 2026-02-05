import { View, Text, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import useCart from '@/hooks/useCart'
import { useApi } from '@/lib/api'
import { useAddresses } from '@/hooks/useAddresses'
import{useStripe}from "@stripe/stripe-react-native"
import { Address } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
const CartScreen = () => {
 const api=useApi()
 const {addToCart,isAddingToCart,cart,cartItemCount,cartTotal,clearCart,isClearingCart,isError,isLoading,isRemovingFromCart,isUpdatingCart,removeFromCart,updateQuantity}=useCart()
 const {addresses}=useAddresses()

 const {initPaymentSheet,presentPaymentSheet}=useStripe();
 const[paymentLoading,setPaymentLoading]=useState(false)
 const[addrsseModalVisible,setAddrsseModalVisible]=useState(false)

 const catrItems=cart?.items ||[];
 const subtotal=cartTotal;
 const shipping=10.0;//$10 shipping fee
 const tax=subtotal *0.08 //8% tax
 const total=subtotal+shipping+tax
 

 const handelQuantityChange=(productId:string,currentQuantity:number,change:number)=>{
  const newQuantity=currentQuantity+change
  if(newQuantity<1)return
  updateQuantity({productId,quantity:newQuantity})

 }

 const handelRemoveItems=(productId:string,productName:string)=>{
  Alert.alert("Remove Item",`Remove${productName} from cart?`,[
    {text:"Cancel",style:"cancel"},
    {text:"Remove",style:"destructive",onPress:()=>removeFromCart(productId)}
  ])

 }

 const handleCheckout=()=>{
  if(catrItems.length===0)return

  //check if user has addresses
  if(!addresses || addresses.length ===0){
    Alert.alert("No Address ","please add a shipping address in your profile before checking out",
      [{text:"ok"}]
    )
    return
  }

  //show address selection modal
  setAddrsseModalVisible(true)
 }

 const handleProcsseWithPayment=async(selectedAddress:Address)=>{}

 if(isLoading) return<LoadingUI/>
 if(isError) return <ErrorUI/>
 if(catrItems.length ===0) return <EmptyUI/>
  return (
    <SafeScreen>
      <Text className='px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight'>Cart</Text>
       <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:240}}
       >
        <View className='px-6 space-y-4'>
          {catrItems.map((item,index)=>(
            <View 
             key={index}
             className='bg-surface rounded-3xl overflow-hidden mb-3'
            >
              <View className='p-4 flex-row'>
                {/* productImage */}
                <View className='relative'>
                  <Image
                   source={item.product.images[0]}
                   className=' bg-background-lighter'
                   contentFit='cover'
                   style={{width:112,height:112,borderRadius:16}}
                  />
                  <View className='absolute top-2 right-2  bg-primary rounded-full px-2 py-0.5'>
                    <Text className='text-background text-xs font-bold'>X{item.quantity}</Text>
                  </View>
                </View>

                <View className='flex-1 ml-4 justify-between'>
                  <View>
                    <Text 
                     className='text-text-primary font-bold text-lg leading-tight'
                     numberOfLines={2}
                    >
                      {item.product.name}
                    </Text>
                    <View className='flex-row items-center mt-2'>
                      <Text className='text-primary font-bold text-2xl '>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                      <Text className='text-text-secondary text-sm ml-2'>
                        ${item.product.price.toFixed(2)}each
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                   <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handelQuantityChange(item.product._id, item.quantity, -1)}
                      disabled={isUpdatingCart}
                    >
                      {isUpdatingCart ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>

                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary font-bold text-lg">{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handelQuantityChange(item.product._id, item.quantity, 1)}
                      disabled={isUpdatingCart}
                    >
                      {isUpdatingCart ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Ionicons name="add" size={18} color="#121212" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handelRemoveItems(item.product._id, item.product.name)}
                      disabled={isRemovingFromCart}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
            </View>
          ))}
        </View>
       </ScrollView>
    </SafeScreen>
  )
}

export default CartScreen

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />
      <Text className="text-text-secondary mt-4">Loading cart...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="text-text-primary font-semibold text-xl mt-4">Failed to load cart</Text>
      <Text className="text-text-secondary text-center mt-2">
        Please check your connection and try again
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">Cart</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">Your cart is empty</Text>
        <Text className="text-text-secondary text-center mt-2">
          Add some products to get started
        </Text>
      </View>
    </View>
  );
}