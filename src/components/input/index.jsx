import React from 'react'
import "./index.scss"
const Input = props => {
  const { placeholder = "", setValue } = props
  const handleChange = e => {
    setValue(e.currentTarget.value)
  }
  return (
    <input className="my-input" placeholder={placeholder} onChange={handleChange}></input>
  )
}

export default Input