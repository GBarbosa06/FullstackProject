

const User = ({name, email}) => {
  return (
    <div className='p-4 m-2 border border-gray-300 rounded-lg bg-gray-800 text-white'>
        <h3 className='font-semibold text-lg'>Nome: {name}</h3>
        <h3 className='text-gray-300'>Email: {email}</h3>
    </div>
  )
}

export default User
