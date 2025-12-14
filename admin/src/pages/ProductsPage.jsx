import React from 'react'
import { useState } from 'react'
import {PlusIcon,PencilIcon,TrashIcon,XIcon,ImageIcon} from 'lucide-react'
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {productApi} from '../lib/api'
import {getStockStatusBadge} from '../lib/utils'

function ProductsPage() {
  const [showModel,setShowModel]=useState(false)
  const [editingProduct,setEditingProduct] =useState(null)
  const [formData,setFormData]=useState({
    name:"",
    category:"",
    price:"",
    stock:"",
    description:""
  })
  const [images,setImages]=useState([])
  const [imagePreviews,setImagePreview]=useState([])
  const queryClient=useQueryClient()
  //fetch same data
  const {data:products=[]}=useQuery({
    queryKey:["products"],
    queryFn:productApi.getAll
  })

  //we use mutataion whene create or apdate or deleteing
  const createProductMutation=useMutation({
    mutationFn:productApi.create,
    onSuccess:()=>{
      closeModel()
      queryClient.invalidateQueries({queryKey:["products"]})
    }
  })
  const updateProductMutation=useMutation({
    mutationFn:productApi.update,
    onSuccess:()=>{
      closeModel()
      queryClient.invalidateQueries({queryKey:["products"]})
    }
  })

    const deleteProductMutation=useMutation({
    mutationFn:productApi.delete,
    onSuccess:()=>{
      closeModel()
      queryClient.invalidateQueries({queryKey:["products"]})
    }
  })

  const closeModel=()=>{
    //resetData
    setShowModel(false)
    setEditingProduct(null)
    setFormData({
      name:"",
      category:"",
      price:"",
      stock:"",
      description:""
    })
    setImages([])
    setImagePreview([]) 
  }

  const hendleEdit=(product)=>{
    setEditingProduct(product)
    setFormData({
     name:product.name,
    category:product.category,
    price:product.price.toString(),
    stock:product.stock.toString(),
    description:product.description

    })
    setImagePreview(product.images)
    setShowModel(true)
  }

  const hendleImageChange=(e)=>{
    const files=Array.from(e.target.files)
    if(files.length>3) return alert("Maximum 3 images allowed")
    
      setImages(files)
      setImagePreview(files.map((file)=>URL.createObjectURL(file)))
  }

  const hendleSubmit=(e)=>{
    e.preventDefault()

    //for new Products, require images 
    if(!editingProduct && imagePreviews.length ===0){
      return alert ('please uplaod at lest one image')
    }

    const formDataToSand= new FormData()
    formDataToSand.append("name",formData.name)
    formDataToSand.append("category",formData.category)
    formDataToSand.append("price",formData.price)
    formDataToSand.append("stock",formData.stock)
    formDataToSand.append("description",formData.description)

    if(images.length>0) images.forEach((image)=>formDataToSand.append("images",image))

      if(editingProduct){
        updateProductMutation.mutate({id:editingProduct._id,formData:formDataToSand})
      }else{
        createProductMutation.mutate(formDataToSand)
      }
  }

  return (
    <div className='space-y-6'>
      {/* HEDER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold '>Products</h1>
          <p className='text-base-content/70 mt-1'>Manage your products Inventtory</p>
        </div>

        <button onClick={()=>setShowModel(true)} className='btn btn-primary gap-2'>
          <PlusIcon className='w-5 h-5'/>
          Add Product
        </button>

      </div>

      {/* PRODUCT GRID */}
      <div className='grid  grid-cols-1 gap-3'>
         {products.map(product=>{

           const status=getStockStatusBadge(product.stock)
         return(
           <div key={product._id} className='card bg-base-100 shadow-xl'>

            <div className='card-body' >
              <div className='flex items-center gap-6'>

                 <div className='avatar'>
                  <div className='w-20 rounded-xl'>
                    <img src={product.images[0]} alt={product.name}/>
                  </div>
                 </div>

                 <div className='flex-1 '>
                  <div className='flex items-start justify-between'>

                    <div>
                      <h3 className='card-title'>{product.name}</h3>
                      <p className='text-base-content/70 text-sm '>{product.category}</p>
                    </div>
                    
                    <div className={`badge ${status.class}`}>{status.text}</div>

                  </div>
                  <div className='flex items-center gap-6 mt-4'>
                    <div>
                      <p className=' text-xs text-base-content/70'>Price</p>
                      <p className='font-bold text-lg '>${product.price}</p>
                    </div>
                    <div>
                      <p className=' text-xs text-base-content/70'>Stock</p>
                      <p className='font-bold text-lg '>${product.stock} units</p>
                    </div>
                  </div>
                 </div>

                 <div className='card-actions'>
                  <button
                  className='btn btn-square btn-ghost'
                  onClick={()=>hendleEdit(product)}>
                    <PencilIcon className='w-5 h-5'/>
                  </button>
                  <button
                  className='btn btn-square btn-ghost text-error'
                  onClick={()=>deleteProductMutation.mutate(product._id)}
                  >
                   {deleteProductMutation.isPending ?(
                    <span className='loading loading-spinner'></span>
                   ):(
                     <TrashIcon className='w-5 h-5'/>
                   )}
                  </button>
                 </div>
                 
              </div>
            </div>
          </div>
         )
         })}
      </div>

      {/* Add /Edit product Model */}
      <input type='checkbox' className='modal-toggle' checked={showModel} readOnly></input>

      <div className='modal'>
        <div className='modal-box max-w-2xl '>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-2xl'>
              {editingProduct?"Edit Product":"Add New Product"}
            </h3>
            
            <button onClick={closeModel} className='btn- btn-sm btn-circle btn-ghost'>
              <XIcon className='size-5'/>
            </button>
          </div>

          <form onSubmit={hendleSubmit}>
            <div className='grid grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span>Product Name</span>
                </label>
                <input
                  type='text'
                  placeholder='Enter Product Name'
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span>Category</span>
                </label>
                <select
                className='select select-bordered'
                value={formData.category}
                onChange={(e)=>setFormData({...formData,category:e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span>Price ($)</span>
                </label>
                <input
                  type='number'
                  step="0.01"
                  placeholder="0.00"
                  className='input input-bordered'
                  value={formData.price}
                  onChange={(e)=>setFormData({...formData,price:e.target.value})}
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span>Stock</span>
                </label>
                <input
                  type='number'
                  placeholder="0"
                  className='input input-bordered'
                  value={formData.stock}
                  onChange={(e)=>setFormData({...formData,stock:e.target.value})}
                  required
                />
              </div>
            </div>
              <div className='form-control flex flex-col gap-2 '>
                <label className='label'>
                  <span>Description</span>
                </label>
                <textarea
                  className='textarea textarea-bordered w-full'
                  placeholder='Enter product description'
                  value={formData.description}
                  onChange={(e)=>setFormData({...formData,description:e.target.value})}
                />

              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-semibold text-base flex items-center gap-2'>
                    <ImageIcon className='size-5'/>
                    Product Image
                  </span>
                  <span className='lable-text-alt text-xs opacity-60'>Max 3 Image</span>
                </label>
                <div className='bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={hendleImageChange}
                    className='file-input file-input-bordered file-input-primary w-full'
                    required={! editingProduct}
                  />
                  {editingProduct &&(
                    <p className='text-xs text-base-content/60 mt-2 text-center'>
                      Leave empty to keep currennt images
                    </p>
                  )}
                </div>
                {imagePreviews.length >0 &&(
                  <div className='flex gap-2 mt-2'>
                    {imagePreviews.map((preview,index)=>(
                      <div key={index} className='avatar'>
                        <div className='w-20 rounded-lg'>
                          <img src={preview} alt={`Preview ${index +1}`}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='modal-action'>
                <button
                type='button'
                onClick={closeModel}
                className='btn'
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  Cancel
                </button>

                <button
                type='submit'
                className='btn btn-primary'
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  {createProductMutation.isPending || updateProductMutation.isPending ?(
                    <span className='loading loading-spinner'></span>
                  ):editingProduct?(
                    "Update Product"
                  ):(
                    "Add Product"
                  )}
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
