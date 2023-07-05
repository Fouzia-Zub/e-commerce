import { useEffect, useState} from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'
import {IoMdCart, IoMdClose } from 'react-icons/io'
import {GiHamburgerMenu} from 'react-icons/gi'
import {FaUserCircle} from 'react-icons/fa'
import {auth} from '../../firebase/config'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '../../redux/slice/authSlice'
import ShowOnLogin, { ShowOnLogout } from '../hiddenlink/HiddenLink'
import { AdminOnlyLink } from '../adminOnlyRoute/AdminOnlyRoute'
import { CALCULATE_TOTAL_QUANTITY, selectCartTotalQuantity } from '../../redux/slice/cartSlice'


const logo = (
<div className={styles.logo}>
  <NavLink to='/'> 
    <h2>
      e<span>Shop</span>.
    </h2>
  </NavLink>
</div>
)



const activeLink = (
  ({isActive}) => isActive ? `${styles.active}` : ""
)

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [scrollPage, setScrollPage] = useState(false)
  const cartTotalQuantity = useSelector(selectCartTotalQuantity)

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY())
  },[])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fixNavbar = () => {
    if(window.scrollY > 50){
      setScrollPage(true)
    }else{
      setScrollPage(false)
    }
  }
  window.addEventListener("scroll", fixNavbar)

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

  const cart =(
    <span className={styles.cart}>
      <NavLink to='/cart'>Cart
      <IoMdCart size={20}/>
      <p>{cartTotalQuantity}</p>
      </NavLink>
    </span>
  )

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav className={showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`}>
          <div className={showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` : `${styles["nav-wrapper"]}`} onClick={hideMenu}></div>
          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>{logo} <IoMdClose size={22} color="#fff" onClick={hideMenu}/></li>
            <li>
              <AdminOnlyLink>
                <Link to='/admin/home'>
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </AdminOnlyLink>
            </li>
            <li><NavLink to='/' className={activeLink}>Home</NavLink></li>
            <li><NavLink to='/contact' className={activeLink}>Contact</NavLink></li>
          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              <ShowOnLogout><NavLink to='/login' className={activeLink}>Login</NavLink></ShowOnLogout>
              <ShowOnLogin><a href='/' style={{color: "#ff7722"}}> <FaUserCircle size={16} />Hi, {displayName}</a></ShowOnLogin>
              {/* <NavLink to='/register' className={activeLink}>Register</NavLink> */}
              <ShowOnLogin><NavLink to='/order-history' className={activeLink}>My Orders</NavLink></ShowOnLogin>
              <ShowOnLogin><NavLink to='/' onClick={logoutUser}>Logout </NavLink></ShowOnLogin>
            </span>
            {cart}
          </div>  
        </nav>
        <div className={styles['menu-icon']}>
          {cart}
          <GiHamburgerMenu size={28} onClick={toggleMenu}/>
        </div>
      </div>
    </header>
    
  )
}

export default Header