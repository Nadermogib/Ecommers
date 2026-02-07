import {useQuery}from "@tanstack/react-query"
import { useApi } from "@/lib/api"
import { Order } from "@/types"

export const useOrder=()=>{
    const api=useApi()

    return useQuery<Order[]>({
        queryKey:["orders"],
        queryFn:async()=>{
            const {data}=await api.get("/orders")
            return data.orders
        }
    })
}