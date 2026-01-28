
import React from 'react'

const Label = ({ children, className = '', ...props }) => {
  return (
    <label className={`form-label-wrapper ${className}`} {...props}>
        {children}
    </label>
  )
}

export default Label