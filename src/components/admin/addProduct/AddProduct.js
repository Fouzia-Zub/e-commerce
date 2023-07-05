import {useState} from 'react'
import styles from './AddProduct.module.scss'
import Card from '../../card/Card'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage, db } from "../../../firebase/config"
import {toast} from "react-toastify"
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../../loader/Loader'
import { selectProducts } from '../../../redux/slice/productSlice'

const categories = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Phone" },
];

const initialState ={
  name:"",
  imageURL:"",
  price:0,
  category:"",
  brand:"",
  desc:""
}
const AddProduct = () => {
  const { id } = useParams()
  const products = useSelector(selectProducts)
  const productEdit = products.find((item) => item.id === id)

  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, 
      {...initialState},
      productEdit
    )
    return newState
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  

  function detectForm(id, f1, f2){
    if(id === "ADD"){
      return f1;
    }
    return f2;
  }

  const handleInputChange = (e) =>{
    const {name, value} = e.target
    setProduct({...product, [name]: value})
 
  }

  const handleImageChange = (e) =>{
    const file = e.target.files[0]
    // console.log(file);
    const storageRef = ref(storage, `eShop/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress)
      
    }, 
    (error) => {
      toast.error(error.message)
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setProduct({...product, imageURL: downloadURL})
        toast.success("Image uploaded successfully.")
      });
    }
    );

  }

  // form Submitt handler
  const addProduct = (e) => {
    e.preventDefault();
    // console.log(product);
    setIsLoading(true)
    try{
      addDoc(collection(db, "products"), {

        name:product.name,
        imageURL:product.imageURL,
        price: Number(product.price),
        category:product.category,
        brand:product.brand,
        desc:product.desc,
        createdAt: Timestamp.now().toDate()

      });
      setIsLoading(false)
      setUploadProgress(0)
      // Making all the input fields empty
      setProduct({ ...initialState })

      toast.success("Product uploaded Successfully!")
      navigate("/admin/all-products")
    }catch(error){
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  const editProduct= (e) => {
    e.preventDefault();
    setIsLoading(true)

    if(product.imageURL !== productEdit.imageURL){
      const storageRef = ref(storage, productEdit.imageURL);
      deleteObject(storageRef)
    }

    try {
      setDoc(doc(db, "products", id), {
        name:product.name,
        imageURL:product.imageURL,
        price: Number(product.price),
        category:product.category,
        brand:product.brand,
        desc:product.desc,
        createdAt: product.createdAt,
        editedAt: Timestamp.now().toDate()
      });
      setIsLoading(false)
      toast.success("Product Edited Succesfully!")
      navigate("/admin/all-products")
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  return (
  <>
    {isLoading && <Loader/>}
    <div className={styles.product}>
      <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
      <Card cardClass={styles.card}>
        <form onSubmit={detectForm(id, addProduct, editProduct)}>
          <label>Product Name:</label>
          <input 
            type='text'
            placeholder='Product Name'
            required
            value={product.name}
            name='name'
            onChange={(e) => {handleInputChange(e)}}
          />

          <label>Product Image:</label>
          <Card cardClass={styles.group}>
            {uploadProgress === 0 ? null : (
             <div className={styles.progress}>
                <div className={styles["progress-bar"]} style={{width: `${uploadProgress}%`}}>
                  {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : `Upload Completed ${uploadProgress}%`}
                </div>
              </div> 
            )}

            <input
              type='file'
              accept='image/*'
              placeholder='Product Image'
              name='image'
              onChange={(e) => {handleImageChange(e)}}
            />
            { product.imageURL === "" ? null : (
              <input
              type='text'
              placeholder='imageURL'
              name='imageURL'
              value={product.imageURL}
              disabled
            />
            )}
            
          </Card>
          <label>Product Price:</label>
          <input 
            type='number'
            placeholder='Product Price'
            required
            value={product.price}
            name='price'
            onChange={(e) => {handleInputChange(e)}}
          />
          <label>Product Category:</label>
          <select required name="category" value={product.category} onChange={(e) => {handleInputChange(e)}}>
            <option value="" disabled >
              -- choose product category --
            </option>
            {categories.map((cat) => {
              return (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              )
            })}
          </select>
          <label>Product Company/Brand:</label>
          <input 
            type='text'
            placeholder='Product Brand'
            required
            value={product.brand}
            name='brand'
            onChange={(e) => {handleInputChange(e)}}
          />
          <label>Product Description:</label>
          <textarea 
          name='desc' 
          required 
          value={product.desc} 
          onChange={(e) => {handleInputChange(e)}} 
          cols="30" rows="10">
          </textarea>
          <button className='--btn --btn-primary'>{detectForm(id, "Save Product", "Edit Product")}</button>
        </form>
      </Card>
    </div>
  </>
  )
}

export default AddProduct