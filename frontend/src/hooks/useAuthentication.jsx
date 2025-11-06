import React, { useEffect, useState } from 'react'

const useAuthentication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        return () => setCancelled(true);
    },[]);

    const checkIfIsCancelled = () => {
        if (cancelled) {
            return;
        }
    }

    const register = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);

        try{
            const response = await fetch('http://localhost:8080/users/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            
            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário.');
            } 
            
            const result = await response.json();
            console.log('Usuário cadastrado com sucesso:', result);
            return result;
        }catch (error) {
            console.log(error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }

    }
    return {register, loading, error}
}
export default useAuthentication