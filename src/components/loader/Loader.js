import './Loader.modules.css'
import loaderImg from "../../assests/loader.gif"
import ReactDOM from 'react-dom'
const Loader = () => {
  return ReactDOM.createPortal (
    <div className='wrapper'>
        <div className='loader'>
            <img src={loaderImg} alt='loader..'/>
        </div>
    </div>,
    document.getElementById("loader")
  )
}

export default Loader