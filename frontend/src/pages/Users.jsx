
import React, { useEffect } from 'react'
import User from '../components/User';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
    const [usuarios, setUsuarios] = React.useState([]);
    const { user, token, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch("http://localhost:8080/users", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUsuarios(data);
                } else {
                    console.error('Erro ao buscar usuários:', response.status);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }

        if (isAuthenticated) {
            fetchUsuarios();
        }
    }, [token, isAuthenticated]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Listagem dos usuários</h2>
                <div className="flex items-center gap-4">
                    {user && <span className="text-sm text-gray-300">Logado como: {user.email}</span>}
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
                    >
                        Sair
                    </button>
                </div>
            </div>
            
            {usuarios && usuarios.length > 0 ? (
                <ul className="space-y-2">
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

export default Users;
