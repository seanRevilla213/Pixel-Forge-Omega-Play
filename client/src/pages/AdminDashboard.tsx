import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox, FiShield } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Stats { totalUsers: number; totalOrders: number; totalProducts: number; totalRevenue: number; }

interface AdminOrder {
  id: string;
  user_id: string;
  username?: string;
  email?: string;
  total: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  items?: Array<{ id: string; product_id: string; quantity: number; price: number; name?: string; }>;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_locked: boolean;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  ip_address: string;
  created_at: string;
}

interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [tab, setTab] = useState<'overview' | 'orders' | 'users' | 'logs' | 'messages'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').then(r => setStats(r.data)),
      api.get('/admin/orders').then(r => setOrders(r.data.orders)),
      api.get('/admin/users').then(r => setUsers(r.data.users)),
      api.get('/admin/audit-logs').then(r => setLogs(r.data.logs)),
      api.get('/admin/messages').then(r => setMessages(r.data.messages)),
    ]).catch(() => toast.error('Failed to load admin data')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
    toast.success('Status updated');
  };

  const statCards = [
    { label: 'Users', value: stats?.totalUsers || 0, Icon: FiUsers, color: 'neon-cyan' },
    { label: 'Orders', value: stats?.totalOrders || 0, Icon: FiShoppingBag, color: 'neon-magenta' },
    { label: 'Products', value: stats?.totalProducts || 0, Icon: FiBox, color: 'neon-purple' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, Icon: FiDollarSign, color: 'neon-green' },
  ];

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'orders' as const, label: 'Orders' },
    { key: 'users' as const, label: 'Users' },
    { key: 'messages' as const, label: 'Messages' },
    { key: 'logs' as const, label: 'Audit Logs' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FiShield className="text-neon-magenta" size={28} />
            <h1 className="font-heading text-3xl font-bold text-text-primary">Admin <span className="text-neon-magenta">Panel</span></h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30' : 'glass text-text-secondary hover:text-text-primary'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
            </div>
          ) : (
            <>
              {/* Stats */}
              {tab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-text-secondary uppercase tracking-wider">{s.label}</span>
                          <s.Icon className={`text-${s.color}`} size={20} />
                        </div>
                        <span className="font-heading text-2xl font-bold text-text-primary">{s.value}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                          <div>
                            <span className="text-sm text-text-primary">{o.username || o.email}</span>
                            <span className="text-xs text-text-muted ml-2">#{o.id.slice(0, 8)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-lg ${o.status === 'completed' ? 'bg-neon-green/20 text-neon-green' : o.status === 'cancelled' ? 'bg-neon-red/20 text-neon-red' : 'bg-neon-gold/20 text-neon-gold'}`}>{o.status}</span>
                            <span className="text-sm font-medium text-neon-cyan">${o.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Orders */}
              {tab === 'orders' && (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o.id} className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium text-text-primary">{o.username || o.email}</span>
                          <span className="text-xs text-text-muted ml-2">{new Date(o.created_at).toLocaleString()}</span>
                        </div>
                        <span className="font-heading text-lg font-bold text-neon-cyan">${o.total?.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {['pending', 'processing', 'completed', 'cancelled'].map(s => (
                          <button key={s} onClick={() => updateStatus(o.id, s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${o.status === s ? (s === 'completed' ? 'bg-neon-green/20 text-neon-green' : s === 'cancelled' ? 'bg-neon-red/20 text-neon-red' : 'bg-neon-gold/20 text-neon-gold') : 'bg-dark-600 text-text-muted hover:text-text-primary'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users */}
              {tab === 'users' && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-glass-border">
                        <th className="text-left p-4 text-xs text-text-secondary uppercase tracking-wider">User</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase tracking-wider">Email</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase tracking-wider">Role</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase tracking-wider">Joined</th>
                      </tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-glass-border/50 hover:bg-white/[0.02]">
                            <td className="p-4 text-text-primary font-medium">{u.username}</td>
                            <td className="p-4 text-text-secondary">{u.email}</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs ${u.role === 'admin' ? 'bg-neon-magenta/20 text-neon-magenta' : 'bg-neon-cyan/20 text-neon-cyan'}`}>{u.role}</span></td>
                            <td className="p-4">{u.is_locked ? <span className="text-neon-red text-xs">Locked</span> : <span className="text-neon-green text-xs">Active</span>}</td>
                            <td className="p-4 text-text-muted text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Messages */}
              {tab === 'messages' && (
                <div className="space-y-4">
                  {messages.length === 0 ? <div className="glass rounded-2xl p-12 text-center text-text-secondary">No messages</div> :
                    messages.map(m => (
                      <div key={m.id} className="glass rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">{m.name} &lt;{m.email}&gt;</span>
                          <span className="text-xs text-text-muted">{new Date(m.created_at).toLocaleString()}</span>
                        </div>
                        <h4 className="text-sm font-medium text-neon-cyan mb-1">{m.subject}</h4>
                        <p className="text-sm text-text-secondary">{m.message}</p>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Audit Logs */}
              {tab === 'logs' && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-glass-border">
                        <th className="text-left p-4 text-xs text-text-secondary uppercase">Time</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase">Action</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase">Resource</th>
                        <th className="text-left p-4 text-xs text-text-secondary uppercase">IP</th>
                      </tr></thead>
                      <tbody>
                        {logs.map(l => (
                          <tr key={l.id} className="border-b border-glass-border/50 hover:bg-white/[0.02]">
                            <td className="p-4 text-text-muted text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                            <td className="p-4 text-text-primary font-mono text-xs">{l.action}</td>
                            <td className="p-4 text-text-secondary text-xs max-w-[200px] truncate">{l.resource}</td>
                            <td className="p-4 text-text-muted text-xs">{l.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
