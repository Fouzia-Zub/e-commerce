import React, { useEffect, useState } from 'react'
import styles from "./OrderDetails.module.scss"
import { Link, useParams } from 'react-router-dom'
import useFetchDocument from '../../customHooks/useFetchDocument'
import spinnerImg from "../../assests/spinner.jpg"
const OrderDetails = () => {
    const [order, setOrder] = useState(null)
    const { id } = useParams()
    const { document } = useFetchDocument("orders", id)

    useEffect(() => {
        setOrder(document)
    },[document])

  return (
    <section>
        <div className={`container ${styles.table}`}>
            <h2>Order Details</h2>
            <div>
                <Link to={'/order-history'}> &larr; Back To Orders </Link>
            </div>
            <br/>
            {
                order === null ? (
                    <img src={spinnerImg} alt='Loading' width={{ width: "50px" }}/>
                ) : (
                    <>
                        <p>
                            <b>Order ID:</b> {order.id}
                        </p>
                        <p>
                            <b>Order Amount:</b> ${order.orderAmount}
                        </p>
                        <p>
                            <b>Order Status:</b> {order.orderStatus}
                        </p>
                        <br/>
                        <table>
                            <thead>
                                <tr>
                                    <th>s/n</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qunatity</th>
                                    <th>Total</th>
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    order.cartItems.map((cart, index) => {
                                        const {id, price, name, cartQuantity, imageURL} = cart

                                        return (
                                            <tr>
                                                <td>
                                                    <b>{index + 1}</b>
                                                </td>
                                                <td>
                                                    <p>
                                                        <b>{name}</b>
                                                    </p>
                                                    <img src={imageURL} alt={name} style={{width: "100px"}} />
                                                </td>
                                                <td>{price}</td>
                                                <td>
                                                    <b>{cartQuantity}</b>
                                                </td>
                                                <td>{price * cartQuantity.toFixed(2)}</td>
                                                <td className={styles.icon}>
                                                    <Link to={`/review-product/${id}`}>
                                                        <button className='--btn --btn-primary'>Review Product </button>
                                                    </Link> 
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>
                    </>
                )
            }
        </div>
    </section>
  )
}

export default OrderDetails