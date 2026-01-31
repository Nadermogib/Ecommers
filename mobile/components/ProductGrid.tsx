import { View, Text } from 'react-native'
import React from 'react'
import { Product } from '@/types'

interface productGridProps{
  products:Product[];
  isLoading:boolean;
  isErorr:boolean
}
const ProductGrid = ({products,isLoading,isErorr}:productGridProps) => {
  const handleAddToCart=()=>{}
  return (
    <View>
      <Text>ProductGrid</Text>
    </View>
  )
}

export default ProductGrid