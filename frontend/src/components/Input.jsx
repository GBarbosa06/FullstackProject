

import React, { useState } from 'react'

const Input = ({ 
  type = 'text', 
  className = '', 
  error = false, 
  success = false,
  icon = null,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputClasses = () => {
    let classes = 'input-field';
    
    if (error) classes += ' input-error';
    else if (success) classes += ' input-success';
    else if (isFocused) classes += ' input-focused';
    
    return `${classes} ${className}`;
  };

  return (
    <div className="input-wrapper">
      <input
        type={type}
        className={getInputClasses()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {icon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  )
}

export default Input
