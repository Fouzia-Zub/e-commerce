import React from 'react'
import './Card.modules.css'
const Card = ({children, cardClass }) => {
  return (
    <div className={`${"card"} ${cardClass}`}> {children} </div>
  )
}

export default Card