import React from 'react'

const Label = ({children}) => {
  return (
    <label className='flex flex-col md:w-[50%] lg:w-[30%] w-[70%]'>
        {children}
    </label>
  )
}

export default Label