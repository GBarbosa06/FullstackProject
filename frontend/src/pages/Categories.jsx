import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { categoryService } from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        else if (formData.name.length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        
        if (!editingCategory && !formData.slug.trim()) {
            newErrors.slug = 'Slug é obrigatório';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[áàâã]/g, 'a')
            .replace(/[éèê]/g, 'e')
            .replace(/[íìî]/g, 'i')
            .replace(/[óòôõ]/g, 'o')
            .replace(/[úùû]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingCategory) {
                await categoryService.update({
                    id: editingCategory.id,
                    name: formData.name,
                    slug: formData.slug
                });
            } else {
                await categoryService.create(formData);
            }
            loadCategories();
            closeModal();
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            loadCategories();
            setDeleteConfirm(null);
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, slug: category.slug });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '' });
        }
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '' });
        setErrors({});
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({ ...formData, name });
        if (!editingCategory) {
            setFormData(prev => ({ ...prev, slug: generateSlug(name) }));
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Categorias</h1>
                        <p className="page-subtitle">Gerencie as categorias dos seus produtos</p>
                    </div>
                    <button className="btn" onClick={() => openModal()}>
                        <Plus className="w-5 h-5" />
                        Nova Categoria
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando categorias...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="empty-state">
                        <Tag className="w-16 h-16" />
                        <h3>Nenhuma categoria encontrada</h3>
                        <p>Comece criando sua primeira categoria</p>
                        <button className="btn" onClick={() => openModal()}>
                            <Plus className="w-5 h-5" />
                            Criar Categoria
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Slug</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>#{category.id}</td>
                                        <td>
                                            <div className="category-name">
                                                <Tag className="w-4 h-4" />
                                                {category.name}
                                            </div>
                                        </td>
                                        <td><code>{category.slug}</code></td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn edit" 
                                                    onClick={() => openModal(category)}
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => setDeleteConfirm(category.id)}
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
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
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
                                onChange={handleNameChange}
                                error={!!errors.name}
                                icon={<Tag className="w-5 h-5" />}
                                required
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                            
                            <Input
                                type="text"
                                label="Slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                error={!!errors.slug}
                                required
                            />
                            {errors.slug && <p className="error-text">{errors.slug}</p>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn">
                                    {editingCategory ? 'Salvar' : 'Criar'}
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
                            <p>Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.</p>
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

                .empty-state p {
                    margin-bottom: 8px;
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

                .category-name {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                }

                .category-name svg {
                    color: var(--primary-color);
                }

                code {
                    background: #f1f5f9;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
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

                /* Modal Styles */
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

                    .page-header .btn {
                        width: 100%;
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

export default Categories;

