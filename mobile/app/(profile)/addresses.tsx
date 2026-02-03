import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { useAddresses } from '@/hooks/useAddresses'
import AddressesHeader from '@/components/AddressesHeader'
import { Ionicons } from '@expo/vector-icons'
import { Address } from '@/types'
import AddressFormModel from '@/components/AddressFormModel'
import AddressCard from '@/components/AddressCard'

const AddressesScreen = () => {
  const{addresses,addAddress,deleteAddress,updateAddress,isAddingAddress,isDeleteAddress,isUpdateAddress,isLoading,isError}=useAddresses()
  const [editingAddressId,setEditingAddressId]=useState<string| null>(null)
  const [showAddressForm,setShowAddressForm]=useState(false)
  const [addressForm,setAddressForm]=useState({
    label:"",
    fullName:"",
    streetAddress:"",
    city:"",
    state:"",
    zipCode:"",
    phoneNumber:"",
    isDefault:false
  })

  const handelAddAddress=()=>{
    setShowAddressForm(true)
    setEditingAddressId(null)
    setAddressForm({
     label:"",
    fullName:"",
    streetAddress:"",
    city:"",
    state:"",
    zipCode:"",
    phoneNumber:"",
    isDefault:false
    })
  }

  const handelUpdateAddress=(address:Address)=>{
    setShowAddressForm(true)
    setEditingAddressId(address._id)
     setAddressForm({
     label:address.label,
    fullName:address.fullName,
    streetAddress:address.streetAddress,
    city:address.city,
    state:address.state,
    zipCode:address.zipCode,
    phoneNumber:address.phoneNumber,
    isDefault:address.isDefault
    })

  }

  const handelDelateAddress=(addressId:string,lable:string)=>{
    Alert.alert("Delete Address",`Are you sure you want to delete ${lable}`,[
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:()=>deleteAddress(addressId)},


    ])
  }

  const handelSaveAddress=()=>{
    if(
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.phoneNumber 

    ){
      Alert.alert("Erorr","please fill in all filed")
      return
    }

    if(editingAddressId){
      updateAddress({addressId:editingAddressId,addressData:addressForm},{
        onSuccess:()=>{
          setShowAddressForm(false)
          setEditingAddressId(null)
          Alert.alert("Success","Address update successfully")
        },
        onError:(error:any)=>{
          Alert.alert("Erorr",error?.response?.data?.error || "Failed to update address")
        }
      })
    }else{
      addAddress(addressForm,{
        onSuccess:()=>{
          setShowAddressForm(false)
          Alert.alert("Success","Address Added successfully")
        },
        onError:(error:any)=>{
          Alert.alert("Erorr",error?.response?.data?.error || "Failed to add address")
        }

      })
    }
  }

  const handelCloseAddressForm=()=>{
    setShowAddressForm(false)
    setEditingAddressId(null)
  }

  if(isLoading) return <LoadingUI/>
  if(isError) return <ErrorUI/>
  
  return (
    <SafeScreen>
      <AddressesHeader/>

      {addresses.length ===0?(
        <View className='flex-1 items-center justify-center px-6'>
          <Ionicons name='location-outline' size={80} color='#666'/>
          <Text className='text-text-primary font-semibold  text-xl mt-4'>No address yet</Text>
          <Text className='text-text-secondary text-center mt-2'>
            Add your frist delivery address
          </Text>
          <TouchableOpacity
           className='bg-primary rounded-2xl px-8 py-4 mt-6'
           activeOpacity={0.8}
           onPress={()=>handelAddAddress()}
          >
            <Text className='text-background font-bold text-base'>
              Add address
            </Text>
          </TouchableOpacity>
        </View>
      ):(
        <ScrollView
         className='flex-1'
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{paddingBottom:100}}
        >
          <View className='px-6 py-4'>
            {addresses.map((address)=>(
              <AddressCard
               key={address._id}
               address={address}
               onEdit={handelUpdateAddress}
               onDelete={handelDelateAddress}
               isUpdateAddress={isUpdateAddress}
               isDeleteAddress={isDeleteAddress}
              />
            ))}

            <TouchableOpacity 
             className='bg-primary rounded-2xl py-4 items-center'
             activeOpacity={0.8}
             onPress={handelAddAddress}
            >
              <View className='flex-row items-center '>
                <Ionicons name='add-circle-outline' size={24} color="#121212"/>
                <Text className='text-background font-bold text-base ml-2'>
                  Add New Address
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <AddressFormModel
      visible={showAddressForm}
      isEditing={!! editingAddressId}
      addressForm={addressForm}
      isAddingAddress={isAddingAddress}
      isUpdateingAddress={isUpdateAddress}
      onClose={handelCloseAddressForm}
      onSave={handelSaveAddress}
      onFormChing={setAddressForm}
      />
    </SafeScreen>
  )
}

export default AddressesScreen

function ErrorUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load addresses
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
}