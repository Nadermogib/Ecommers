import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";
const useWishlist = () => {
    const api=useApi()
    const queryClinnt=useQueryClient();

    const {data:wishlist,isLoading,isError}=useQuery({
        queryKey:["wishlist"],
        queryFn:async()=>{
            const {data}=await api.get<{whishlist:Product []}>("users/wishlist")
            return data.whishlist
        }
    })

    const addToWishlistMutation=useMutation({
        mutationFn:async(productId:string)=>{
            const {data}=await api.post<{wishlist:string[]}>("users/wishlist",{productId})
            return data.wishlist
        },
        onSuccess:()=>queryClinnt.invalidateQueries({queryKey:["wishlist"]})
    })
    const removeFromWishlistMutation=useMutation({
        mutationFn:async(productId:string)=>{
            const {data}=await api.delete<{wishlist:string[]}>(`users/wishlist/${productId}`)
            return data.wishlist
        },
        onSuccess:()=>queryClinnt.invalidateQueries({queryKey:["wishlist"]})
    })
  return null
}

export default useWishlist