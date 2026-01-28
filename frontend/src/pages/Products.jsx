import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Package, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { productService, categoryService } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: ''
    });
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setCategoriesLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productService.getAll(),
                categoryService.getAll()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
            setCategoriesLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        else if (formData.name.length < 3) newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        
        if (!formData.price) newErrors.price = 'Preço é obrigatório';
        else if (parseFloat(formData.price) < 0) newErrors.price = 'Preço não pode ser negativo';
        
        if (!formData.categoryId) newErrors.categoryId = 'Categoria é obrigatória';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                categoryId: parseInt(formData.categoryId)
            };

            if (editingProduct) {
                await productService.update({
                    id: editingProduct.id,
                    ...productData
                });
            } else {
                await productService.create(productData);
            }
            loadData();
            closeModal();
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const handleDelete = async (id) => {
        try {
            await productService.delete(id);
            loadData();
            setDeleteConfirm(null);
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                categoryId: product.category?.id?.toString() || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', categoryId: '' });
        }
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', categoryId: '' });
        setErrors({});
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Sem categoria';
    };

    return (
        <div className="page-container">
            <Navbar />
            
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Produtos</h1>
                        <p className="page-subtitle">Gerencie os produtos do seu estoque</p>
                    </div>
                    <button className="btn" onClick={() => openModal()}>
                        <Plus className="w-5 h-5" />
                        Novo Produto
                    </button>
                </div>

                {loading || categoriesLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando produtos...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <Package className="w-16 h-16" />
                        <h3>Nenhum produto encontrado</h3>
                        <p>Comece cadastrando seu primeiro produto</p>
                        <button className="btn" onClick={() => openModal()}>
                            <Plus className="w-5 h-5" />
                            Criar Produto
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Produto</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Preço</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>#{product.id}</td>
                                        <td>
                                            <div className="product-name">
                                                <Package className="w-4 h-4" />
                                                {product.name}
                                            </div>
                                        </td>
                                        <td className="description-cell">
                                            {product.description || '-'}
                                        </td>
                                        <td>
                                            <span className="category-badge">
                                                {product.category?.name || 'Sem categoria'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="price-cell">
                                                <DollarSign className="w-4 h-4" />
                                                R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn edit" 
                                                    onClick={() => openModal(product)}
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => setDeleteConfirm(product.id)}
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
                            <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
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
                                label="Nome do Produto"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!errors.name}
                                icon={<Package className="w-5 h-5" />}
                                required
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                            
                            <div className="input-wrapper">
                                <textarea
                                    className="input-field"
                                    placeholder=" "
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                                <label className="input-label">Descrição (opcional)</label>
                            </div>
                            
                            <Input
                                type="number"
                                label="Preço"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                error={!!errors.price}
                                icon={<DollarSign className="w-5 h-5" />}
                                step="0.01"
                                min="0"
                                required
                            />
                            {errors.price && <p className="error-text">{errors.price}</p>}
                            
                            <div className="input-wrapper">
                                <select
                                    className={`input-field ${errors.categoryId ? 'input-error' : ''}`}
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <label className="input-label">Categoria</label>
                            </div>
                            {errors.categoryId && <p className="error-text">{errors.categoryId}</p>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn">
                                    {editingProduct ? 'Salvar' : 'Criar'}
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
                            <p>Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.</p>
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

                .product-name {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                }

                .product-name svg {
                    color: var(--primary-color);
                }

                .description-cell {
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .category-badge {
                    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1));
                    color: var(--primary-color);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .price-cell {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;
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

                .input-wrapper textarea {
                    resize: vertical;
                    min-height: 80px;
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
                    max-width: 520px;
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

                select.input-field {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                    padding-right: 40px;
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
                        min-width: 800px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Products;

