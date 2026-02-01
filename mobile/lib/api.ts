import { useAuth } from "@clerk/clerk-expo"
import axios from "axios"
import { useEffect } from "react"

const API_URL="https://ecommers-3-4jpn.onrender.com/api"

const api=axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const useApi=()=>{
    const {getToken}=useAuth()

    useEffect(()=>{
        const intreceptor=api.interceptors.request.use(async (config)=>{
            const token= await getToken();
             console.log("AUTH TOKEN:", token) 

            if(token){
                config.headers.Authorization=`Bearer ${token}`
            }
            return config
        });

        //cleanup remove interceptor when componeent unmounts
        return ()=>{
            api.interceptors.request.eject(intreceptor)
        }
    },[getToken])

    return api

}

//on every singel req we woude like have an auth token so that our backend knows that we are authenticated

//we are including the auth token under the aute headers