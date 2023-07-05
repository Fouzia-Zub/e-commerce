import styles from './Loader.module.scss'
import loaderImg from "../../assests/loader.gif"
import ReactDOM from 'react-dom'
const Loader = () => {
  return ReactDOM.createPortal (
    <div className={styles.wrapper}>
        <div className={styles.loader}>
            <img src={loaderImg} alt='loader..'/>
        </div>
    </div>,
    document.getElementById("loader")
  )
}

export default Loader