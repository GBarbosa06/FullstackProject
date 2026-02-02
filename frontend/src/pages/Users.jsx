import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Trash2, X, Shield, Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { userService } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert('Erro ao carregar dados: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        else if (formData.name.trim().length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        
        if (!formData.email) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await userService.update({
                id: editingUser.id,
                name: formData.name,
                email: formData.email
            });
            loadUsers();
            closeModal();
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await userService.delete(id);
            // Recarregar dados e fechar modal
            await loadUsers();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '' });
        }
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '' });
        setErrors({});
    };

    const getUserRole = (roles) => {
        if (!roles || roles.length === 0) return 'Usuário';
        const roleNames = roles.map(r => r.name || r);
        if (roleNames.includes('ADMIN')) return 'Administrador';
        return 'Usuário';
    };

    return (
        <div className="page-container">
            <Navbar />
            
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Usuários</h1>
                        <p className="page-subtitle">Gerencie os usuários do sistema</p>
                    </div>
                </div>

                {(() => {
                    if (loading) {
                        return (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Carregando usuários...</p>
                            </div>
                        );
                    } else if (users.length === 0) {
                        return (
                            <div className="empty-state">
                                <UsersIcon className="w-16 h-16" />
                                <h3>Nenhum usuário encontrado</h3>
                                <p>Não há usuários cadastrados no sistema</p>
                            </div>
                        );
                    } else {
                        return (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Função</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>#{user.id}</td>
                                                <td>
                                                    <div className="user-name">
                                                        <div className="user-avatar">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className="role-badge">
                                                        <Shield className="w-3 h-3" />
                                                        {getUserRole(user.roles)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="action-btn edit" 
                                                            onClick={() => openModal(user)}
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            className="action-btn delete" 
                                                            onClick={() => setDeleteConfirm(user.id)}
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                })()}
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Editar Usuário</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-body">
                            {errors.general && (
                                <div className="message message-error">{errors.general}</div>
                            )}
                            
                            <Input
                                type="text"
                                label="Nome"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!errors.name}
                                required
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                            
                            <Input
                                type="email"
                                label="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={!!errors.email}
                                required
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <div className="spinner"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        'Salvar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirmar Exclusão</h2>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                                    Cancelar
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={() => handleDelete(deleteConfirm)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .page-container {
                    min-height: 100vh;
                    background: var(--bg-primary);
                }

                .page-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 32px 24px;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 32px;
                }

                .page-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }

                .page-subtitle {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    color: var(--text-secondary);
                    gap: 16px;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    color: var(--text-secondary);
                    text-align: center;
                    gap: 16px;
                }

                .empty-state svg {
                    opacity: 0.5;
                }

                .empty-state h3 {
                    font-size: 1.25rem;
                    color: var(--text-primary);
                }

                .table-container {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table th {
                    background: #f8fafc;
                    padding: 16px 20px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--text-secondary);
                    border-bottom: 1px solid var(--border-color);
                }

                .table td {
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-primary);
                }

                .table tr:last-child td {
                    border-bottom: none;
                }

                .table tr:hover {
                    background: #f8fafc;
                }

                .user-name {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, var(--primary-color), #6366f1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--success-color);
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn.edit {
                    background: rgba(79, 70, 229, 0.1);
                    color: var(--primary-color);
                }

                .action-btn.edit:hover {
                    background: rgba(79, 70, 229, 0.2);
                }

                .action-btn.delete {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error-color);
                }

                .action-btn.delete:hover {
                    background: rgba(239, 68, 68, 0.2);
                }

                .error-text {
                    color: var(--error-color);
                    font-size: 0.8rem;
                    margin-top: -16px;
                    margin-bottom: 16px;
                    margin-left: 4px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }

                .modal {
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 480px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: modalSlideIn 0.3s ease;
                }

                .modal-sm {
                    max-width: 400px;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 28px;
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .modal-close {
                    background: none;
                    border: none;
                    padding: 8px;
                    border-radius: 8px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: #f1f5f9;
                    color: var(--text-primary);
                }

                .modal-body {
                    padding: 28px;
                }

                .modal-footer {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }

                .btn-danger {
                    background: linear-gradient(135deg, var(--error-color), #dc2626);
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .table-container {
                        overflow-x: auto;
                    }

                    .table {
                        min-width: 600px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Users;

