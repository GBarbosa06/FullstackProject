

import React, { useEffect, useState } from 'react'

const useAuthentication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        return () => setCancelled(true);
    },[]);

    useEffect(() => {
        // Verificar se há token no localStorage ao carregar
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const checkIfIsCancelled = () => {
        if (cancelled) {
            return;
        }
    }



    const register = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                let errorMessage = 'Email já cadastrado ou inválido.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Se não conseguir fazer parse do JSON, usa a mensagem padrão
                }
                throw new Error(errorMessage);
            } 
            
            // Fazer parse da resposta - tentar JSON primeiro
            const responseText = await response.text();
            let token;
            
            try {
                // Tentar fazer parse como JSON
                const result = JSON.parse(responseText);
                token = result.token;
            } catch (e) {
                // Se falhar, usar como texto plano
                token = responseText.replace(/"/g, ''); // Remove aspas se existirem
            }
            
            console.log('Usuário cadastrado com sucesso:', { token });
            
            // Salvar token no localStorage e estado
            if (token) {
                localStorage.setItem('token', token);
                setToken(token);
                return { token };
            }
            
            return { token };
        } catch (error) {
            console.log('Erro no registro:', error.message);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }



    const login = async (credentials) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
                let errorMessage = 'Credenciais inválidas.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Se não conseguir fazer parse do JSON, usa a mensagem padrão
                }
                throw new Error(errorMessage);
            } 
            
            // Fazer parse da resposta - tentar JSON primeiro
            const responseText = await response.text();
            let token;
            
            try {
                // Tentar fazer parse como JSON
                const result = JSON.parse(responseText);
                token = result.token;
            } catch (e) {
                // Se falhar, usar como texto plano
                token = responseText.replace(/"/g, ''); // Remove aspas se existirem
            }
            
            console.log('Login realizado com sucesso:', { token });
            
            // Salvar token no localStorage e estado
            if (token) {
                localStorage.setItem('token', token);
                setToken(token);
                // Salvar dados do usuário se necessário
                setUser({ email: credentials.email });
                return { token };
            }
            
            return { token };
        } catch (error) {
            console.log('Erro no login:', error.message);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
    }

    const isAuthenticated = () => {
        return !!token;
    }

    return {
        register,
        login,
        logout,
        loading,
        error,
        token,
        user,
        isAuthenticated
    }
}

export default useAuthentication
