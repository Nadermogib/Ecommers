import { useApi } from "@/lib/api"
import { Cart} from "@/types";
import {useMutation,useQueryClient,useQuery} from "@tanstack/react-query";

const useCart = () => {
    const api=useApi()
    const queryClient=useQueryClient()

   const {data:cart,isLoading,isError}=useQuery({
    queryKey:["cart"],
    queryFn:async()=>{
      const {data}=await api.get<{cart:Cart}>("/cart")
      return data.cart
    }
   })

    const addToCartMutation=useMutation({
      mutationFn: async({productId,quantity=1}:{productId:string; quantity?:number})=>{
       const {data}=await api.post<{cart:Cart}>("/cart",{productId,quantity})
       return data.cart
      },
      onSuccess:()=>queryClient.invalidateQueries({queryKey:["cart"]})
    })

    const updateQuantityMutation=useMutation({
      mutationFn:async({productId,quantity}:{productId:string;quantity:number})=>{
        const {data}=await api.put<{cart:Cart}>(`/cart/${productId}`,quantity)
        return data.cart
      },
       onSuccess:()=>queryClient.invalidateQueries({queryKey:["cart"]})
    })

    const removeFromCartMutation=useMutation({
      mutationFn:async(productId:string)=>{
        const {data}=await api.delete<{cart:Cart}>(`/cart/${productId}`)
        return data.cart
      },
       onSuccess:()=>queryClient.invalidateQueries({queryKey:["cart"]})
    })

    const clearCartMutation=useMutation({
      mutationFn:async()=>{
        const {data}=await api.delete<{cart:Cart}>("/cart")
        return data.cart

      },
       onSuccess:()=>queryClient.invalidateQueries({queryKey:["cart"]})
    })

    const cartTotal=cart?.items.reduce((sum,item)=>sum+item.product.price*item.quantity,0)??0
    const cartItemCount=cart?.items.reduce((sum,item)=>sum+item.quantity,0)??0

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    updateQuantity:updateQuantityMutation.mutate,
    removeFromCart:removeFromCartMutation.mutate,
    addToCart:addToCartMutation.mutate,
    clearCart:clearCartMutation.mutateAsync,
    isAddingToCart:addToCartMutation.isPending,
    isUpdatingCart:updateQuantityMutation.isPending,
    isRemovingFromCart:removeFromCartMutation.isPending,
    isClearingCart:clearCartMutation.isPending
  }
 
}

export default useCart