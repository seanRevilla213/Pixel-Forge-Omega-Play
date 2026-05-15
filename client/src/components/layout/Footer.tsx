import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-glass-border bg-dark-900/80">
      <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                <img 
                  src="https://images.mirror.co.uk/mirror/xbox-360-controller.jpg" 
                  alt="Pixel Forge Logo" 
                  className="w-full h-full object-cover grayscale" 
                />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold tracking-wider text-text-primary">PIXEL FORGE</h3>
                <p className="text-[10px] tracking-[0.3em] text-luxury-cyan/60 uppercase">Xbox 360 Wireless Controller</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Premium gaming marketplace for the next generation of players.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs tracking-wider text-text-primary mb-4 uppercase">Shop</h4>
            <ul className="space-y-2">
              {['All Games', 'New Releases', 'Top Rated', 'On Sale'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-text-secondary hover:text-neon-cyan transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-xs tracking-wider text-text-primary mb-4 uppercase">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQ', to: '/contact' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-text-secondary hover:text-neon-cyan transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-xs tracking-wider text-text-primary mb-4 uppercase">Connect</h4>
            <div className="flex gap-3">
              {[
                { Icon: FiGithub, href: '#' },
                { Icon: FiTwitter, href: '#' },
                { Icon: FiMail, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-secondary hover:text-neon-cyan hover:neon-glow-cyan transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Pixel Forge Omega Play. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            Made with <FiHeart className="text-neon-magenta" size={12} /> by Pixel Forge Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
