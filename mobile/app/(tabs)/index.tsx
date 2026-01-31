import { View, Text, ScrollView, TouchableOpacity, TextInput,Image  } from 'react-native'
import React, { useMemo, useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import ProductGrid from '@/components/ProductGrid'
import useProducts from '@/hooks/useProducts'
const ShopScreen = () => {

    const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

  const [searchQuery,setSearchQuery]=useState("")
  const [selectedCategory, setSelectedCategory]=useState("All")
   const {data:products,isLoading,isError} =useProducts()
   

   const fillteredProducts=useMemo(()=>{
     if(!products) return []

     let filterd=products

     //filtring by category
     if(selectedCategory !=="All"){
      filterd=filterd.filter((product)=>product.category === selectedCategory)
     }

     //filtering by searchQuery
     if(searchQuery.trim()){
      filterd=filterd.filter((product)=>product.name.toLowerCase().includes(searchQuery.toLowerCase()))
     }

     return filterd
   },[products,selectedCategory,searchQuery])
  



  return (
    <SafeScreen>
      <ScrollView
      className='flex-1'
      contentContainerStyle={{paddingBottom:100}}
      showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className='px-6 pt-4 pb-4'>
          {/* SHOP && OPTIONICON */}
          <View className='flex-row items-center justify-between mb-6'>
            <View>
              <Text className='text-text-primary text-3xl font-bold tracking-tight'>Shop</Text>
              <Text className='text-text-secondary text-sm mt-1'>Browse all products</Text>
            </View>
             
            <TouchableOpacity 
             className='bg-surface/50 p-3 rounded-full'
             activeOpacity={0.7}
            >
              <Ionicons name='options-outline' size={22} color={"#fff"}/>
            </TouchableOpacity> 
          </View>

          {/* SEARCH INPUT */}
          <View className='bg-surface flex-row items-center px-5 py-2 rounded-2xl'>
            <Ionicons color={"#666"} size={22} name='search'/>
            <TextInput
            placeholder='Search for product'
            placeholderTextColor={"#666"}
            className='flex-1 ml-3 text-base text-text-primary'
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
          </View>

        </View>

        {/* CATEGORY FILTER */}
        <View className='mb-6'>
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal:20}}
          >
            {CATEGORIES.map(category=>{
              const isSelected=selectedCategory===category.name
              return(
                <TouchableOpacity 
                key={category.name}
                onPress={()=>setSelectedCategory(category.name)} 
                className={`mr-2 rounded-2xl size-20 overflow-hidden items-center justify-center
                   ${isSelected?"bg-primary":"bg-surface"}`}
                >
                  {category.icon?(
                    <Ionicons name={category.icon} size={36} color={isSelected?"#121212":"#fff"}/>
                  ):(
                    <Image 
                    source={category.image}
                    className='size-12'
                    resizeMode='contain'
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* PRODUCT&& ITEMS */}
        <View className='px-6 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-text-primary text-lg font-bold'>Products</Text>
            <Text className='text-text-secondary text-sm'>{ fillteredProducts.length} items</Text>
          </View>
          {/* productGrid Component */}
          <ProductGrid products={fillteredProducts} isLoading ={isLoading} isErorr={isError} / >
        </View>

      </ScrollView>
      
    </SafeScreen>
  )
}

export default ShopScreen