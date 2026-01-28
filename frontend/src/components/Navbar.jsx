import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Layers, ShoppingCart, Users, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/products', label: 'Produtos', icon: Package },
        { path: '/categories', label: 'Categorias', icon: Layers },
        { path: '/stock', label: 'Estoque', icon: ShoppingCart },
        { path: '/users', label: 'Usuários', icon: Users },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <Package className="w-6 h-6" />
                    </div>
                    <span className="brand-text">StockManager</span>
                </div>

                <div className="navbar-menu">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <Icon className="nav-icon" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-avatar">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="user-name">{user?.name || user?.email || 'Usuário'}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Sair">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style>{`
                .navbar {
                    background: white;
                    border-bottom: 1px solid var(--border-color);
                    padding: 0 24px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .navbar-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 70px;
                }

                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .brand-icon {
                    background: linear-gradient(135deg, var(--primary-color), #6366f1);
                    padding: 10px;
                    border-radius: 12px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
                }

                .brand-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .navbar-menu {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .nav-item:hover {
                    background: #f1f5f9;
                    color: var(--text-primary);
                }

                .nav-item.active {
                    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1));
                    color: var(--primary-color);
                }

                .nav-icon {
                    width: 18px;
                    height: 18px;
                }

                .navbar-user {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-avatar {
                    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                    padding: 8px;
                    border-radius: 10px;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .user-name {
                    font-weight: 500;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }

                .logout-btn {
                    background: none;
                    border: none;
                    padding: 10px;
                    border-radius: 10px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logout-btn:hover {
                    background: #fef2f2;
                    color: var(--error-color);
                }

                @media (max-width: 1024px) {
                    .nav-item span {
                        display: none;
                    }

                    .nav-item {
                        padding: 10px;
                    }
                }

                @media (max-width: 768px) {
                    .navbar-container {
                        flex-wrap: wrap;
                        height: auto;
                        padding: 16px 0;
                        gap: 16px;
                    }

                    .navbar-menu {
                        order: 3;
                        width: 100%;
                        overflow-x: auto;
                        padding-bottom: 4px;
                    }

                    .nav-item {
                        padding: 8px 12px;
                    }

                    .user-name {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;

