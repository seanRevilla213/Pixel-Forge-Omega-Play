import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import api from '../api/axiosInstance';
import { sanitizeInput } from '../lib/sanitize';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';
import gsap from 'gsap';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Real-time Gmail Detection
  useEffect(() => {
    const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    if (!form.email) setEmailStatus('idle');
    else if (gmailRegex.test(form.email.toLowerCase())) setEmailStatus('valid');
    else setEmailStatus('invalid');
  }, [form.email]);

  // GSAP Entrance
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power4.out" }
      );
    }
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, message: e.target.value }));
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStatus !== 'valid') return;
    setLoading(true);
    try {
      await api.post('/orders/contact', {
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        subject: sanitizeInput(form.subject),
        message: sanitizeInput(form.message),
      });
      setSent(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen pt-32 pb-24 overflow-hidden px-6">
        <AuroraBackground />
        <AmbientGlow />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-luxury-cyan uppercase mb-6"
            >
              <Sparkles size={12} /> Priority Channel
            </motion.div>
            <h1 className="font-heading font-black text-white leading-tight mb-4" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
              LET'S <span className="bg-gradient-to-r from-luxury-violet to-luxury-cyan bg-clip-text text-transparent">CONNECT</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto font-medium">Experience the next generation of customer support with our luxury interactive portal.</p>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="glasswave-strong rounded-[3rem] p-16 text-center shadow-2xl"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h2 className="font-heading text-3xl font-black text-white mb-4 uppercase tracking-tighter">Transmission Successful</h2>
                <p className="text-text-secondary mb-10 max-w-sm mx-auto font-medium">Your request has been prioritized and encrypted. Expect a response within 2 business hours.</p>
                <button 
                  onClick={() => setSent(false)}
                  className="luxury-btn mx-auto"
                >
                  SEND NEW TRANSMISSION
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                className="glasswave rounded-[3rem] p-10 md:p-16 space-y-8 shadow-2xl relative overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="absolute left-6 top-4 text-[10px] font-black uppercase tracking-widest text-text-muted transition-all group-focus-within:text-luxury-cyan">User Identity</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} 
                      required 
                      className="luxury-input pt-10" 
                      placeholder="FULL NAME"
                    />
                    <div className="liquid-focus" />
                    <User className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted opacity-20" size={24} />
                  </div>

                  <div className="relative group">
                    <label className="absolute left-6 top-4 text-[10px] font-black uppercase tracking-widest text-text-muted transition-all group-focus-within:text-luxury-cyan">Email Address</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} 
                      required 
                      className={`luxury-input pt-10 ${emailStatus === 'valid' ? 'border-green-500/30' : emailStatus === 'invalid' ? 'border-red-500/30' : ''}`} 
                      placeholder="GMAIL ACCOUNT"
                    />
                    <div className="liquid-focus" />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <AnimatePresence>
                        {emailStatus === 'valid' && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest hidden sm:block">Verified Gmail</span>
                            <CheckCircle2 className="text-green-500" size={18} />
                          </motion.div>
                        )}
                        {emailStatus === 'invalid' && form.email && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest hidden sm:block">Invalid Gmail</span>
                            <AlertCircle className="text-red-500" size={18} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Mail className="text-text-muted opacity-20" size={24} />
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <label className="absolute left-6 top-4 text-[10px] font-black uppercase tracking-widest text-text-muted transition-all group-focus-within:text-luxury-cyan">Transmission Topic</label>
                  <input 
                    type="text" 
                    value={form.subject} 
                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} 
                    required 
                    className="luxury-input pt-10" 
                    placeholder="WHAT IS YOUR REQUEST?"
                  />
                  <div className="liquid-focus" />
                </div>

                <div className="relative group">
                  <label className="absolute left-6 top-4 text-[10px] font-black uppercase tracking-widest text-text-muted transition-all group-focus-within:text-luxury-cyan">Message Content</label>
                  <textarea 
                    ref={textareaRef}
                    value={form.message} 
                    onChange={handleTextareaChange} 
                    required 
                    rows={4}
                    className="luxury-input pt-12 resize-none min-h-[150px] leading-relaxed overflow-hidden" 
                    placeholder="DESCRIBE YOUR VISION..."
                  />
                  <div className="liquid-focus" />
                  <MessageSquare className="absolute right-6 top-8 text-text-muted opacity-20" size={24} />
                  
                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {form.message && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute bottom-4 right-6 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 bg-luxury-cyan rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-luxury-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-luxury-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button 
                  type="submit" 
                  disabled={loading || emailStatus !== 'valid'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="luxury-btn w-full disabled:opacity-30 disabled:grayscale transition-all py-6"
                >
                  <span className="flex items-center gap-3">
                    {loading ? 'UPLOADING DATA...' : 'ENCRYPT & SEND'}
                    <Send size={18} />
                  </span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
