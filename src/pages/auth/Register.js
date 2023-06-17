import {useState} from 'react'
import registerImg from '../../assests/register.png'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader'

import {createUserWithEmailAndPassword} from "firebase/auth"
import { auth } from '../../firebase/config';

const Register = () => {
  const [email, setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const registerUser = (e) => {
    e.preventDefault()
    if(password !== cPassword) {
      toast.error("Password doesn't match!")
    }

    setIsLoading(true)

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // eslint-disable-next-line 
      const user = userCredential.user;
      // console.log(user);
      setIsLoading(false)
      toast.success("Registration Successful...")
      navigate('/login')

    })
    .catch((error) => {
      toast.error(error.message)
      setIsLoading(false)
    });
  }

  return (
    <>
      
      {isLoading && <Loader/>}
      <section className={`"container" ${"auth"}`}> 
        <Card>
          <div className="form">
            <h2>Register</h2>
            <form onSubmit={registerUser} autoComplete="off">
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
              <input 
              type='password' 
              placeholder='Confirm Password' 
              value={cPassword}
              required
              onChange={(e) => setCPassword(e.target.value)}
              /> 
              <button type='submit' className="--btn --btn-primary --btn-block">Register</button>
            </form>
            <span className='register'>
              <p>Already an account?</p>
              <Link to='/login'>Login</Link>
            </span>
          </div>
        </Card>
        <div className="img">
          <img src={registerImg} alt='login' width="400"/>
        </div>
      </section>
    </>
    
  )
}

export default Register