import React, { useEffect, useState } from 'react'
import styles from './ReviewProduct.module.scss'
import { useSelector } from 'react-redux'
import { selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { useParams } from 'react-router-dom'
import Card from '../card/Card'
import StarsRating from 'react-star-rate'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/config'
import useFetchDocument from '../../customHooks/useFetchDocument'
import spinnerImg from '../../assests/spinner.jpg'

const ReviewProduct = () => {
    const [rate, setRate] = useState(0)
    const [review, setReview] = useState("") 
    const [product, setProduct] = useState(null)
    const { id } = useParams()
    const { document } = useFetchDocument("products", id)
    const userID = useSelector(selectUserID)
    const userName = useSelector(selectUserName)

    // u can't everytime usse redux store to manage data
    // u can't access items from redux store it'll throw error everyTime pageReloads
    // const product = products.find((item) => item.id === id)
    // Instead fetch from db
    useEffect(() => {
        setProduct(document)
    },[document])

    const submitReview = (e) => {
        e.preventDefault();
        const today = new Date()
        const date = today.toDateString()

        const reviewConfig = {
            userID,
            userName,
            productID: id,
            rate, 
            review,
            reviewDate: date,
            createdAt: Timestamp.now().toDate()
        } 

        try{
        addDoc(collection(db, "reviews"), reviewConfig); 
        toast.success("Review Submitted Successfully!!")
        setRate(0)
        setReview("")
        }catch(error){
        toast.error(error.message)
        } 
    }

  return (
    <section>
        <div className={`container ${styles.review}`}>
            <h2>Review Product</h2>
            {
                product === null ? (
                    <img src={spinnerImg} alt='Loading..' style={{width: "50px"}}/>
                ) : (
                    <>
                      <p><b>Product Name:</b>{product.name}</p>
                    <img src={product.imageURL} alt={product.name} style={{width: "100px"}}/>  
                    </>
                )
            }
            <Card cardClass={styles.card}>
                <form onSubmit={(e) => submitReview(e)}>
                    <label>Rating:</label>
                    <StarsRating
                    value={rate}
                    onChange={rate => {
                    setRate(rate);
                    }}
                    />
                    <label>Review:</label>
                    <textarea 
                    value={review} 
                    required 
                    onChange={(e) => setReview(e.target.value)}
                    cols="30" 
                    rows="10"
                    />
                    <button className="--btn --btn-primary">Submit Review</button>
                </form>
            </Card>
        </div>
    </section>
  )
}

export default ReviewProduct