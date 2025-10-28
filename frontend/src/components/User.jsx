import React from 'react'

const User = ({name, email}) => {
  return (
    <div className='p-4 m-2 border border-gray-200 rounded'>
        <h3>Nome: {name}</h3>
        <h3>Email: {email}</h3>
    </div>
  )
}

export default User