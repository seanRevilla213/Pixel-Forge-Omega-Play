import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiMonitor, FiTrash2 } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import type { Order, Session } from '../types';

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab, setTab] = useState<'orders' | 'sessions'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/my-orders').then(r => setOrders(r.data.orders ?? [])),
      api.get('/auth/sessions').then(r => setSessions(r.data.sessions ?? [])),
    ]).catch(() => {
      // API unreachable — show empty state instead of infinite spinner
      setOrders([]);
      setSessions([]);
    }).finally(() => setLoading(false));
  }, []);

  const revokeSession = async (id: string) => {
    await api.delete(`/auth/sessions/${id}`);
    setSessions(s => s.filter(x => x.id !== id));
  };

  const statusIcon = (s: string) => {
    if (s === 'completed') return <FiCheckCircle className="text-neon-green" />;
    if (s === 'cancelled') return <FiXCircle className="text-neon-red" />;
    return <FiClock className="text-neon-gold" />;
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="glass-strong rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                <span className="font-heading text-2xl font-bold text-dark-900">{user?.username?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-text-primary">{user?.username}</h1>
                <p className="text-text-secondary text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['orders', 'sessions'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : 'glass text-text-secondary hover:text-text-primary'}`}>
                {t === 'orders' ? <span className="flex items-center gap-2"><FiPackage size={16} /> My Orders</span> : <span className="flex items-center gap-2"><FiMonitor size={16} /> Sessions</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          ) : tab === 'orders' ? (
            orders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center"><p className="text-text-secondary">No orders yet</p></div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {statusIcon(order.status)}
                        <span className="text-sm font-medium text-text-primary capitalize">{order.status}</span>
                      </div>
                      <span className="font-heading text-lg font-bold text-neon-cyan">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>Order #{order.id.slice(0, 8)}</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-glass-border space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                            <span className="text-text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              {sessions.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary font-medium">{s.device_info?.substring(0, 60) || 'Unknown Device'}</p>
                    <p className="text-xs text-text-muted mt-1">IP: {s.ip_address} · Created: {new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  <button onClick={() => revokeSession(s.id)} className="p-2 text-text-muted hover:text-neon-red transition-colors" title="Revoke session">
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
