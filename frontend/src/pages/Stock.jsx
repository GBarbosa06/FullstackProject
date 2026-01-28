import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ShoppingCart, Package, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { stockService, productService } from '../services/api';

const Stock = () => {
    const [stockItems, setStockItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setProductsLoading(true);
            const [stockData, productsData] = await Promise.all([
                stockService.getAll(),
                productService.getAll()
            ]);
            setStockItems(stockData);
            setProducts(productsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
            setProductsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productId) newErrors.productId = 'Produto é obrigatório';
        if (!formData.quantity) newErrors.quantity = 'Quantidade é obrigatória';
        else if (parseInt(formData.quantity) < 0) newErrors.quantity = 'Quantidade não pode ser negativa';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const stockData = {
                product: { id: parseInt(formData.productId) },
                quantity: parseInt(formData.quantity)
            };

            if (editingStock) {
                await stockService.update({
                    id: editingStock.id,
                    ...stockData
                });
            } else {
                await stockService.create(stockData);
            }
            loadData();
            closeModal();
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const handleDelete = async (id) => {
        try {
            await stockService.delete(id);
            loadData();
            setDeleteConfirm(null);
        } catch (error) {
            setErrors({ general: error.message });
        }
    };

    const openModal = (stockItem = null) => {
        if (stockItem) {
            setEditingStock(stockItem);
            setFormData({
                productId: stockItem.product?.id?.toString() || '',
                quantity: stockItem.quantity?.toString() || ''
            });
        } else {
            setEditingStock(null);
            setFormData({ productId: '', quantity: '' });
        }
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStock(null);
        setFormData({ productId: '', quantity: '' });
        setErrors({});
    };

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product?.name || 'Produto desconhecido';
    };

    const getProductPrice = (productId) => {
        const product = products.find(p => p.id === productId);
        return product?.price || 0;
    };

    const isLowStock = (quantity) => quantity <= 5;
    const isOutOfStock = (quantity) => quantity === 0;

    const totalItems = stockItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const lowStockCount = stockItems.filter(item => item.quantity <= 5).length;
    const totalValue = stockItems.reduce((acc, item) => {
        return acc + (item.quantity || 0) * getProductPrice(item.product?.id);
    }, 0);

    return (
        <div className="page-container">
            <Navbar />
            
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Estoque</h1>
                        <p className="page-subtitle">Gerencie o estoque dos seus produtos</p>
                    </div>
                    <button className="btn" onClick={() => openModal()}>
                        <Plus className="w-5 h-5" />
                        Adicionar ao Estoque
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{totalItems}</span>
                            <span className="stat-label">Total em Estoque</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stockItems.length}</span>
                            <span className="stat-label">Itens Cadastrados</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{lowStockCount}</span>
                            <span className="stat-label">Estoque Baixo</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <Package className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                            <span className="stat-label">Valor Total</span>
                        </div>
                    </div>
                </div>

                {loading || productsLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando estoque...</p>
                    </div>
                ) : stockItems.length === 0 ? (
                    <div className="empty-state">
                        <ShoppingCart className="w-16 h-16" />
                        <h3>Nenhum item no estoque</h3>
                        <p>Comece adicionando produtos ao estoque</p>
                        <button className="btn" onClick={() => openModal()}>
                            <Plus className="w-5 h-5" />
                            Adicionar Estoque
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockItems.map((item) => {
                                    const quantity = item.quantity || 0;
                                    return (
                                        <tr key={item.id}>
                                            <td>#{item.id}</td>
                                            <td>
                                                <div className="product-info">
                                                    <Package className="w-4 h-4" />
                                                    <div>
                                                        <span className="product-name">{getProductName(item.product?.id)}</span>
                                                        <span className="product-price">R$ {getProductPrice(item.product?.id).toFixed(2).replace('.', ',')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="quantity-badge">
                                                    {quantity} unid.
                                                </span>
                                            </td>
                                            <td>
                                                {isOutOfStock(quantity) ? (
                                                    <span className="status-badge out">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Sem Estoque
                                                    </span>
                                                ) : isLowStock(quantity) ? (
                                                    <span className="status-badge low">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Estoque Baixo
                                                    </span>
                                                ) : (
                                                    <span className="status-badge ok">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Em Estoque
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="action-btn edit" 
                                                        onClick={() => openModal(item)}
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="action-btn delete" 
                                                        onClick={() => setDeleteConfirm(item.id)}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                            <h2>{editingStock ? 'Editar Estoque' : 'Adicionar ao Estoque'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-body">
                            {errors.general && (
                                <div className="message message-error">{errors.general}</div>
                            )}
                            
                            <div className="input-wrapper">
                                <select
                                    className={`input-field ${errors.productId ? 'input-error' : ''}`}
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione um produto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - R$ {product.price?.toFixed(2).replace('.', ',')}
                                        </option>
                                    ))}
                                </select>
                                <label className="input-label">Produto</label>
                            </div>
                            {errors.productId && <p className="error-text">{errors.productId}</p>}
                            
                            <Input
                                type="number"
                                label="Quantidade"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                error={!!errors.quantity}
                                icon={<ShoppingCart className="w-5 h-5" />}
                                min="0"
                                required
                            />
                            {errors.quantity && <p className="error-text">{errors.quantity}</p>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn">
                                    {editingStock ? 'Salvar' : 'Adicionar'}
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
                            <p>Tem certeza que deseja excluir este item do estoque? Esta ação não pode ser desfeita.</p>
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon.blue {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1));
                    color: #3b82f6;
                }

                .stat-icon.green {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1));
                    color: var(--success-color);
                }

                .stat-icon.orange {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.1));
                    color: #f59e0b;
                }

                .stat-icon.purple {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.1));
                    color: #8b5cf6;
                }

                .stat-content {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .stat-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
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

                .product-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .product-info svg {
                    color: var(--primary-color);
                }

                .product-info > div {
                    display: flex;
                    flex-direction: column;
                }

                .product-name {
                    font-weight: 500;
                }

                .product-price {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }

                .quantity-badge {
                    background: #f1f5f9;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-badge.ok {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--success-color);
                }

                .status-badge.low {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }

                .status-badge.out {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error-color);
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

                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                    }

                    .table-container {
                        overflow-x: auto;
                    }

                    .table {
                        min-width: 700px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Stock;

