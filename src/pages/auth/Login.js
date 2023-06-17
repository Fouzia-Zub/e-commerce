import {useState} from 'react'
import './auth.modules.css'
import loginImg from '../../assests/login.png'
import { Link,useNavigate } from 'react-router-dom'
import {FaGoogle} from 'react-icons/fa'
import Card from '../../components/card/Card'
import Loader from '../../components/loader/Loader'
import { toast } from 'react-toastify'

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase/config';
import { GoogleAuthProvider } from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Login with Email
  const loginUser = (e) => {
    e.preventDefault()
    setIsLoading(true)

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const user = userCredential.user;
      setIsLoading(false)
      toast.success("Login Successful...")
      navigate("/")
    })
    .catch((error) => {
      setIsLoading(false)
      toast.error(error.message)
    });
  }

  // Login in with Google
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // const user = result.user;
      toast.success("Login Successful..")
      navigate('/')
    }).catch((error) => {
      toast.error(error.message)
    });
  }

  return (
    <>
      
      {isLoading && <Loader/>}
      <section className={`"container" ${"auth"}`}>
        <div className="img">
          <img src={loginImg} alt='login' width="400"/>
        </div> 
        <Card>
          <div className="form">
            <h2>Login</h2>
            <form onSubmit={loginUser}>
              <input 
              type='text' 
              placeholder='Email'
              value={email} 
              required
              onChange={(e) => setEmail(e.target.value)}
              />
              <input 
              type='password' 
              placeholder='Password' 
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              />
              <button type='submit' className="--btn --btn-primary --btn-block">Login</button>
              <div className='links'>
                <Link to='/reset'>Reset Password</Link>
              </div>
              <p>-- or --</p>
            </form>
            <button className='--btn --btn-danger --btn-block' onClick={signInWithGoogle}><FaGoogle color='#fff'/> Login with Google</button>
            <span className='register'>
              <p>Don't have an account?</p>
              <Link to='/register'>Register</Link>
            </span>
          </div>
        </Card>
      </section>
    </> 
  )
}

export default Login