import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { Product } from '@/types'
import useWishlist from '@/hooks/useWishlist';
import { Ionicons } from '@expo/vector-icons';

interface productGridProps{
  products:Product[];
  isLoading:boolean;
  isErorr:boolean
}
const ProductGrid = ({products,isLoading,isErorr}:productGridProps) => {
  const {isInWishlist,toggleWshishlist,isAddingToWishlist,isRemovingFromWishlst}=useWishlist()

  const handleAddToCart=()=>{}

  const renderProduct=()=>{}
  return (
    <FlatList
    data={[]}
    // renderItem={renderProduct}
    // keyExtractor={item=>item._id}
    numColumns={2}

    showsVerticalScrollIndicator={false}
    scrollEnabled={false}
    ListEmptyComponent={<NoProductFound/>}
    />
  )
}

export default ProductGrid

function NoProductFound(){
  return(
    <View className='py-20 items-center justify-center'>
      <Ionicons name='search-outline' size={48} color={'#666'}/>
      <Text className='text-text-primary font-semibold mt-4'>No products found</Text>
      <Text className='text-text-secondary text-sm- mt-2'>Try adjusting your filter</Text>
    </View>
  )
}