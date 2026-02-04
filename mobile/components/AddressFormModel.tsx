import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen';
import { Ionicons } from '@expo/vector-icons';

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdateingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChing: (form: AddressFormData) => void;
}
const AddressFormModel = ({visible,isEditing,addressForm,isAddingAddress,isUpdateingAddress,onClose,onSave,onFormChing}:AddressFormModalProps) => {
  return (
   <Modal
    visible={visible}
    animationType='slide'
    transparent
    onRequestClose={onClose}
   >
    <SafeScreen>
        {/* HEDAR */}
     <View className="px-6 pb-5 border-b border-surface flex-row items-center">
      <TouchableOpacity onPress={() => onClose()} className="mr-4">
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text className="text-text-primary text-2xl font-bold">
        {isEditing?"Edit Address":"Add Address"}

      </Text>
     </View>
       <KeyboardAvoidingView 
        behavior={Platform.OS==="ios"?"padding":"height"}
        className='flex-1'
       >
        <ScrollView
      className='flex-1'
      contentContainerStyle={{paddingBottom:50}}
      showsVerticalScrollIndicator={false}
     >
        <View className='p-6'>
            {/* lable input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>Lable</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='e.g.,Home,office,work'
                 placeholderTextColor="#666"
                 value={addressForm.label}
                 onChangeText={(text)=>onFormChing({...addressForm,label:text})}
                />
            </View>

            {/* Name input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>FullName</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='Enter Your Full Name'
                 placeholderTextColor="#666"
                 value={addressForm.fullName}
                 onChangeText={(text)=>onFormChing({...addressForm,fullName:text})}
                />
            </View>

            {/* Street Address input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>Street Address</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='Street Address'
                 placeholderTextColor="#666"
                 value={addressForm.streetAddress}
                 onChangeText={(text)=>onFormChing({...addressForm,streetAddress:text})}
                />
            </View>
            {/* City input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>City</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='City'
                 placeholderTextColor="#666"
                 value={addressForm.city}
                 onChangeText={(text)=>onFormChing({...addressForm,city:text})}
                />
            </View>
            {/* state input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>State</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='State'
                 placeholderTextColor="#666"
                 value={addressForm.state}
                 onChangeText={(text)=>onFormChing({...addressForm,state:text})}
                />
            </View>
            {/* Zip code input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>Zip Code</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='Zip Code'
                 placeholderTextColor="#666"
                 value={addressForm.zipCode}
                 onChangeText={(text)=>onFormChing({...addressForm,zipCode:text})}
                />
            </View>
            {/* phone  input */}
            <View className='mb-5'>
                <Text className='text-text-primary font-semibold mb-2 '>Phone Number</Text>
                <TextInput
                 className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                 placeholder='Phone Number'
                 placeholderTextColor="#666"
                 value={addressForm.phoneNumber}
                 onChangeText={(text)=>onFormChing({...addressForm,phoneNumber:text})}
                />
            </View>
            {/* Default Address toggle */}
            <View className=' flex-row mb-6 py-1 px-2 bg-surface rounded-2xl items-center justify-between '>
                <Text className='text-text-primary font-semibold '>Set As Defualt address</Text>
                <Switch
                 value={addressForm.isDefault}
                 onValueChange={(value)=>onFormChing({...addressForm,isDefault:value})}
                 thumbColor="#FFFFFF"
                />
            </View>

            {/* Save bottom */}
            <TouchableOpacity
              className='bg-primary rounded-2xl py-5 items-center'
              activeOpacity={0.7}
              onPress={onSave}
              disabled={isAddingAddress ||isUpdateingAddress}
            >
                {isAddingAddress || isUpdateingAddress?(
                    <ActivityIndicator size="small" color="#121212"/>
                ):(
                    <Text className='text-background font-bold text-lg ' >
                        {isEditing?"Save Change":"Add Address"}
                    </Text>
                )}
            </TouchableOpacity>

        </View>
        </ScrollView>
       </KeyboardAvoidingView>

    </SafeScreen>

   </Modal>
  )
}

export default AddressFormModel