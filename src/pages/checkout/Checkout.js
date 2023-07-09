import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { selectBillingAddress, selectShippingAddress } from "../../redux/slice/checkoutSlice";
import { 
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY, 
  selectCartItems, 
  selectCartTotalAmount } from "../../redux/slice/cartSlice";
import { selectEmail } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);


const Checkout = () => {
  const [message, setMessage] = useState("Initializing checkout...");
  const [clientSecret, setClientSecret] = useState("");

  const cartItems = useSelector(selectCartItems)
  const totalAmount = useSelector(selectCartTotalAmount)
  const customerEmail = useSelector(selectEmail)

  const shippingAddress = useSelector(selectShippingAddress)
  const billingAddress = useSelector(selectBillingAddress)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CALCULATE_TOTAL_QUANTITY())
  },[dispatch, cartItems])

  const description = `eShop Payment: email: ${customerEmail}, Amount: ${totalAmount} `
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("https://eshopeservices.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        userEmail: customerEmail,
        shipping: shippingAddress,
        billing: billingAddress,
        description
      }),
    })
      .then((res) => {
        if(res.ok ) {
          return res.json()
        }else{
          return res.json().then((json) => Promise.reject(json))
        }
      })
      .then((data) => {      
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        setMessage("Failed to initialized checkout")
        toast.error("Something went wrong")
      })
      
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <section>
        <div className="container">
          {!clientSecret && <h3>{message}</h3>}
        </div>
      </section>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  )
}

export default Checkout