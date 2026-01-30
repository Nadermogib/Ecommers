import React from 'react'
 import {useSSO}from "@clerk/clerk-expo"
 import { useState } from 'react'
 import { Alert } from 'react-native'

function useSocialAuth() {
    const [isLoadingStrategy,setIsLoadingStrategy]=useState<string | null>(null)
    const {startSSOFlow}=useSSO()

    const handelSocialAuth=async(strategy:"oauth_google" | "oauth_apple")=>{
        setIsLoadingStrategy(strategy)
        try {
          const {createdSessionId,setActive}=await startSSOFlow({strategy})  
          if(createdSessionId && setActive){
            await setActive({session:createdSessionId})
          }
            
        } catch (error) {
            console.log("Error in socia auth",error)
            const provider=strategy ==="oauth_google"?"Google":"Apple"
            Alert.alert("Error",`Faild to sign in with ${provider} please try again`)
        } finally{
           setIsLoadingStrategy(null)
        }

    }
  return {isLoadingStrategy,handelSocialAuth}
   
  
}

export default useSocialAuth
