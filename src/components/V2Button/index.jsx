import React from 'react';
import "./index.scss"

const V2Button = ({ label, href, type, variant='contained', className="" }) => {

  return (
    <a href="#" className={`${variant==='text'?'text':'contained'} v2_button ${className} `}>
      <span>{label}</span>
      <i className={`fa ${type === 'link' ? 'fa-chevron-right' : 'fa-pencil'}`}></i>
    </a>
  )
}

export default V2Button