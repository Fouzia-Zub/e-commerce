import { useEffect, useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.modules.css'
import {IoMdCart, IoMdClose } from 'react-icons/io'
import {GiHamburgerMenu} from 'react-icons/gi'
import {FaUserCircle} from 'react-icons/fa'
// import { BsCartCheck } from 'react-icons/bs'
import {auth} from '../../firebase/config'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '../../redux/slice/authSlice'
import ShowOnLogin, { ShowOnLogout } from '../hiddenlink/HiddenLink'

const logo = (
<div className="logo">
  <NavLink to='/'> 
    <h2>
      e<span>Shop</span>.
    </h2>
  </NavLink>
</div>
)

const cart =(
  <span className="cart">
    <NavLink to='/cart'>Cart
    <IoMdCart size={20}/>
    <p>0</p>
    </NavLink>
  </span>
)

const activeLink = (
  ({isActive}) => isActive ? `${"active"}` : ""
)

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Monitar Currently Active User
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        if(user.displayName === null){
          const uN = user.email.substring(0, user.email.indexOf("@"))
          const uName = uN.charAt(0).toUpperCase() + uN.slice(1)
          setDisplayName(uName)
        }else{
          setDisplayName(user.displayName)
        }
        
        // save auth state to redux so that every one can access
        dispatch(SET_ACTIVE_USER({
          email:user.email,
          userName:user.displayName ? user.displayName : displayName ,
          userID:user.uid
        }))
      } else {
        setDisplayName("")
        dispatch(REMOVE_ACTIVE_USER())
      }
    });
  },[dispatch, displayName])

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const hideMenu = () => {
    setShowMenu(false)
  }

  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success("Logout Successfully.")
      navigate("/")
    }).catch((error) => {
      toast.error(error.message)
    });
  }

  return (
    <header>
      <div className="header">
        {logo}
        <nav className={showMenu ? `${"show-nav"}` : `${"hide-nav"}`}>
          <div className={showMenu ? `${"nav-wrapper"} ${"show-nav-wrapper"}` : `${"nav-wrapper"}`} onClick={hideMenu}></div>
          <ul onClick={hideMenu}>
            <li className="logo-mobile">{logo} <IoMdClose size={22} color="#fff" onClick={hideMenu}/></li>
            <li><button className="--btn --btn-primary">Admin</button></li>
            <li><NavLink to='/' className={activeLink}>Home</NavLink></li>
            <li><NavLink to='/contact' className={activeLink}>Contact</NavLink></li>
          </ul>
          <div className="header-right" onClick={hideMenu}>
            <span className="links">
              <ShowOnLogout><NavLink to='/login' className={activeLink}>Login</NavLink></ShowOnLogout>
              <ShowOnLogin><a href='/' style={{color: "#ff7722"}}> <FaUserCircle size={16} />Hi, {displayName}</a></ShowOnLogin>
              {/* <NavLink to='/register' className={activeLink}>Register</NavLink> */}
              <ShowOnLogin><NavLink to='/order-history' className={activeLink}>My Orders</NavLink></ShowOnLogin>
              <ShowOnLogin><NavLink to='/' onClick={logoutUser}>Logout </NavLink></ShowOnLogin>
            </span>
            {cart}
          </div>  
        </nav>
        <div className='menu-icon'>
          {cart}
          <GiHamburgerMenu size={28} onClick={toggleMenu}/>
        </div>
      </div>
    </header>
    
  )
}

export default Header