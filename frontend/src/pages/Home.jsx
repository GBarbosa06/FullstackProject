import React, { useEffect } from 'react'
import User from '../components/User';

const Home = () => {
    const [usuarios, setUsuarios] = React.useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await fetch ("http://localhost:8080/users");
            const data = await response.json();
            console.log(data);
            setUsuarios(data);
        }
        fetchUsuarios();
    }, []);

  return (
    <div>
        <h2>Listagem dos usuários</h2>
        {usuarios && usuarios.length > 0 ? (
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario.id}>
                        <User name={usuario.name} email={usuario.email} />
                    </li>
                ))}
            </ul>
        ) : (
            <p>Nenhum usuário encontrado.</p>
        )}
    </div>
  )
}

export default Home;