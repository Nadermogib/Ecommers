import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query"
import { useApi } from "@/lib/api"
import { Address } from "@/types"

export const useAddresses =()=>{
    const api=useApi()
    const queryClinet=useQueryClient()

    const {data:addresses,isLoading,isError}=useQuery({
        queryKey:["addresses"],
        queryFn:async()=>{
            const {data}=await api.get<{addresses:Address[]}>("/users/addresses");
            return data.addresses
        }
    })

    const addAddressesMutation=useMutation({
        mutationFn:async(addressData:Partial<Address>)=>{
            const {data}=await api.post<{addresses:Address[]}>("/users/addresses",addressData)
            return data.addresses
        },
        onSuccess:()=>{
            queryClinet.invalidateQueries({queryKey:["addresses"]})
        }
    })

    const updateAddressMutaion=useMutation({
        mutationFn:async({addressId,addressData}:{addressId:string,addressData:Partial<Address>})=>{
            const {data}=await api.put<{addresses:Address[]}>(`/users/addresses/${addressId}`,addressData)

            return data.addresses
        },
         onSuccess:()=>{
            queryClinet.invalidateQueries({queryKey:["addresses"]})
          }

    })

    const deleteAddressMutation=useMutation({
        mutationFn:async(addressId:string)=>{
            const {data}=await api.delete<{addresses:Address[]}>(`/users/addresses/${addressId}`);
            return data.addresses
        },
          onSuccess:()=>{
            queryClinet.invalidateQueries({queryKey:["addresses"]})
          }      
    })

    return{
        addresses:addresses ||[],
        isLoading,
        isError,
        addAddress:addAddressesMutation.mutate,
        updateAddress:updateAddressMutaion.mutate,
        deleteAddress:deleteAddressMutation.mutate,
        isAddingAddress:addAddressesMutation.isPending,
        isUpdateAddress:updateAddressMutaion.isPending,
        isDeleteAddress:deleteAddressMutation.isPending
    }
}