import React, { useState, useEffect } from 'react';
import { Package, Layers, ShoppingCart, DollarSign, TrendingUp, AlertCircle, ArrowUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { productService, categoryService, stockService } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
    totalValue: 0,
    lowStock: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, categories, stock] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        stockService.getAll()
      ]);

      const totalValue = stock.reduce((acc, item) => {
        const price = item.product?.price || 0;
        return acc + (item.quantity || 0) * price;
      }, 0);

      const lowStock = stock.filter(item => (item.quantity || 0) <= 5).length;

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalStock: stock.reduce((acc, item) => acc + (item.quantity || 0), 0),
        totalValue,
        lowStock
      });

      setRecentProducts(products.slice(-5).reverse());
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Visão geral do seu estoque</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Package className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalProducts}</span>
              <span className="stat-label">Total de Produtos</span>
            </div>
            <div className="stat-trend up">
              <ArrowUp className="w-4 h-4" />
              <span>12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Layers className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalCategories}</span>
              <span className="stat-label">Categorias</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalStock}</span>
              <span className="stat-label">Itens em Estoque</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <span className="stat-value">R$ {stats.totalValue.toFixed(2).replace('.', ',')}</span>
              <span className="stat-label">Valor do Estoque</span>
            </div>
            <div className="stat-trend up">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        {stats.lowStock > 0 && (
          <div className="alert-card">
            <div className="alert-icon">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="alert-content">
              <h4>Atenção: Estoque Baixo</h4>
              <p>Você tem {stats.lowStock} produto(s) com estoque baixo ou esgotado.</p>
            </div>
            <button className="btn btn-secondary">
              Verificar
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Produtos Recentes</h3>
              <span className="card-badge">{recentProducts.length}</span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="empty-state">
                  <Package className="w-12 h-12" />
                  <p>Nenhum produto cadastrado</p>
                </div>
              ) : (
                <ul className="product-list">
                  {recentProducts.map((product) => (
                    <li key={product.id} className="product-item">
                      <div className="product-icon">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="product-details">
                        <span className="product-name">{product.name}</span>
                        <span className="product-category">
                          {product.category?.name || 'Sem categoria'}
                        </span>
                      </div>
                      <div className="product-price">
                        R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Ações Rápidas</h3>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <a href="/products" className="quick-action">
                  <div className="action-icon blue">
                    <Package className="w-5 h-5" />
                  </div>
                  <span>Ver Produtos</span>
                </a>
                <a href="/categories" className="quick-action">
                  <div className="action-icon green">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span>Ver Categorias</span>
                </a>
                <a href="/stock" className="quick-action">
                  <div className="action-icon orange">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span>Ver Estoque</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-container {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .page-header {
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .stat-card:nth-child(1)::before { background: #3b82f6; }
        .stat-card:nth-child(2)::before { background: var(--success-color); }
        .stat-card:nth-child(3)::before { background: #f59e0b; }
        .stat-card:nth-child(4)::before { background: #8b5cf6; }

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
          flex: 1;
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

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .stat-trend.up {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .alert-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .alert-icon {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-content {
          flex: 1;
        }

        .alert-content h4 {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .alert-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .card-badge {
          background: linear-gradient(135deg, var(--primary-color), #6366f1);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-body {
          padding: 20px 24px;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          color: var(--text-secondary);
          gap: 12px;
        }

        .empty-state svg {
          opacity: 0.5;
        }

        .product-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .product-item:hover {
          background: #f1f5f9;
        }

        .product-icon {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1));
          color: var(--primary-color);
          padding: 10px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .product-category {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .product-price {
          font-weight: 600;
          color: var(--success-color);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .quick-action:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .action-icon {
          padding: 10px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon.blue {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        .action-icon.green {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success-color);
        }

        .action-icon.orange {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .quick-action span {
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .alert-card {
            flex-direction: column;
            text-align: center;
          }

          .alert-card .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

