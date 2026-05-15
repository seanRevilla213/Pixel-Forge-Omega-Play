import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import api from '../api/axiosInstance';
import { sanitizeInput } from '../lib/sanitize';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders/contact', {
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        subject: sanitizeInput(form.subject),
        message: sanitizeInput(form.message),
      });
      setSent(true);
      toast.success('Message sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-3">
              Get in <span className="text-neon-cyan">Touch</span>
            </h1>
            <p className="text-text-secondary text-lg">We'd love to hear from you. Drop us a message!</p>
          </div>

          {sent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center">
                <FiSend className="text-neon-green" size={28} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">Message Sent!</h2>
              <p className="text-text-secondary">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 text-neon-cyan hover:text-neon-magenta text-sm transition-colors">Send another</button>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 md:p-10 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required minLength={2} maxLength={100}
                      className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors" placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required maxLength={255}
                      className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} required minLength={5} maxLength={200}
                  className="w-full px-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors" placeholder="What's this about?" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Message</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-4 text-text-muted" size={16} />
                  <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required minLength={10} maxLength={5000}
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none h-36" placeholder="Tell us more..." />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold flex items-center justify-center gap-2 btn-hover-lift disabled:opacity-50">
                <FiSend size={16} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
